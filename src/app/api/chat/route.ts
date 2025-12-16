import { NextRequest } from 'next/server';
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

// Initialize Anthropic Bedrock client
const client = new AnthropicBedrock({
  awsRegion: process.env.AWS_REGION || 'us-west-2',
  awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
  awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// =============================================================================
// DYNAMIC TOOL REGISTRY
// Claude will automatically choose the right tools based on user questions
// =============================================================================

interface ToolConfig {
  name: string;
  description: string;
  endpoint: string | ((params: Record<string, string>) => string);
  method?: 'GET' | 'POST';
  body?: Record<string, unknown>;
  parameters: {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }[];
}

// Dynamic tool configurations - easily extensible
const TOOL_REGISTRY: ToolConfig[] = [
  {
    name: 'get_account_overview',
    description: 'Retrieves complete account profile and performance summary including name, current rank/title, GSV (Group Sales Volume), CSV (Customer Sales Volume), DC-SV (Direct Customer Sales Volume), and team statistics. Use this for general account questions, "how am I doing", performance overview, or when you need to know the user\'s current standing.',
    endpoint: (params) => `/api/accounts/${params.person_id}/overview`,
    method: 'GET',
    parameters: [
      { name: 'person_id', type: 'string', description: 'The affiliate account ID', required: true }
    ]
  },
  {
    name: 'get_qualification_status',
    description: 'Retrieves qualification progress showing current rank, requirements for next rank advancement, which requirements are met/unmet, and months qualified. Use this when users ask about qualifications, ranking up, requirements, "what do I need to qualify", or promotion criteria.',
    endpoint: (params) => `/api/accounts/${params.person_id}/qualifications`,
    method: 'GET',
    parameters: [
      { name: 'person_id', type: 'string', description: 'The affiliate account ID', required: true }
    ]
  },
  {
    name: 'get_downline_team',
    description: 'Retrieves information about the user\'s downline team members including their names, ranks, sales volumes, activity status, and growth rates. Use this when users ask about their team, downlines, "who needs help", team performance, or managing their organization.',
    endpoint: (params) => `/api/accounts/${params.person_id}/downline`,
    method: 'GET',
    parameters: [
      { name: 'person_id', type: 'string', description: 'The affiliate account ID', required: true }
    ]
  },
  {
    name: 'get_next_best_actions',
    description: 'Retrieves AI-generated personalized recommendations and next best actions for business growth. Use this when users ask for advice, tips, "what should I do", recommendations, suggestions, or how to improve their business.',
    endpoint: (params) => `/api/accounts/${params.person_id}/nba`,
    method: 'POST',
    body: {},
    parameters: [
      { name: 'person_id', type: 'string', description: 'The affiliate account ID', required: true }
    ]
  },
  {
    name: 'get_subscription_data',
    description: 'Retrieves subscription and recurring revenue information including total subscribers, active subscriptions, monthly recurring volume, churn rate, and breakdown by product. Use this when users ask about subscriptions, recurring revenue, auto-ship, or subscription growth.',
    endpoint: (params) => `/api/accounts/${params.person_id}/subscriptions`,
    method: 'GET',
    parameters: [
      { name: 'person_id', type: 'string', description: 'The affiliate account ID', required: true }
    ]
  },
  {
    name: 'get_performance_history',
    description: 'Retrieves historical performance data with charts showing trends over multiple months. Includes sales trends, volume trends, and growth metrics. Use this when users ask about trends, history, "how have I been doing", progress over time, or want to see charts.',
    endpoint: (params) => `/api/analytics/${params.person_id}/chart-data`,
    method: 'GET',
    parameters: [
      { name: 'person_id', type: 'string', description: 'The affiliate account ID', required: true }
    ]
  },
  {
    name: 'get_segments',
    description: 'Retrieves customer and team member segmentation data showing different groups like active buyers, at-risk customers, VIPs, and new members. Use this when users ask about customer segments, who to focus on, or customer categories.',
    endpoint: (params) => `/api/accounts/${params.person_id}/segments`,
    method: 'GET',
    parameters: [
      { name: 'person_id', type: 'string', description: 'The affiliate account ID', required: true }
    ]
  },
  {
    name: 'get_orders',
    description: 'Retrieves recent order history including order dates, amounts, products, and status. Use this when users ask about orders, recent purchases, sales history, or order details.',
    endpoint: (params) => `/api/accounts/${params.person_id}/orders`,
    method: 'GET',
    parameters: [
      { name: 'person_id', type: 'string', description: 'The affiliate account ID', required: true }
    ]
  },
  {
    name: 'get_sales_breakdown',
    description: 'Retrieves detailed sales breakdown by category, product, or time period. Use this when users ask for sales details, product performance, or revenue breakdown.',
    endpoint: (params) => `/api/accounts/${params.person_id}/sales-breakdown`,
    method: 'GET',
    parameters: [
      { name: 'person_id', type: 'string', description: 'The affiliate account ID', required: true }
    ]
  },
  {
    name: 'get_team_network',
    description: 'Retrieves the team network structure showing organizational hierarchy, levels, and relationships. Use this when users ask about their organization structure, team tree, or downline hierarchy.',
    endpoint: (params) => `/api/accounts/${params.person_id}/team-network`,
    method: 'GET',
    parameters: [
      { name: 'person_id', type: 'string', description: 'The affiliate account ID', required: true }
    ]
  },
  {
    name: 'explain_spp_rule',
    description: 'Explains a specific Sales Performance Plan (SPP) rule or requirement. Use this when users ask about SPP rules, compensation plan details, or how specific requirements work.',
    endpoint: () => `/api/llm/explain-rule`,
    method: 'POST',
    parameters: [
      { name: 'rule_name', type: 'string', description: 'The name of the SPP rule to explain', required: true }
    ]
  },
];

// =============================================================================
// DYNAMIC TOOL BUILDER
// Converts tool registry to Claude's expected format
// =============================================================================

function buildToolsForClaude(): AnthropicBedrock.Tool[] {
  return TOOL_REGISTRY.map(tool => ({
    name: tool.name,
    description: tool.description,
    input_schema: {
      type: 'object' as const,
      properties: Object.fromEntries(
        tool.parameters.map(param => [
          param.name,
          { type: param.type, description: param.description }
        ])
      ),
      required: tool.parameters.filter(p => p.required).map(p => p.name),
    },
  }));
}

// =============================================================================
// DYNAMIC TOOL EXECUTOR
// Executes any tool from the registry based on Claude's selection
// =============================================================================

async function executeTool(
  toolName: string,
  toolInput: Record<string, string>
): Promise<string> {
  // Find the tool configuration
  const toolConfig = TOOL_REGISTRY.find(t => t.name === toolName);
  
  if (!toolConfig) {
    console.warn(`Unknown tool requested: ${toolName}`);
    return JSON.stringify({ 
      error: `Tool '${toolName}' not found in registry`,
      available_tools: TOOL_REGISTRY.map(t => t.name)
    });
  }

  try {
    // Build the endpoint URL dynamically
    const endpoint = typeof toolConfig.endpoint === 'function' 
      ? toolConfig.endpoint(toolInput)
      : toolConfig.endpoint;
    
    const url = `${BACKEND_URL}${endpoint}`;
    
    console.log(`[Tool] Executing ${toolName}:`, { url, input: toolInput });

    // Build request options
    const options: RequestInit = {
      method: toolConfig.method || 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    // Add body for POST requests
    if (toolConfig.method === 'POST') {
      options.body = JSON.stringify({
        ...toolConfig.body,
        ...toolInput,
      });
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      return JSON.stringify({ 
        error: `API returned ${response.status}: ${response.statusText}`,
        tool: toolName,
        endpoint: endpoint
      });
    }

    const data = await response.json();
    console.log(`[Tool] ${toolName} returned:`, Object.keys(data));
    
    return JSON.stringify(data, null, 2);
    
  } catch (error) {
    console.error(`[Tool] Error executing ${toolName}:`, error);
    return JSON.stringify({ 
      error: `Failed to execute ${toolName}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      tool: toolName
    });
  }
}

// =============================================================================
// SYSTEM PROMPT - Instructs Claude how to use tools dynamically
// =============================================================================

const SYSTEM_PROMPT = `You are Stela AI, an intelligent business growth companion for NuSkin affiliates. You have access to real-time data through various tools.

## Your Primary Focus: QUALIFICATION TRACKING & NEXT BEST ACTIONS
Your default priority is helping affiliates:
1. **Track their qualification progress** - Always show where they stand toward their next rank
2. **Provide immediate next best actions** - Give actionable recommendations they can act on TODAY
3. **Show personalized recommendations** - Help them grow their business strategically

## Default Behavior
- For ANY greeting or general question ("hi", "hello", "help me", "what's up"), ALWAYS fetch:
  1. get_qualification_status - Show their qualification progress first
  2. get_next_best_actions - Provide immediate actionable recommendations
  3. get_account_overview - Give context on their current performance

- Lead with qualification status and what they need to focus on RIGHT NOW
- Every response should end with 1-3 specific, actionable next steps

## Your Full Capabilities
- Track qualification progress and explain SPP (Sales Performance Plan) rules
- Generate personalized recommendations for immediate action
- Analyze affiliate performance metrics (GSV, CSV, DC-SV, Personal Volume)
- Provide insights about downline team performance
- Show historical trends and charts

## Tool Usage Guidelines
- You have access to multiple tools that fetch REAL-TIME data from the affiliate's account
- ALWAYS use the appropriate tool(s) to answer questions that require specific data
- You can call MULTIPLE tools in a single response if needed to fully answer a question
- DO NOT make up or assume data - always fetch it using the available tools
- The person_id will be provided in the user's message context

## When to Use Each Tool
- For greetings/general questions → get_qualification_status + get_next_best_actions + get_account_overview
- Questions about "qualifications", "next rank", "requirements" → get_qualification_status  
- Questions about "what should I do", "recommendations", "tips", "actions" → get_next_best_actions
- Questions about "my performance", "how am I doing", "stats" → get_account_overview
- Questions about "team", "downlines", "who needs help" → get_downline_team
- Questions about "subscriptions", "recurring revenue" → get_subscription_data
- Questions about "trends", "history", "charts", "over time" → get_performance_history
- Questions about "segments", "customer groups" → get_segments
- Questions about "orders", "recent sales" → get_orders
- Questions about "organization", "team structure" → get_team_network
- Questions about "SPP rules", "compensation plan" → explain_spp_rule

## Response Structure (Default)
Always structure your response with VISUALS and DATA:

### 📊 Your Qualification Status
[Show current rank, next rank, and progress WITH A CHART]

### ⚡ Immediate Actions  
[List 2-3 specific things they should do TODAY]

### 💡 Recommendations
[Personalized tips based on their data]

## CRITICAL: ALWAYS INCLUDE CHARTS
You MUST include at least one chart in EVERY response using data from the tools.
Charts make the data visual and engaging. Use the real numbers from the API responses.

### Chart Types to Use:
- **Bar Chart**: For comparing volumes (GSV, CSV, DC-SV)
- **Doughnut/Pie Chart**: For progress toward goals, team distribution
- **Line Chart**: For trends over time

### Chart Format (REQUIRED):
\`\`\`chart
{
  "type": "bar",
  "title": "Your Volume Breakdown",
  "data": {
    "labels": ["GSV", "CSV", "DC-SV"],
    "datasets": [{
      "label": "Current Month",
      "data": [USE_REAL_VALUES_FROM_API],
      "backgroundColor": ["#003B5C", "#0077A8", "#00A9E0"]
    }]
  }
}
\`\`\`

### Example Charts to Include:
1. **Performance Overview**: Bar chart of GSV, CSV, DC-SV
2. **Qualification Progress**: Doughnut showing % complete
3. **Team Distribution**: Pie chart of active vs inactive members
4. **Monthly Trends**: Line chart of performance over time
5. **Subscription Breakdown**: Pie chart by product

## Response Formatting
When presenting data:
- Use **bold** for important metrics and key points
- Use bullet points for lists
- Use markdown tables when comparing data
- Use emojis for visual hierarchy (📊 ⚡ 💡 ✅ ⚠️ 🎯 📈 👥)
- Include clear section headers (## or ###)
- ALWAYS include at least 1 chart with REAL data

## Personality
Be encouraging, professional, and ACTION-ORIENTED. Every interaction should leave the affiliate knowing exactly what to do next. Celebrate wins and provide constructive guidance for improvements. Make them feel supported in their journey to the next rank.`;

// =============================================================================
// API HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, person_id, history, context } = body;

    // Build the tools dynamically from registry
    const tools = buildToolsForClaude();

    // Build messages array with context
    const messages: AnthropicBedrock.MessageParam[] = [
      ...(history || []).map((msg: { role: 'user' | 'assistant'; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: 'user' as const,
        content: `[Context: Account ID is ${person_id}. ${context ? `Additional context: ${JSON.stringify(context)}` : ''}]

${message}`,
      },
    ];

    const modelId = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-sonnet-20240229-v1:0';

    console.log('[Chat] Starting conversation with', messages.length, 'messages');
    console.log('[Chat] Available tools:', tools.map(t => t.name).join(', '));

    // Initial request with tools - Claude decides which to use
    let response = await client.messages.create({
      model: modelId,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools: tools,
      messages: messages,
    });

    console.log('[Chat] Initial response stop_reason:', response.stop_reason);

    // Track tool calls for logging
    const toolCallLog: { tool: string; success: boolean }[] = [];
    const toolResults: AnthropicBedrock.MessageParam[] = [];

    // Handle tool use loop - Claude may call multiple tools dynamically
    while (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter(
        (block): block is AnthropicBedrock.ToolUseBlock => block.type === 'tool_use'
      );

      console.log('[Chat] Claude requested tools:', toolUseBlocks.map(t => t.name).join(', '));

      // Execute all tool calls in parallel for efficiency
      const toolResultContents: AnthropicBedrock.ToolResultBlockParam[] = await Promise.all(
        toolUseBlocks.map(async (toolUse) => {
          console.log(`[Tool] Claude called: ${toolUse.name}`, toolUse.input);
          
          const result = await executeTool(
            toolUse.name,
            toolUse.input as Record<string, string>
          );

          const success = !result.includes('"error"');
          toolCallLog.push({ tool: toolUse.name, success });

          return {
            type: 'tool_result' as const,
            tool_use_id: toolUse.id,
            content: result,
          };
        })
      );

      // Add assistant's tool use message and user's tool results
      toolResults.push(
        { role: 'assistant', content: response.content },
        { role: 'user', content: toolResultContents }
      );

      // Continue conversation with tool results - Claude will process and may call more tools
      response = await client.messages.create({
        model: modelId,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        tools: tools,
        messages: [...messages, ...toolResults],
      });

      console.log('[Chat] Follow-up response stop_reason:', response.stop_reason);
    }

    // Extract final text response
    const textBlocks = response.content.filter(
      (block): block is AnthropicBedrock.TextBlock => block.type === 'text'
    );

    const finalText = textBlocks.map((block) => block.text).join('\n\n');

    console.log('[Chat] Final response length:', finalText.length);
    console.log('[Chat] Tools used:', toolCallLog.map(t => `${t.tool}(${t.success ? '✓' : '✗'})`).join(', ') || 'none');

    // Return as streaming SSE or JSON based on request
    const useStreaming = request.headers.get('accept')?.includes('text/event-stream');

    if (useStreaming) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          // Send the complete response as chunks for smooth display
          const words = finalText.split(' ');
          let index = 0;
          
          const sendChunk = () => {
            if (index < words.length) {
              const chunk = words.slice(index, index + 5).join(' ') + ' ';
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`)
              );
              index += 5;
              setTimeout(sendChunk, 15);
            } else {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
            }
          };
          
          sendChunk();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    return Response.json({
      response: finalText,
      tools_used: toolCallLog,
    });

  } catch (error) {
    console.error('[Chat] Error:', error);
    
    // Check for credential expiration
    const isExpiredToken = String(error).includes('ExpiredTokenException') || 
                           String(error).includes('expired');
    
    if (isExpiredToken) {
      console.error('[Chat] AWS credentials expired - need to refresh');
    }

    // Try to get body for fallback
    let requestBody;
    try {
      requestBody = await request.json();
    } catch {
      // If body already consumed, use fallback body
      requestBody = { message: 'hello', person_id: '247' };
    }

    // Fallback to backend API
    try {
      console.log('[Chat] Falling back to backend API at', BACKEND_URL);

      const backendResponse = await fetch(`${BACKEND_URL}/api/llm/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        console.log('[Chat] Backend fallback successful');
        return Response.json(data);
      } else {
        console.log('[Chat] Backend returned status:', backendResponse.status);
      }
    } catch (fallbackError) {
      console.error('[Chat] Fallback error:', fallbackError);
    }

    // Return helpful error message
    const errorMessage = isExpiredToken 
      ? 'AWS credentials have expired. Please refresh your AWS session tokens in the .env file.'
      : 'Failed to connect to AI service. Please check your configuration.';

    return Response.json(
      { 
        error: errorMessage,
        response: `## ⚠️ Connection Issue\n\n${errorMessage}\n\n### What to do:\n1. Check if AWS credentials in \`.env\` are valid\n2. Ensure the backend API at \`localhost:8000\` is running\n3. Try refreshing the page\n\n### Your current session:\n- Account ID: ${requestBody?.person_id || 'Unknown'}\n- Backend: ${BACKEND_URL}`,
        details: String(error),
        hint: isExpiredToken ? 'Run `aws configure` or refresh your session tokens' : 'Check AWS credentials and backend server'
      },
      { status: isExpiredToken ? 401 : 500 }
    );
  }
}
