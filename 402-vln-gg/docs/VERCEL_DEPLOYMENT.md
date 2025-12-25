# Vercel Deployment Guide - 402.vln.gg Ecosystem

**Project**: Stablecoin Aggregators Web Platform
**Organization**: Fused-Gaming
**Last Updated**: 2025-12-24

---

## Subdomain Architecture

### Overview
The 402.vln.gg ecosystem consists of 4 distinct Next.js applications, each deployed to a separate Vercel project with its own subdomain.

```
402.vln.gg (root domain)
├── admin.402.vln.gg    → Admin Dashboard (CURRENT)
├── manage.402.vln.gg   → Internal Management Platform (FUTURE)
├── swap.402.vln.gg     → Stablecoin Aggregator UI (FUTURE)
└── 402.vln.gg          → x402 Payment Gateway (FUTURE)
```

---

## 1. admin.402.vln.gg (Admin Dashboard) ✅

### Purpose
Secure admin dashboard for managing deployed smart contracts (Router402, FeeCollector402, Treasury402).

### Current Status
- ✅ Security architecture documented ([ADMIN_SECURITY.md](ADMIN_SECURITY.md))
- ✅ Bot protection files deployed (robots.txt, sitemap.xml)
- ⏳ Authentication implementation pending
- ⏳ Admin routes pending

### Vercel Project Configuration

**Project Name**: `admin-402-vln-gg`

**Root Directory**: `402-vln-gg`

**Build Settings**:
```bash
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Node Version: 18.x
```

**Environment Variables** (Production):
```bash
# Admin Authentication
ADMIN_USERNAME=<secure_username>
ADMIN_PASSWORD_HASH=<bcrypt_hash_cost_12>
ADMIN_MFA_SECRET=<base32_totp_secret>

# JWT Secrets (256-bit)
ADMIN_JWT_SECRET=<64_char_hex_string>
ADMIN_REFRESH_SECRET=<different_64_char_hex>

# Session Security
ADMIN_SESSION_SECRET=<32_char_hex>
ADMIN_ALLOWED_IPS=<comma_separated_ips>

# Rate Limiting
ADMIN_LOGIN_ATTEMPTS=5
ADMIN_LOGIN_WINDOW=900000
ADMIN_LOCKOUT_DURATION=3600000

# Production Mode
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://admin.402.vln.gg
```

**Custom Domain**:
- Primary: `admin.402.vln.gg`

**Security Headers** (via `next.config.ts`):
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security: max-age=31536000
- Content-Security-Policy: (restrictive, see ADMIN_SECURITY.md)

### Deployment Commands

```bash
# From project root
cd 402-vln-gg

# Link to Vercel project (first time only)
vercel link --scope team-4eckd

# Deploy to production
vercel --prod

# Set custom domain (in Vercel dashboard)
# Domains → admin.402.vln.gg → Add
```

### Access Control
- **Public Routes**: None (all routes require authentication)
- **Admin Routes**: `/admin/*` (password + MFA required)
- **API Routes**: `/api/admin/*` (JWT authentication required)

---

## 2. 402.vln.gg (x402 Payment Gateway) 🔮

### Purpose
Public HTTP 402 Payment Required gateway implementing the x402 protocol for micropayments.

### Planned Implementation
- **Milestone**: M5-M7 (Weeks 13-24)
- **Priority**: CRITICAL (master specification)

### Vercel Project Configuration

**Project Name**: `402-vln-gg-gateway`

**Root Directory**: `402-vln-gg` (separate codebase from admin)

**Build Settings**:
```bash
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Node Version: 18.x
```

**Environment Variables** (Production):
```bash
# Blockchain
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org
PAYMENT_ROUTER_ADDRESS=0x...
RECEIPT_REGISTRY_ADDRESS=0x...

# Database (PostgreSQL)
DATABASE_URL=postgresql://...
DATABASE_POOL_MAX=20

# Redis (Receipt caching)
REDIS_URL=redis://...

# API Configuration
API_RATE_LIMIT_PER_IP=100
API_RATE_LIMIT_PER_MERCHANT=1000
API_TIMEOUT_MS=5000

# Platform Fee
PLATFORM_FEE_BPS=25  # 0.25%

# Production
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://402.vln.gg
```

**Custom Domain**:
- Primary: `402.vln.gg`
- Aliases: `api.402.vln.gg`, `gateway.402.vln.gg`

### Public Endpoints
- `GET /` - Protocol discovery
- `GET /health` - Health check
- `GET /price/:resource_id` - Pricing metadata
- `POST /quote` - Dynamic pricing
- `POST /authorize` - Payment verification
- `GET /receipt/:request_id` - Receipt lookup
- `POST /merchant/register` - Merchant onboarding
- `GET /merchant/:id/stats` - Merchant analytics

