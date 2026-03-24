<p align="center">
  <img src="https://firebasestorage.googleapis.com/v0/b/atstrc-2ab58.firebasestorage.app/o/ChatGPT%20Image%2024%20mar%202026%2C%2003_37_14%20p.m..png?alt=media" alt="ROBUT Logo" width="300" height="600" />
</p>

<h1 align="center">ROBUT</h1>

<p align="center">
  <strong>The Future of AI-Powered Voice Interviews for Hiring</strong>
</p>

<p align="center">
  <a href="https://github.com/edinsoncs/robut/stargazers">
    <img src="https://img.shields.io/github/stars/edinsoncs/robut?style=for-the-badge&logo=github&color=yellow" alt="GitHub Stars" />
  </a>
  <a href="https://github.com/edinsoncs/robut/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/edinsoncs/robut?style=for-the-badge&color=blue" alt="License" />
  </a>
  <a href="https://x.com/edinsoncode">
    <img src="https://img.shields.io/twitter/follow/edinsoncode?style=for-the-badge&logo=x&color=black" alt="Twitter Follow" />
  </a>
</p>

---

<p align="center">
  <img src="https://img.shields.io/badge/Launch%20Token-pump.fun-blueviolet?style=for-the-badge&logo=solana" alt="Pump.fun" />
</p>

## ROBUT Token

> **Coming Soon on Pump.fun**

