# Web Platform Setup Guide
## Quick Start for Development

**Project**: Stablecoin Aggregator Management Platform
**Stack**: Next.js 14 + TypeScript + Tailwind CSS
**Created**: December 21, 2024

---

## Prerequisites

```bash
# Required versions
node >= 20.0.0
npm >= 10.0.0
git >= 2.40.0

# Optional but recommended
docker >= 24.0.0 (for local database)
```

---

## Quick Start

### 1. Create Next.js Project

```bash
# Navigate to stablecoin-aggregators repo
cd K:/git/stablecoin-aggregators

# Create Next.js app in web-platform directory
npx create-next-app@latest web-platform --typescript --tailwind --app --src-dir --import-alias "@/*"

# Navigate into project
cd web-platform
```

### 2. Install Core Dependencies

```bash
# UI Components (shadcn/ui)
npx shadcn-ui@latest init

# Web3 Libraries
npm install wagmi viem @tanstack/react-query

# Database
npm install @prisma/client
npm install -D prisma

# State Management
npm install zustand

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# Icons & UI
npm install lucide-react @radix-ui/react-icons

# Charts
npm install recharts

# Authentication
npm install next-auth

# API Integration
npm install axios swr

# GitHub Integration
npm install @octokit/rest

# Date handling
npm install date-fns

# Animations
npm install framer-motion
```

### 3. Install shadcn/ui Components

```bash
# Essential UI components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add table
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add command
```

### 4. Set Up Database

```bash
# Initialize Prisma
npx prisma init

# This creates:
# - prisma/schema.prisma
# - .env file
```

### 5. Configure Environment Variables

Create `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/stablecoin_platform"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# GitHub Integration
GITHUB_TOKEN="your_github_personal_access_token"
GITHUB_REPO="Fused-Gaming/stablecoin-aggregators"

# Blockchain RPC
BASE_SEPOLIA_RPC_URL="https://base-sepolia.g.alchemy.com/v2/YOUR_KEY"
ETH_SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY"
BASE_RPC_URL="https://base-mainnet.g.alchemy.com/v2/YOUR_KEY"
ETH_RPC_URL="https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY"

# Gnosis Safe API
GNOSIS_SAFE_API_URL="https://safe-transaction-base.safe.global"

# Optional: AI Features
OPENAI_API_KEY="your_openai_key"
```

### 6. Set Up Prisma Schema

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Task {
  id           String    @id @default(uuid())
  title        String
  description  String?
  milestoneId  String?
  trackId      String?
  assigneeId   String?
  status       String    @default("todo")
  priority     String    @default("medium")
  githubIssueId Int?
  githubPrId   Int?
  dependencies Json?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  dueDate      DateTime?

  @@map("tasks")
}

model Deployment {
  id              String    @id @default(uuid())
  contractName    String
  network         String
  address         String?
  deployerAddress String?
  transactionHash String?
  blockNumber     BigInt?
  gasUsed         BigInt?
  verified        Boolean   @default(false)
  create2Salt     String?
  status          String    @default("pending")
  createdAt       DateTime  @default(now())
  deploymentDate  DateTime?

  @@map("deployments")
}

model Signer {
  id                    String    @id @default(uuid())
  name                  String
  email                 String    @unique
  walletAddress         String    @unique
  level                 Int
  multisigAddress       String?
  hardwareWalletType    String?
  hardwareWalletVerified Boolean  @default(false)
  lastActive            DateTime?
  status                String    @default("pending")
  createdAt             DateTime  @default(now())

  @@map("signers")
}

model MultisigTransaction {
  id              String    @id @default(uuid())
  multisigAddress String
  nonce           Int
  toAddress       String
  value           String
  data            String?
  operation       Int
  safeTxGas       BigInt?
  signatures      Json?
  executed        Boolean   @default(false)
  executionDate   DateTime?
  createdAt       DateTime  @default(now())

  @@map("multisig_transactions")
}

model SwapEvent {
  id              String    @id @default(uuid())
  transactionHash String
  userAddress     String
  tokenAddress    String
  amount          String
  fee             String
  bridgeAddress   String
  network         String
  blockNumber     BigInt
  timestamp       DateTime
  status          String    @default("pending")

  @@map("swap_events")
}

