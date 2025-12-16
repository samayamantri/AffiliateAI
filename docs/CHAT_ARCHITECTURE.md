# Stela AI Chat Architecture

## Current Implementation Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    FRONTEND (Next.js)                                    │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                           ChatInterface.tsx                                       │   │
│  │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │   │
│  │  │  User Input  │───▶│ Send Message │───▶│ Show Loading │───▶│Parse Response│   │   │
│  │  │   (textarea) │    │   Handler    │    │   State      │    │  + Charts    │   │   │
│  │  └──────────────┘    └──────┬───────┘    └──────────────┘    └──────────────┘   │   │
│  │                             │                                        ▲           │   │
│  │                             ▼                                        │           │   │
│  │                    ┌────────────────┐                               │           │   │
│  │                    │  Build Request │                               │           │   │
│  │                    │  + Context     │                               │           │   │
│  │                    │  + History     │                               │           │   │
│  │                    └────────┬───────┘                               │           │   │
│  └─────────────────────────────┼───────────────────────────────────────┼───────────┘   │
│                                │                                        │               │
│                                ▼                                        │               │
│  ┌─────────────────────────────────────────────────────────────────────┴───────────┐   │
│  │                         /api/chat (Next.js API Route)                            │   │
│  │                                                                                   │   │
│  │   ┌────────────────────────────────────────────────────────────────────────┐    │   │
│  │   │                        Request Handler                                  │    │   │
│  │   │                                                                         │    │   │
│  │   │  1. Parse request body (message, person_id, context, history)          │    │   │
│  │   │  2. Build messages array with conversation history                      │    │   │
│  │   │  3. Check for streaming header                                          │    │   │
│  │   └────────────────────────────────────────────────────────────────────────┘    │   │
│  │                                    │                                             │   │
│  │                    ┌───────────────┴───────────────┐                            │   │
│  │                    ▼                               ▼                            │   │
│  │   ┌────────────────────────────┐   ┌────────────────────────────┐              │   │
│  │   │   STREAMING MODE           │   │   NON-STREAMING MODE       │              │   │
│  │   │   (Accept: text/event-     │   │   (Default)                │              │   │
│  │   │    stream)                 │   │                            │              │   │
│  │   │                            │   │   Fallback to Backend      │              │   │
│  │   │   Uses AWS Bedrock SDK     │   │   at localhost:8000        │              │   │
│  │   │   directly with Claude     │   │                            │              │   │
│  │   └─────────────┬──────────────┘   └─────────────┬──────────────┘              │   │
│  │                 │                                 │                             │   │
│  └─────────────────┼─────────────────────────────────┼─────────────────────────────┘   │
│                    │                                 │                                  │
└────────────────────┼─────────────────────────────────┼──────────────────────────────────┘
                     │                                 │
                     ▼                                 ▼
┌────────────────────────────────┐   ┌────────────────────────────────────────────────────┐
│       AWS BEDROCK              │   │              BACKEND API                            │
│                                │   │           (localhost:8000)                          │
│  ┌──────────────────────────┐  │   │                                                     │
│  │  BedrockRuntimeClient    │  │   │  ┌───────────────────────────────────────────────┐ │
│  │                          │  │   │  │  /api/llm/chat                                │ │
│  │  InvokeModelWithResponse │  │   │  │                                               │ │
│  │  StreamCommand           │  │   │  │  - May use Bedrock internally                 │ │
│  │                          │  │   │  │  - Has access to MCP tools                    │ │
│  │  Model: Claude 3 Sonnet  │  │   │  │  - Can access account data                    │ │
│  └──────────────────────────┘  │   │  │  - Returns structured response                │ │
│                                │   │  └───────────────────────────────────────────────┘ │
│  Required ENV:                 │   │                                                     │
│  - AWS_REGION                  │   │  ┌───────────────────────────────────────────────┐ │
│  - AWS_ACCESS_KEY_ID           │   │  │  MCP Server (localhost:3000)                  │ │
│  - AWS_SECRET_ACCESS_KEY       │   │  │  - Account tools                              │ │
│  - BEDROCK_MODEL_ID            │   │  │  - Analytics tools                            │ │
│                                │   │  │  - Qualification tools                        │ │
└────────────────────────────────┘   │  │  - NBA tools                                  │ │
                                     │  └───────────────────────────────────────────────┘ │
                                     └────────────────────────────────────────────────────┘