ROBUT is not just a platform - it's a movement. We're launching the **ROBUT Token** on [pump.fun](https://pump.fun) to empower our community and bring decentralized governance to AI-powered hiring.

| Token Details | Information |
|---------------|-------------|
| **Token Name** | ROBUT |
| **Blockchain** | Solana |
| **Launch Platform** | [pump.fun](https://pump.fun) |
| **Contract Address** | `TBA - Coming Soon` |

### Why ROBUT Token?

- **Community Governance** - Token holders will vote on platform features and roadmap
- **Premium Access** - Unlock exclusive AI interview features with ROBUT tokens
- **Staking Rewards** - Earn rewards by staking your ROBUT tokens
- **Ecosystem Growth** - Be part of the future of decentralized hiring

> **Note:** Contract address will be announced on our official Twitter [@edinsoncode](https://x.com/edinsoncode). Stay tuned!

---

## What is ROBUT?

**ROBUT** is a cutting-edge, open-source platform that revolutionizes the hiring process by enabling companies to conduct AI-powered voice interviews with candidates. Our advanced artificial intelligence creates natural, conversational interviews that adapt in real-time to each candidate's responses.

Built for modern recruitment teams who want to scale their hiring process without sacrificing quality, ROBUT combines the efficiency of automation with the nuance of human-like conversation.

### The Problem We Solve

Traditional hiring processes are:
- **Time-consuming** - Manual screening takes hours per candidate
- **Inconsistent** - Different interviewers ask different questions
- **Expensive** - Recruiter time is valuable and limited
- **Biased** - Human unconscious bias affects decisions

### The ROBUT Solution

- **Automated Screening** - AI conducts initial interviews 24/7
- **Standardized Process** - Every candidate gets the same fair evaluation
- **Cost-Effective** - Scale interviews without scaling headcount
- **Objective Analysis** - AI provides unbiased, data-driven insights

---

## Key Features

### 1. Intelligent Interview Generation
Create customized interview questions instantly from any job description. Our AI analyzes the role requirements and generates relevant, insightful questions that assess both technical skills and cultural fit.

### 2. One-Click Sharing
Generate unique interview links and share them with candidates in seconds. No scheduling required - candidates can complete interviews at their convenience.

### 3. Natural Voice Conversations
Our AI conducts interviews that feel like talking to a real person. Using advanced speech synthesis and natural language processing, ROBUT creates engaging, adaptive conversations.

### 4. Deep Analytics & Scoring
Get detailed insights and scores for each interview response. Our AI evaluates:
- Technical competency
- Communication skills
- Problem-solving ability
- Cultural alignment
- Overall suitability

### 5. Comprehensive Dashboard
Track all candidates and campaign performance in one place:
- Real-time interview status
- Candidate comparison tools
- Performance metrics
- Export capabilities

### 6. Multi-Language Support
Conduct interviews in multiple languages to reach global talent pools.

### 7. Custom Branding
White-label the interview experience with your company's branding for a seamless candidate experience.

---

## Technology Stack

ROBUT is built with modern, production-ready technologies:

| Technology | Purpose | Why We Chose It |
|------------|---------|-----------------|
| **Next.js 15** | React Framework | Server components, API routes, optimal performance |
| **TypeScript** | Type Safety | Catch errors early, better developer experience |
| **Tailwind CSS** | Styling | Rapid UI development, consistent design system |
| **Supabase** | Database & Auth | PostgreSQL power with real-time capabilities |
| **Clerk** | Authentication | Enterprise-grade auth with organization support |
| **Retell AI** | Voice Calls | State-of-the-art conversational AI for voice |
| **OpenAI** | AI Analysis | GPT-4 powered question generation and analysis |
| **Vercel** | Deployment | Seamless CI/CD, edge functions, global CDN |

---

## Architecture Overview

```
robut/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Authentication Routes
│   │   ├── sign-in/                  # Sign in page
│   │   │   └── [[...sign-in]]/       # Clerk sign-in component
│   │   └── sign-up/                  # Sign up page
│   │       └── [[...sign-up]]/       # Clerk sign-up component
│   │
│   ├── (dashboard)/                  # Protected Dashboard Routes
│   │   ├── layout.tsx                # Dashboard layout with sidebar
│   │   ├── page.tsx                  # Dashboard home/overview
│   │   ├── campaigns/                # Interview Campaigns
│   │   │   ├── page.tsx              # List all campaigns
│   │   │   ├── new/                  # Create new campaign
│   │   │   └── [id]/                 # Campaign details
│   │   │       ├── page.tsx          # View campaign
│   │   │       └── edit/             # Edit campaign
│   │   ├── candidates/               # Candidate Management
│   │   │   ├── page.tsx              # List all candidates
│   │   │   └── [id]/                 # Candidate details
│   │   ├── interviews/               # Completed Interviews
│   │   │   ├── page.tsx              # List all interviews
│   │   │   └── [id]/                 # Interview details & analysis
│   │   └── settings/                 # User Settings
│   │       └── page.tsx              # Account & preferences
│   │
│   ├── api/                          # API Routes
│   │   ├── campaigns/                # Campaign CRUD endpoints
│   │   │   ├── route.ts              # GET, POST campaigns
│   │   │   └── [id]/                 # Campaign by ID
│   │   │       └── route.ts          # GET, PUT, DELETE
│   │   ├── candidates/               # Candidate endpoints
│   │   │   ├── route.ts              # GET, POST candidates
│   │   │   └── [id]/                 # Candidate by ID
│   │   ├── interviews/               # Interview endpoints
│   │   │   ├── route.ts              # GET, POST interviews
│   │   │   └── [id]/                 # Interview by ID
│   │   │       └── analysis/         # AI analysis endpoint
│   │   ├── retell/                   # Retell AI Integration
│   │   │   ├── webhook/              # Call event webhooks
│   │   │   └── create-call/          # Initiate voice calls
│   │   ├── openai/                   # OpenAI Integration
│   │   │   ├── generate-questions/   # Generate interview questions
│   │   │   └── analyze-response/     # Analyze candidate responses
│   │   └── webhooks/                 # External webhooks
│   │       └── clerk/                # Clerk user sync
│   │
│   ├── interview/                    # Public Interview Pages
│   │   └── [id]/                     # Unique interview link
│   │       ├── page.tsx              # Interview room
│   │       └── complete/             # Interview completion
│   │
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Landing page
│   └── globals.css                   # Global styles
│
├── components/                       # Reusable Components
│   ├── ui/                           # Base UI Components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── campaigns/                    # Campaign Components
│   │   ├── campaign-form.tsx         # Create/edit campaign form
│   │   ├── campaign-card.tsx         # Campaign display card
│   │   ├── campaign-list.tsx         # Campaign list view
│   │   └── question-editor.tsx       # Interview questions editor
│   ├── candidates/                   # Candidate Components
│   │   ├── candidate-card.tsx        # Candidate display card
│   │   ├── candidate-list.tsx        # Candidate list view
│   │   └── candidate-details.tsx     # Detailed candidate view
│   ├── interviews/                   # Interview Components
│   │   ├── interview-room.tsx        # Voice interview UI
│   │   ├── analysis-card.tsx         # AI analysis display
│   │   ├── transcript-viewer.tsx     # Interview transcript
│   │   └── score-breakdown.tsx       # Scoring visualization
│   ├── dashboard/                    # Dashboard Components
│   │   ├── sidebar.tsx               # Navigation sidebar
│   │   ├── header.tsx                # Dashboard header
│   │   ├── stats-cards.tsx           # Statistics overview
│   │   └── recent-activity.tsx       # Activity feed
│   └── shared/                       # Shared Components
│       ├── loading.tsx               # Loading states
│       ├── error-boundary.tsx        # Error handling
│       └── empty-state.tsx           # Empty state displays
│
├── lib/                              # Utilities & Configurations
│   ├── supabase/                     # Supabase Client
│   │   ├── client.ts                 # Browser client
│   │   ├── server.ts                 # Server client
│   │   └── types.ts                  # Database types
│   ├── retell/                       # Retell AI Configuration
│   │   ├── client.ts                 # API client
│   │   └── types.ts                  # Retell types
│   ├── openai/                       # OpenAI Configuration
│   │   ├── client.ts                 # API client
│   │   └── prompts.ts                # AI prompts
│   ├── clerk/                        # Clerk Helpers
│   │   └── utils.ts                  # Auth utilities
│   ├── validations/                  # Zod Schemas
│   │   ├── campaign.ts               # Campaign validation
│   │   └── candidate.ts              # Candidate validation
│   └── utils.ts                      # General utilities
│
├── hooks/                            # Custom React Hooks
│   ├── use-campaigns.ts              # Campaign data hook
│   ├── use-candidates.ts             # Candidate data hook
│   ├── use-interviews.ts             # Interview data hook
│   └── use-voice-call.ts             # Voice call management
│
├── types/                            # TypeScript Definitions
│   ├── campaign.ts                   # Campaign types
│   ├── candidate.ts                  # Candidate types
│   ├── interview.ts                  # Interview types
│   └── api.ts                        # API response types
│
├── public/                           # Static Assets
│   ├── robut-logo.png                # Logo
│   └── images/                       # Images
│
├── scripts/                          # Database Scripts
│   └── supabase_schema.sql           # Database schema
│
├── .env.example                      # Environment variables template
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies
```

---

## How ROBUT Works

### Interview Creation Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        RECRUITER WORKFLOW                            │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │   1. Create Campaign      │
                    │   Enter job title &       │
                    │   description             │
                    └──────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │   2. AI Generates         │
                    │   Interview Questions     │
                    │   (OpenAI GPT-4)          │
                    └──────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │   3. Review & Customize   │
                    │   Edit questions as       │
                    │   needed                  │
                    └──────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │   4. Save Campaign        │
                    │   Stored in Supabase      │
                    └──────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │   5. Generate Unique      │
                    │   Interview Link          │
                    └──────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │   6. Share with           │
                    │   Candidates              │
                    └──────────────────────────┘
```

### Candidate Interview Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CANDIDATE WORKFLOW                            │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │   1. Open Interview       │
                    │   Link                    │
                    └──────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │   2. Enter Basic Info     │
                    │   Name, Email, Phone      │
                    └──────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │   3. Microphone Check     │
                    │   Verify audio setup      │
                    └──────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │   4. Start Voice          │
                    │   Interview               │
                    │   (Retell AI)             │
                    └──────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │   5. AI Asks Questions    │
                    │   Natural conversation    │
                    │   with follow-ups         │
                    └──────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │   6. Interview Complete   │
                    │   Recording saved         │
                    └──────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │   7. AI Analyzes          │
                    │   Responses               │
                    │   (OpenAI)                │
                    └──────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │   8. Results Appear       │
                    │   in Dashboard            │
                    └──────────────────────────┘
```

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA ARCHITECTURE                            │
└─────────────────────────────────────────────────────────────────────┘

    ┌─────────┐         ┌─────────┐         ┌─────────┐
    │  User   │────────▶│  Clerk  │────────▶│ Session │
    └─────────┘         └─────────┘         └─────────┘
                                                  │
                                                  ▼
    ┌─────────────────────────────────────────────────────────┐
    │                    Next.js App                           │
    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
    │  │   Pages     │  │    API      │  │  Components │      │
    │  │  (RSC)      │  │   Routes    │  │             │      │
    │  └─────────────┘  └─────────────┘  └─────────────┘      │
    └─────────────────────────────────────────────────────────┘
              │                 │                 │
              ▼                 ▼                 ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
    │  Supabase   │   │  Retell AI  │   │   OpenAI    │
    │  Database   │   │  Voice API  │   │   GPT-4     │
    └─────────────┘   └─────────────┘   └─────────────┘
```

---

## Database Schema

### Entity Relationship Diagram

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│    campaigns     │       │    candidates    │       │    interviews    │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │       │ id (PK)          │
│ organization_id  │◄──┐   │ campaign_id (FK) │───────│ candidate_id(FK) │
│ title            │   │   │ name             │       │ campaign_id (FK) │
│ description      │   │   │ email            │       │ recording_url    │
│ questions (JSON) │   │   │ phone            │       │ transcript       │
│ status           │   └───│ status           │       │ analysis (JSON)  │
│ created_at       │       │ created_at       │       │ score            │
│ updated_at       │       │ updated_at       │       │ duration         │
└──────────────────┘       └──────────────────┘       │ status           │
                                                       │ created_at       │
                                                       └──────────────────┘
```

### SQL Schema

```sql
-- Organizations (synced from Clerk)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_org_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview Campaigns
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    questions JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidates
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interviews
CREATE TABLE interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    retell_call_id TEXT,
    recording_url TEXT,
    transcript TEXT,
    analysis JSONB DEFAULT '{}'::jsonb,
    score DECIMAL(3,2),
    duration INTEGER, -- in seconds
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'failed')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_campaigns_org ON campaigns(organization_id);
CREATE INDEX idx_candidates_campaign ON candidates(campaign_id);
CREATE INDEX idx_interviews_candidate ON interviews(candidate_id);
CREATE INDEX idx_interviews_campaign ON interviews(campaign_id);
```

---

## API Reference

### Campaigns

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/campaigns` | List all campaigns | Yes |
| `POST` | `/api/campaigns` | Create new campaign | Yes |
| `GET` | `/api/campaigns/[id]` | Get campaign by ID | Yes |
| `PUT` | `/api/campaigns/[id]` | Update campaign | Yes |
| `DELETE` | `/api/campaigns/[id]` | Delete campaign | Yes |

### Candidates

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/candidates` | List all candidates | Yes |
| `POST` | `/api/candidates` | Create new candidate | No* |
| `GET` | `/api/candidates/[id]` | Get candidate by ID | Yes |
| `PUT` | `/api/candidates/[id]` | Update candidate | Yes |

*Public endpoint for interview link submissions

### Interviews

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/interviews` | List all interviews | Yes |
| `GET` | `/api/interviews/[id]` | Get interview details | Yes |
| `POST` | `/api/interviews/[id]/analysis` | Trigger AI analysis | Yes |

### Integrations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/retell/webhook` | Retell AI call events |
| `POST` | `/api/retell/create-call` | Initiate voice call |
| `POST` | `/api/openai/generate-questions` | Generate interview questions |
| `POST` | `/api/openai/analyze-response` | Analyze candidate response |
| `POST` | `/api/webhooks/clerk` | Clerk user sync |

---

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun
- Git
- Accounts on: Clerk, Supabase, Retell AI, OpenAI

### 1. Clone the Repository

```bash
git clone https://github.com/edinsoncs/robut.git
cd robut
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install

# Using bun
bun install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

### 4. Configure Services

#### Clerk Authentication

1. Create account at [clerk.com](https://clerk.com)
2. Create a new application
3. Enable "Organizations" in settings
4. Copy keys to `.env`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

#### Supabase Database

1. Create project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Run the schema from `scripts/supabase_schema.sql`
4. Copy keys to `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

#### Retell AI Voice

1. Create account at [retell.ai](https://retell.ai)
2. Generate API key
3. Create an AI agent for interviews
4. Copy to `.env`:

```env
RETELL_API_KEY=key_...
RETELL_AGENT_ID=agent_...
```

#### OpenAI

1. Create API key at [platform.openai.com](https://platform.openai.com)
2. Copy to `.env`:

```env
OPENAI_API_KEY=sk-...
```

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
npm start
```

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign in URL path | Yes |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign up URL path | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `RETELL_API_KEY` | Retell AI API key | Yes |
| `RETELL_AGENT_ID` | Retell AI agent ID | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `NEXT_PUBLIC_APP_URL` | Production app URL | Yes |

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/edinsoncs/robut)

### Other Platforms

ROBUT can be deployed to any platform that supports Next.js:
- Railway
- Render
- AWS Amplify
- Google Cloud Run
- Docker containers

---

## Contributing

We welcome contributions from the community! Here's how to get involved:

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Be respectful in discussions

### Areas We Need Help

- Additional language support
- Accessibility improvements
- Performance optimizations
- Documentation translations
- UI/UX enhancements

---

## Roadmap

- [x] Core interview functionality
- [x] AI question generation
- [x] Voice interview with Retell AI
- [x] AI-powered analysis
- [ ] ROBUT Token launch on pump.fun
- [ ] Mobile application
- [ ] Video interview support
- [ ] ATS integrations (Greenhouse, Lever, etc.)
- [ ] Advanced analytics dashboard
- [ ] Team collaboration features
- [ ] Custom AI personas

---

## Support

Need help? We're here for you:

- **GitHub Issues** - [Report bugs or request features](https://github.com/edinsoncs/robut/issues)
- **Twitter/X** - [@edinsoncode](https://x.com/edinsoncode)
- **Email** - Open an issue for email contact

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Next.js](https://nextjs.org) - The React framework
- [Vercel](https://vercel.com) - Deployment platform
- [Supabase](https://supabase.com) - Backend as a service
- [Clerk](https://clerk.com) - Authentication
- [Retell AI](https://retell.ai) - Voice AI
- [OpenAI](https://openai.com) - AI capabilities
- [shadcn/ui](https://ui.shadcn.com) - UI components

---

<p align="center">
  <strong>Built with dedication by <a href="https://github.com/edinsoncs">@edinsoncode</a></strong>
</p>

<p align="center">
  <a href="https://github.com/edinsoncs/robut">
    <img src="https://img.shields.io/badge/Star%20on-GitHub-yellow?style=for-the-badge&logo=github" alt="Star on GitHub" />
  </a>
</p>

<p align="center">
  If you find ROBUT useful, please consider giving it a star on GitHub!
</p>