---

## 3. manage.402.vln.gg (Internal Management) 🔮

### Purpose
Internal team workflow coordination, deployment tracking, and key management platform.

### Planned Implementation
- **Milestone**: M3-M4 (Weeks 7-12)
- **Priority**: MEDIUM (internal tooling)

### Vercel Project Configuration

**Project Name**: `manage-402-vln-gg`

**Root Directory**: `web-platform` (to be created)

**Build Settings**:
```bash
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Node Version: 18.x
```

**Environment Variables** (Production):
```bash
# Team Authentication (GitHub OAuth recommended)
GITHUB_CLIENT_ID=<github_oauth_app_id>
GITHUB_CLIENT_SECRET=<github_oauth_secret>
GITHUB_ORG=Fused-Gaming

# Database (Team tasks, milestones)
DATABASE_URL=postgresql://...

# GitHub Integration
GITHUB_TOKEN=<personal_access_token>
GITHUB_REPO=stablecoin-aggregators

# Production
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://manage.402.vln.gg
```

**Custom Domain**:
- Primary: `manage.402.vln.gg`

### Features
- Kanban board for milestone tracking
- Deployment status dashboard
- Key ceremony coordination
- Document repository
- Team calendar

---

## 4. swap.402.vln.gg (Stablecoin Aggregator UI) 🔮

### Purpose
User-facing interface for cross-chain stablecoin swaps using Router402 contracts.

### Planned Implementation
- **Milestone**: M8-M9 (Weeks 25-30)
- **Priority**: MEDIUM (after payment gateway)

### Vercel Project Configuration

**Project Name**: `swap-402-vln-gg`

**Root Directory**: `swap-ui` (to be created)

**Build Settings**:
```bash
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Node Version: 18.x
```

**Environment Variables** (Production):
```bash
# Smart Contracts
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_ROUTER_ADDRESS=0x...
NEXT_PUBLIC_FEE_COLLECTOR_ADDRESS=0x...

# RPC
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_ETH_RPC_URL=https://eth.llamarpc.com

# Web3 Wallet Connection
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<project_id>

# Supported Tokens
NEXT_PUBLIC_USDC_BASE=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
NEXT_PUBLIC_USDT_BASE=0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2

# Bridge Integrations
NEXT_PUBLIC_SOCKET_ROUTER=0x3a23F943181408EAC424116Af7b7790c94Cb97a5

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=<google_analytics_id>

# Production
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://swap.402.vln.gg
```

**Custom Domain**:
- Primary: `swap.402.vln.gg`

### Features
- Stablecoin swap interface
- Cross-chain routing visualization
- Fee calculator
- Transaction history
- Wallet connection (Coinbase Wallet, MetaMask, WalletConnect)

---

## Deployment Workflow

### Initial Setup (One-Time)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Link Project**:
```bash
cd 402-vln-gg
vercel link --scope team-4eckd
# Select team: team-4eckd
# Select project: admin-402-vln-gg (or create new)
```

### Continuous Deployment

**Option 1: Vercel GitHub Integration (Recommended)**
- Connect Vercel to GitHub repository
- Auto-deploy on push to `admin-dashboard` branch
- Preview deployments for PRs
- Production deploys on merge to `master`

**Option 2: Manual CLI Deployment**
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

### Environment Variables Management

**Set via Vercel CLI**:
```bash
vercel env add ADMIN_JWT_SECRET production
# Enter secret value when prompted
```

**Set via Vercel Dashboard**:
1. Go to Project Settings
2. Navigate to Environment Variables
3. Add variables for Production, Preview, Development
4. Save changes

---

## Domain Configuration

### DNS Setup (via Domain Registrar)

For custom domain `admin.402.vln.gg`:

**DNS Records**:
```
Type: CNAME
Name: admin
Value: cname.vercel-dns.com
TTL: 3600
```

### Vercel Domain Setup