```

## Best Practices Analysis

### ✅ What's Done Well

| Practice | Implementation | Status |
|----------|---------------|--------|
| **Server-side API Keys** | API keys stored in env vars, not exposed to client | ✅ |
| **Streaming Support** | Uses SSE for real-time responses | ✅ |
| **Conversation History** | Maintains context across messages | ✅ |
| **System Prompt** | Clear, structured system instructions | ✅ |
| **Fallback Strategy** | Graceful degradation to backend API | ✅ |
| **Error Handling** | Try-catch with fallback responses | ✅ |
| **Context Injection** | Account data passed to LLM | ✅ |

### ⚠️ Areas for Improvement

| Practice | Current State | Recommendation |
|----------|--------------|----------------|
| **Anthropic SDK** | Using AWS SDK directly | Consider `@anthropic-ai/sdk` with Bedrock adapter for cleaner API |
| **Tool Use** | Not implemented | Add MCP tool integration for real-time data |
| **Rate Limiting** | Not implemented | Add request throttling |
| **Response Caching** | Not implemented | Cache common queries |
| **Token Counting** | Not implemented | Track usage for cost control |

## Recommended Architecture (Best Practices)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    FRONTEND                                              │
│                                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              ChatInterface.tsx                                    │   │
│  │                                                                                   │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │   │
│  │  │ User Input  │─▶│Message Queue│─▶│   Stream    │─▶│  Rich Content Renderer  │ │   │
│  │  │             │  │  + Context  │  │   Handler   │  │  - Markdown             │ │   │
│  │  │             │  │             │  │             │  │  - Charts (Chart.js)    │ │   │
│  │  │             │  │             │  │             │  │  - Tables               │ │   │
│  │  │             │  │             │  │             │  │  - Code blocks          │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────────────────────────┘   │
│                                          │                                               │
└──────────────────────────────────────────┼───────────────────────────────────────────────┘
                                           │ fetch('/api/chat', { stream: true })
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              NEXT.JS API ROUTE (/api/chat)                               │
│                                                                                          │
│  ┌────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                              Request Pipeline                                       │ │
│  │                                                                                     │ │
│  │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │ │
│  │  │ Rate Limiter │───▶│   Validate   │───▶│  Enrich with │───▶│   Route to   │     │ │
│  │  │              │    │   Request    │    │   Context    │    │   Provider   │     │ │
│  │  └──────────────┘    └──────────────┘    └──────────────┘    └──────┬───────┘     │ │
│  │                                                                      │             │ │
│  └──────────────────────────────────────────────────────────────────────┼─────────────┘ │
│                                                                         │               │
│  ┌──────────────────────────────────────────────────────────────────────┼─────────────┐ │
│  │                         Claude Agent SDK Layer                        │             │ │
│  │                                                                       ▼             │ │
│  │  ┌─────────────────────────────────────────────────────────────────────────────┐   │ │
│  │  │                    Anthropic Client (via Bedrock)                            │   │ │
│  │  │                                                                              │   │ │
│  │  │   import Anthropic from '@anthropic-ai/sdk';                                 │   │ │
│  │  │   import { AnthropicBedrock } from '@anthropic-ai/bedrock-sdk';              │   │ │
│  │  │                                                                              │   │ │
│  │  │   const client = new AnthropicBedrock({                                      │   │ │
│  │  │     awsRegion: process.env.AWS_REGION,                                       │   │ │
│  │  │   });                                                                        │   │ │
│  │  │                                                                              │   │ │
│  │  │   const stream = await client.messages.stream({                              │   │ │
│  │  │     model: 'anthropic.claude-3-sonnet-20240229-v1:0',                        │   │ │
│  │  │     max_tokens: 4096,                                                        │   │ │
│  │  │     system: SYSTEM_PROMPT,                                                   │   │ │
│  │  │     messages: messages,                                                      │   │ │
│  │  │     tools: mcpTools,  // <-- MCP Integration                                 │   │ │
│  │  │   });                                                                        │   │ │
│  │  └─────────────────────────────────────────────────────────────────────────────┘   │ │
│  │                                          │                                          │ │
│  │                                          ▼                                          │ │
│  │  ┌─────────────────────────────────────────────────────────────────────────────┐   │ │
│  │  │                         Tool Execution Layer                                 │   │ │
│  │  │                                                                              │   │ │
│  │  │   if (response.stop_reason === 'tool_use') {                                 │   │ │
│  │  │     const toolResult = await executeMCPTool(toolCall);                       │   │ │
│  │  │     // Continue conversation with tool result                                │   │ │
│  │  │   }                                                                          │   │ │
│  │  └─────────────────────────────────────────────────────────────────────────────┘   │ │
│  │                                                                                     │ │
│  └─────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                   EXTERNAL SERVICES                                      │
│                                                                                          │
│  ┌────────────────────────┐    ┌────────────────────────┐    ┌────────────────────────┐ │
│  │     AWS BEDROCK        │    │     MCP SERVER         │    │    BACKEND API         │ │
│  │                        │    │   (localhost:3000)     │    │  (localhost:8000)      │ │
│  │  ┌──────────────────┐  │    │                        │    │                        │ │
│  │  │ Claude 3 Sonnet  │  │    │  Tools:                │    │  Endpoints:            │ │
│  │  │ Claude 3 Opus    │  │    │  - get_account_data    │    │  - /api/accounts/      │ │
│  │  │ Claude 3 Haiku   │  │    │  - get_qualifications  │    │  - /api/analytics/     │ │
│  │  │ Claude 3.5 Sonnet│  │    │  - get_nba             │    │  - /api/llm/           │ │
│  │  └──────────────────┘  │    │  - get_downlines       │    │  - /api/crm/           │ │
│  │                        │    │  - calculate_progress  │    │                        │ │
│  └────────────────────────┘    └────────────────────────┘    └────────────────────────┘ │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Sequence

```
User                ChatInterface         /api/chat            Claude (Bedrock)        MCP Tools
 │                       │                    │                      │                    │
 │  "How can I grow?"    │                    │                      │                    │
 ├──────────────────────▶│                    │                      │                    │
 │                       │  POST /api/chat    │                      │                    │
 │                       ├───────────────────▶│                      │                    │
 │                       │                    │  messages.stream()   │                    │
 │                       │                    ├─────────────────────▶│                    │
 │                       │                    │                      │                    │
 │                       │                    │  tool_use: get_data  │                    │
 │                       │                    │◀─────────────────────┤                    │
 │                       │                    │                      │                    │
 │                       │                    │  Execute MCP tool    │                    │
 │                       │                    ├─────────────────────────────────────────▶│
 │                       │                    │                      │                    │
 │                       │                    │  Tool result (data)  │                    │
 │                       │                    │◀─────────────────────────────────────────┤
 │                       │                    │                      │                    │
 │                       │                    │  Continue with data  │                    │
 │                       │                    ├─────────────────────▶│                    │
 │                       │                    │                      │                    │
 │                       │                    │  Stream: text chunks │                    │
 │                       │                    │◀─────────────────────┤                    │
 │                       │  SSE: data chunks  │                      │                    │
 │                       │◀───────────────────┤                      │                    │
 │   Streaming response  │                    │                      │                    │
 │◀──────────────────────┤                    │                      │                    │
 │                       │                    │                      │                    │