model User {
  id            String    @id @default(uuid())
  name          String?
  email         String?   @unique
  walletAddress String    @unique
  role          String    @default("viewer")
  createdAt     DateTime  @default(now())
  lastLogin     DateTime?

  @@map("users")
}
```

### 7. Run Database Migration

```bash
# Generate Prisma Client
npx prisma generate

# Create and run migration
npx prisma migrate dev --name init

# Open Prisma Studio to view database
npx prisma studio
```

### 8. Project Structure

```bash
web-platform/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── tasks/
│   │   │   │   └── page.tsx
│   │   │   ├── deployments/
│   │   │   │   └── page.tsx
│   │   │   ├── keys/
│   │   │   │   └── page.tsx
│   │   │   ├── milestones/
│   │   │   │   └── page.tsx
│   │   │   ├── bridges/
│   │   │   │   └── page.tsx
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── tasks/
│   │   │   │   └── route.ts
│   │   │   ├── deployments/
│   │   │   │   └── route.ts
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── tasks/
│   │   │   ├── task-card.tsx
│   │   │   ├── task-list.tsx
│   │   │   └── task-board.tsx
│   │   ├── deployments/
│   │   │   ├── deployment-card.tsx
│   │   │   └── network-selector.tsx
│   │   ├── keys/
│   │   │   ├── signer-card.tsx
│   │   │   └── multisig-tx.tsx
│   │   └── shared/
│   │       ├── navbar.tsx
│   │       ├── sidebar.tsx
│   │       └── footer.tsx
│   ├── lib/
│   │   ├── db.ts            # Prisma client
│   │   ├── web3.ts          # wagmi config
│   │   ├── github.ts        # GitHub API
│   │   └── utils.ts         # Utilities
│   ├── hooks/
│   │   ├── use-tasks.ts
│   │   ├── use-deployments.ts
│   │   └── use-signers.ts
│   └── types/
│       ├── task.ts
│       ├── deployment.ts
│       └── signer.ts
├── prisma/
│   └── schema.prisma
├── public/
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 9. Create Basic Files

#### `src/lib/db.ts`
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

#### `src/lib/web3.ts`
```typescript
import { createConfig, http } from 'wagmi'
import { baseSepolia, sepolia, base, mainnet } from 'wagmi/chains'

export const config = createConfig({
  chains: [baseSepolia, sepolia, base, mainnet],
  transports: {
    [baseSepolia.id]: http(process.env.BASE_SEPOLIA_RPC_URL),
    [sepolia.id]: http(process.env.ETH_SEPOLIA_RPC_URL),
    [base.id]: http(process.env.BASE_RPC_URL),
    [mainnet.id]: http(process.env.ETH_RPC_URL),
  },
})
```

#### `src/lib/github.ts`
```typescript
import { Octokit } from '@octokit/rest'

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

export async function getIssues() {
  const { data } = await octokit.issues.listForRepo({
    owner: 'Fused-Gaming',
    repo: 'stablecoin-aggregators',
  })
  return data
}
```

### 10. Configure Tailwind

Edit `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

### 11. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Development Workflow

### 1. Create New Component

```bash
# Create component file
touch src/components/tasks/task-card.tsx
```

### 2. Create API Route

```bash
# Create API route
mkdir -p src/app/api/tasks
touch src/app/api/tasks/route.ts
```

### 3. Add Database Table

```bash
# Edit prisma/schema.prisma
# Then run:
npx prisma migrate dev --name add_new_table
npx prisma generate
```

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Create migration
npx prisma generate      # Generate Prisma Client
npx prisma db push       # Push schema changes

# Testing (after setup)
npm run test             # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

---

## Next Steps

1. ✅ Set up project structure
2. ⏳ Create dashboard layout
3. ⏳ Build task management module
4. ⏳ Integrate GitHub API
5. ⏳ Add Web3 functionality
6. ⏳ Create deployment dashboard
7. ⏳ Build key management UI

---

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
docker ps

# Restart database
docker restart postgres-container
```

### Prisma Issues
```bash
# Reset database
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

### Build Errors
```bash
# Clear cache
rm -rf .next
npm run build
```

---

**Last Updated**: December 21, 2024
**Next Review**: After initial setup

See [PLATFORM_ARCHITECTURE.md](PLATFORM_ARCHITECTURE.md) for full architecture details.