1. Navigate to Project Settings → Domains
2. Add Custom Domain: `admin.402.vln.gg`
3. Verify DNS configuration
4. Enable HTTPS (automatic via Let's Encrypt)
5. Set as Production Domain

---

## Security Checklist

### Pre-Deployment
- [ ] All environment variables set in Vercel
- [ ] Security headers configured in `next.config.ts`
- [ ] Rate limiting middleware enabled
- [ ] IP whitelist configured (for admin dashboard)
- [ ] MFA secrets generated and stored securely
- [ ] JWT secrets are 256-bit random values
- [ ] `robots.txt` configured to block admin routes
- [ ] `sitemap.xml` excludes sensitive routes

### Post-Deployment
- [ ] HTTPS enabled and enforced
- [ ] Custom domain properly configured
- [ ] Environment variables not exposed to client
- [ ] CSP headers blocking XSS
- [ ] CORS configured appropriately
- [ ] Rate limiting tested
- [ ] Login flow tested with MFA
- [ ] Audit logging functional

---

## Monitoring & Alerts

### Vercel Analytics
- Enable Vercel Analytics for all projects
- Monitor response times
- Track error rates
- Review Core Web Vitals

### Custom Monitoring
- Set up Sentry for error tracking
- Configure uptime monitoring (UptimeRobot, Pingdom)
- Set up log aggregation (Logtail, Datadog)
- Alert on failed deployments

---

## Deployment Checklist

### admin.402.vln.gg (CURRENT)
- [x] Security architecture documented
- [x] `robots.txt` and `sitemap.xml` created
- [ ] `.env.example` created with all required variables
- [ ] Authentication middleware implemented
- [ ] Admin routes created (`/admin/*`)
- [ ] MFA integration completed
- [ ] Vercel project created
- [ ] Environment variables set in Vercel
- [ ] Custom domain `admin.402.vln.gg` configured
- [ ] Production deployment successful
- [ ] Security testing completed

### 402.vln.gg (FUTURE - M5-M7)
- [ ] x402 protocol endpoints implemented
- [ ] PaymentRouter and ReceiptRegistry contracts deployed
- [ ] Database schema created
- [ ] Merchant registration flow built
- [ ] SDK published (JavaScript + Python)
- [ ] Vercel project created
- [ ] Custom domain configured
- [ ] Production deployment
- [ ] External merchant integration testing

### manage.402.vln.gg (FUTURE - M3-M4)
- [ ] Kanban board implemented
- [ ] GitHub integration configured
- [ ] Team authentication (GitHub OAuth)
- [ ] Deployment dashboard built
- [ ] Vercel project created
- [ ] Custom domain configured
- [ ] Production deployment

### swap.402.vln.gg (FUTURE - M8-M9)
- [ ] Swap UI components built
- [ ] Web3 wallet integration
- [ ] Router402 contract integration
- [ ] Transaction history
- [ ] Vercel project created
- [ ] Custom domain configured
- [ ] Production deployment

---

## Troubleshooting

### Common Issues

**Issue**: Domain not resolving
- **Solution**: Check DNS propagation (can take up to 48 hours)
- **Verify**: `dig admin.402.vln.gg` or use https://dnschecker.org

**Issue**: Environment variables not loading
- **Solution**: Ensure variables are set for correct environment (Production/Preview/Development)
- **Redeploy**: Trigger new deployment after adding variables

**Issue**: Build failing on Vercel
- **Solution**: Check build logs in Vercel dashboard
- **Common causes**: Missing dependencies, TypeScript errors, environment variable references

**Issue**: 502 Bad Gateway
- **Solution**: Check function timeout limits (10s for Hobby, 60s for Pro)
- **Optimize**: Reduce API response time or upgrade plan

---

## Cost Estimates

### Vercel Pricing (Team Plan - $20/month per member)

**admin.402.vln.gg**:
- Traffic: Low (internal use only)
- Build minutes: ~100/month
- Estimated cost: Included in Team plan

**402.vln.gg**:
- Traffic: Medium-High (public API)
- Build minutes: ~200/month
- Estimated cost: $20-50/month (Pro plan recommended)

**manage.402.vln.gg**:
- Traffic: Low (team use only)
- Build minutes: ~100/month
- Estimated cost: Included in Team plan

**swap.402.vln.gg**:
- Traffic: Medium (user-facing)
- Build minutes: ~150/month
- Estimated cost: Included in Team plan

**Total estimated monthly cost**: $40-70 (Team plan + Pro for payment gateway)

---

## Next Steps

1. ✅ Complete admin dashboard implementation
2. Configure `admin.402.vln.gg` custom domain in Vercel
3. Set all environment variables for production
4. Deploy admin dashboard to production
5. Test admin authentication flow
6. Begin work on manage.402.vln.gg (M3-M4)
7. Plan 402.vln.gg payment gateway architecture (M5-M7)

---

**References**:
- [ADMIN_SECURITY.md](ADMIN_SECURITY.md) - Admin dashboard security architecture
- [PLATFORM_ARCHITECTURE.md](../docs/web-platform/PLATFORM_ARCHITECTURE.md) - Overall platform design
- [x402.md](../docs/specifications/x402.md) - x402 payment protocol specification
- [Vercel Documentation](https://vercel.com/docs)