```

## Recommended Implementation

To follow best practices with the Anthropic SDK and Bedrock:

### 1. Install the Anthropic Bedrock SDK

```bash
npm install @anthropic-ai/bedrock-sdk
```

### 2. Updated API Route (Best Practice)

```typescript
// /api/chat/route.ts
import { AnthropicBedrock } from '@anthropic-ai/bedrock-sdk';
import { NextRequest } from 'next/server';

const client = new AnthropicBedrock({
  awsRegion: process.env.AWS_REGION || 'us-west-2',
});

// Define MCP tools for Claude
const tools = [
  {
    name: 'get_account_performance',
    description: 'Get current account performance metrics including GSV, CSV, DC-SV',
    input_schema: {
      type: 'object',
      properties: {
        person_id: { type: 'string', description: 'The account ID' },
      },
      required: ['person_id'],
    },
  },
  {
    name: 'get_qualification_status',
    description: 'Get qualification progress for the next rank',
    input_schema: {
      type: 'object',
      properties: {
        person_id: { type: 'string', description: 'The account ID' },
      },
      required: ['person_id'],
    },
  },
  {
    name: 'get_team_insights',
    description: 'Get insights about downline team performance',
    input_schema: {
      type: 'object',
      properties: {
        person_id: { type: 'string', description: 'The account ID' },
      },
      required: ['person_id'],
    },
  },
];

