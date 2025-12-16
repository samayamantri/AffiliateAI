# Stela AI - Affiliate Growth Platform

A Progressive Web App (PWA) designed to help NuSkin affiliates grow their business with AI-powered insights, rich visualizations, and personalized recommendations.

![Stela AI Dashboard](./screenshots/dashboard.png)

## ✨ Features

### 📊 Dashboard
- Real-time performance metrics
- Sales and volume trend charts
- Subscription analytics
- AI-powered insights

### 🎯 Qualification Tracker
- Progress towards next rank
- Requirement breakdown
- Historical rank journey
- Personalized tips

### 👥 Team Management
- Downline performance overview
- Activity status monitoring
- At-risk member alerts
- Direct communication tools

### ⚡ Next Best Actions
- AI-generated recommendations
- Priority-based task management
- Impact predictions
- Action tracking

### 💬 Stela AI Chat
- Natural language interface
- Context-aware responses
- Business growth advice
- SPP explanations

### 📦 Subscription Management
- Recurring revenue tracking
- Churn prevention
- Growth opportunities
- Product breakdown

### 📚 SPP Guide
- Rank requirements
- Commission structure
- Bonus programs
- FAQ section

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- AWS Account (for Bedrock Claude integration)

### Installation

1. Clone the repository:
```bash
cd /Users/samayamantri/Documents/StelaAi/Cursor
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:3000

# AWS Bedrock Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# Claude Model
CLAUDE_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0

# Default Account
NEXT_PUBLIC_DEFAULT_ACCOUNT_ID=247
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3001](http://localhost:3001) in your browser.

## 🔧 Configuration

### API Endpoints

The app connects to two backend services:

1. **Main API** (`localhost:8000`)
   - Account data
   - Performance metrics
   - Qualifications
   - Downlines
   - Subscriptions
   - NBA recommendations

2. **MCP Server** (`localhost:3000`)
   - Chatbot tools
   - AI agent capabilities

### AWS Bedrock Setup

For full AI capabilities, configure AWS Bedrock:

1. Enable Claude model access in AWS Console
2. Create IAM user with Bedrock permissions
3. Add credentials to `.env.local`

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── chat/              # AI chat page
│   ├── downlines/         # Team management
│   ├── help/              # Help & support
│   ├── nba/               # Next best actions
│   ├── performance/       # Performance analytics
│   ├── qualifications/    # Qualification tracker
│   ├── settings/          # User settings
│   ├── spp/               # SPP guide
│   └── subscriptions/     # Subscription management
├── components/            # React components
│   ├── charts/           # Chart components
│   ├── chat/             # Chat interface
│   ├── dashboard/        # Dashboard cards
│   ├── layout/           # Layout components
│   └── ui/               # UI primitives
├── context/              # React contexts
└── lib/                  # Utilities & API
```

## 🎨 Theme

The app uses a NuSkin-inspired color palette:

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#003B5C` | Deep blue - headers, buttons |
| Secondary | `#0077A8` | Teal blue - accents |
| Accent | `#00A9E0` | Bright cyan - highlights |
| Gold | `#C4A962` | Gold - achievements |
| Light | `#E8F4F8` | Light blue - backgrounds |

## 📱 PWA Features

- **Installable**: Add to home screen on mobile
- **Offline Support**: Works without internet
- **Push Notifications**: Real-time alerts
- **Responsive**: Optimized for all devices

## 🛠 Tech Stack

- **Framework**: Next.js 14
- **UI**: React 18, Tailwind CSS
- **Charts**: Chart.js, react-chartjs-2
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI**: AWS Bedrock (Claude 3.5)
- **PWA**: next-pwa

## 📄 Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm run start

# Lint
npm run lint
```

## 🤝 API Integration

The app expects the following API endpoints:

### Account APIs
- `GET /api/accounts/:id` - Account details
- `GET /api/accounts/:id/performance` - Performance data
- `GET /api/accounts/:id/qualifications` - Qualification status
- `GET /api/accounts/:id/downlines` - Team members
- `GET /api/accounts/:id/subscriptions` - Subscription data
- `GET /api/accounts/:id/nba` - Next best actions

### SPP APIs
- `GET /api/spp/rules` - Business rules
- `GET /api/spp/qualifications/:rank` - Rank requirements

### MCP Server
- `POST /chat` - AI chat endpoint
- `GET /tools` - Available tools

## 📝 License

Proprietary - NuSkin Affiliate Use Only

## 🙋 Support

For support, contact the Stela AI team or use the in-app Help section.

---

Built with ❤️ for NuSkin Affiliates