// Tool execution handler
async function executeTool(toolName: string, toolInput: Record<string, unknown>) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  switch (toolName) {
    case 'get_account_performance':
      const perfRes = await fetch(`${backendUrl}/api/accounts/${toolInput.person_id}/overview`);
      return perfRes.json();
    
    case 'get_qualification_status':
      const qualRes = await fetch(`${backendUrl}/api/accounts/${toolInput.person_id}/qualifications`);
      return qualRes.json();
    
    case 'get_team_insights':
      const teamRes = await fetch(`${backendUrl}/api/accounts/${toolInput.person_id}/downline`);
      return teamRes.json();
    
    default:
      return { error: 'Unknown tool' };
  }
}

export async function POST(request: NextRequest) {
  const { message, person_id, history } = await request.json();
  
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Initial request with tools
        let response = await client.messages.create({
          model: 'anthropic.claude-3-sonnet-20240229-v1:0',
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          tools: tools,
          messages: [
            ...(history || []),
            { role: 'user', content: message },
          ],
        });

        // Handle tool use loop
        while (response.stop_reason === 'tool_use') {
          const toolUseBlock = response.content.find(
            (block) => block.type === 'tool_use'
          );
          
          if (toolUseBlock) {
            const toolResult = await executeTool(
              toolUseBlock.name,
              toolUseBlock.input
            );
            
            // Continue conversation with tool result
            response = await client.messages.create({
              model: 'anthropic.claude-3-sonnet-20240229-v1:0',
              max_tokens: 4096,
              system: SYSTEM_PROMPT,
              tools: tools,
              messages: [
                ...(history || []),
                { role: 'user', content: message },
                { role: 'assistant', content: response.content },
                {
                  role: 'user',
                  content: [{
                    type: 'tool_result',
                    tool_use_id: toolUseBlock.id,
                    content: JSON.stringify(toolResult),
                  }],
                },
              ],
            });
          }
        }

        // Stream the final text response
        const textContent = response.content.find(
          (block) => block.type === 'text'
        );
        
        if (textContent) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: textContent.text })}\n\n`)
          );
        }
        
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}
```

## Environment Configuration

```env
# AWS Bedrock Configuration
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Model Selection
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# MCP Server
NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:3000
```

## Key Differences: Current vs Best Practice

| Aspect | Current Implementation | Best Practice |
|--------|----------------------|---------------|
| **SDK** | `@aws-sdk/client-bedrock-runtime` | `@anthropic-ai/bedrock-sdk` |
| **Streaming** | Manual chunk parsing | Built-in streaming API |
| **Tools** | Not integrated | MCP tools for real-time data |
| **Error Handling** | Fallback to backend | Retry logic + graceful degradation |
| **Response Format** | Plain text + charts | Structured with tool results |

## Summary

The current implementation is **functional** but can be enhanced by:

1. **Using the Anthropic Bedrock SDK** for cleaner API and better streaming
2. **Adding tool use** to allow Claude to fetch real-time data
3. **Implementing proper MCP integration** for tool execution
4. **Adding rate limiting and caching** for production use

The flow diagram above shows both the current state and the recommended architecture for a production-ready Claude Agent integration.

