# Admin Dashboard Security Architecture

**Security Level**: CRITICAL
**Access**: Restricted to authorized administrators only
**Location**: Dedicated subdomain `admin.402.vln.gg`
**Last Updated**: 2025-12-24

---

## Overview

The admin dashboard is a **secure, dedicated subdomain** (`admin.402.vln.gg`) for managing stablecoin aggregator smart contracts. This document outlines the multi-layered security architecture.

**Subdomain Separation**: The admin dashboard is intentionally deployed on a separate subdomain from the public-facing applications to provide additional isolation and security.

---

## Security Architecture

### Layer 1: Environment-Based Authentication

**Credentials stored in `.env` (NEVER committed)**:

```bash
# Admin authentication
ADMIN_USERNAME=your_secure_username
ADMIN_PASSWORD_HASH=bcrypt_hash_here # bcrypt cost 12
ADMIN_MFA_SECRET=base32_totp_secret

# JWT secrets (256-bit random)
ADMIN_JWT_SECRET=64_char_hex_string
ADMIN_REFRESH_SECRET=different_64_char_hex

# Session security
ADMIN_SESSION_SECRET=32_char_hex
ADMIN_ALLOWED_IPS=1.2.3.4,5.6.7.8 # Comma-separated

# Rate limiting
ADMIN_LOGIN_ATTEMPTS=5
ADMIN_LOGIN_WINDOW=900000 # 15 minutes
ADMIN_LOCKOUT_DURATION=3600000 # 1 hour
```

### Layer 2: Multi-Factor Authentication (MFA)

- **Required**: TOTP-based MFA using Google Authenticator or similar
- **Backup codes**: 10 encrypted backup codes generated on setup
- **Recovery**: Secure recovery process with identity verification

### Layer 3: Session Management

- **JWT tokens**: 15-minute expiration
- **Refresh tokens**: 7-day expiration, auto-rotation
- **HttpOnly cookies**: Prevent XSS attacks
- **Secure flag**: HTTPS-only transmission
- **SameSite**: Strict CSRF protection

### Layer 4: Bot & Crawler Protection

**Files to create in `/public`**:

1. **robots.txt** - Block all crawlers
2. **sitemap.xml** - Intentionally empty
3. **manifest.json** - No PWA installation

---

## Administrative Flows

### Flow 1: Contract Configuration

```
Admin Login → Dashboard → Contract Selection → View Current Config
  ↓
Modify Setting (e.g., update fee from 0.2% to 0.15%)
  ↓
Confirm Password → Generate Transaction → Sign with Wallet
  ↓
Submit to Blockchain → Wait for Confirmation → Audit Log
```

**Permissions Required**: `contract:write`

### Flow 2: Emergency Pause

```
Security Incident Detected → Admin Login → Emergency Controls
  ↓
Click "Pause All Swaps" → Confirm Password + MFA
  ↓
Execute pause() on Router402 → Immediate Effect
  ↓
Alert All Stakeholders → Audit Log → Incident Response
```

**Permissions Required**: `emergency:pause`
**Multi-Admin Approval**: Not required (time-critical)

### Flow 3: Treasury Update

```
Admin Login → Contract Management → Router402 Settings
  ↓
Update Treasury Address → Enter New Multisig Address
  ↓
Verify Address (Checksum) → Confirm Password + MFA
  ↓
[REQUIRES 2 ADMIN APPROVALS] → First admin signs
  ↓
Second admin reviews and signs → Execute setTreasury()
  ↓
Blockchain confirmation → Audit log → Alert notifications
```

**Permissions Required**: `treasury:update`
**Multi-Admin Approval**: **REQUIRED** (high risk)

### Flow 4: Fee Adjustment

```
Admin Login → Router402 Management → Fee Settings
  ↓
Current Fee: 0.2% (20 bps) → Adjust to new value (max 1%)
  ↓
Confirm Password → Review change summary
  ↓
Sign transaction → Execute setFee() → Confirmation
  ↓
Audit log → User notification (via API)
```

**Permissions Required**: `fee:update`
**Constraints**: Max 1% (100 bps), enforced by contract

### Flow 5: Token/Bridge Management

```
Admin Login → Configuration → Supported Tokens/Bridges
  ↓
Add USDC: 0x833589... → Verify address on BaseScan
  ↓
Confirm Password → setSupportedToken(address, true)
  ↓
Add Socket Bridge → Verify bridge contract
  ↓
setApprovedBridge(address, true) → Confirmation
```

**Permissions Required**: `config:update`

### Flow 6: Deployment Monitoring

```
Admin Login → Deployments Dashboard → Select Network
  ↓
View: Base Sepolia, Ethereum Sepolia, Base Mainnet
  ↓
For each deployment:
  - Contract addresses
  - Deployment dates
  - Verification status
  - Current configuration
  - Transaction history
```

**Permissions Required**: `deployment:read` (read-only)

### Flow 7: Audit Log Review

```
Admin Login → Audit Logs → Filter by date/action/admin
  ↓
View all administrative actions with:
  - Timestamp
  - Admin user
  - Action performed
  - Resource affected
  - IP address
  - Success/failure
  - Transaction hash (if applicable)
```

**Permissions Required**: `audit:read`
**Retention**: 2 years minimum

---

## Admin Dashboard Routes

**Base URL**: `https://admin.402.vln.gg`

```
/                         → Login page (if not authenticated)
/dashboard                → Overview & quick stats
/contracts                → Contract management
/contracts/router         → Router402 configuration
/contracts/fee-collector  → FeeCollector402 config
/deployments              → Deployment status & addresses
/audit-logs               → Audit trail viewer
/emergency                → Emergency controls (pause, etc.)
/settings                 → Admin account settings (MFA, etc.)
```

**API Routes**: `https://admin.402.vln.gg/api/*`

---

## Permission Matrix

| Action | Permission | Password Confirm | MFA | Multi-Admin |
|--------|-----------|------------------|-----|-------------|
| View dashboard | `dashboard:read` | No | No | No |
| View config | `contract:read` | No | No | No |
| Update fee | `fee:update` | Yes | No | No |
| Add token/bridge | `config:update` | Yes | No | No |
| Emergency pause | `emergency:pause` | Yes | Yes | No |
| Update treasury | `treasury:update` | Yes | Yes | **Yes (2)** |
| Emergency withdraw | `emergency:withdraw` | Yes | Yes | **Yes (3)** |
| View audit logs | `audit:read` | No | No | No |

---

## Security Headers Configuration

**Next.js `next.config.ts`**:

```typescript
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(), microphone=(), camera=()'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js dev
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://mainnet.base.org https://sepolia.base.org",
      "frame-ancestors 'none'"
    ].join('; ')
  }
];
```

---

## Environment Setup Guide

### 1. Generate Secure Credentials

```bash
# In 402-vln-gg directory:

# Generate password hash
npx bcrypt-cli "YourSecurePassword123!" 12

# Generate JWT secret (256-bit)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate refresh secret (different!)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate MFA secret (base32 for TOTP)
node -e "console.log(require('crypto').randomBytes(20).toString('base32'))"
```

### 2. Create `.env.local`

```bash
# Copy from .env.example
cp .env.example .env.local

# Edit with secure values
nano .env.local
```

### 3. Add to `.gitignore`

```bash
# Ensure these are in .gitignore:
.env.local
.env*.local
.env.production
```

---

## Development vs Production

### Development Mode

```bash
# .env.local (development)
DEV_MODE=true
DEV_SKIP_MFA=true  # ONLY for local development
ADMIN_ALLOWED_IPS=  # Empty = no IP filtering
```

### Production Mode

```bash
# .env.production
DEV_MODE=false
DEV_SKIP_MFA=false  # MFA REQUIRED
ADMIN_ALLOWED_IPS=1.2.3.4,5.6.7.8  # Strict IP whitelist
ADMIN_FORCE_HTTPS=true
```

---

## Implementation Checklist

### Phase 1: Security Foundation
- [ ] Create `/admin` Next.js route with middleware
- [ ] Implement environment-based authentication
- [ ] Add bcrypt password hashing
- [ ] Set up JWT token generation
- [ ] Configure HttpOnly secure cookies
- [ ] Add rate limiting middleware
- [ ] Create IP whitelist check

### Phase 2: MFA Integration
- [ ] Install `otplib` for TOTP
- [ ] Add MFA setup flow
- [ ] Generate and encrypt backup codes
- [ ] Implement MFA verification
- [ ] Add MFA recovery process

### Phase 3: Bot Protection
- [ ] Add robots.txt to `/public`
- [ ] Create empty sitemap.xml
- [ ] Configure manifest.json
- [ ] Add meta noindex tags to admin pages
- [ ] Implement security headers

### Phase 4: Admin Flows
- [ ] Dashboard overview page
- [ ] Contract configuration UI
- [ ] Emergency controls interface
- [ ] Audit log viewer
- [ ] Deployment monitor

### Phase 5: Testing & Hardening
- [ ] Penetration testing
- [ ] Security audit
- [ ] Rate limit testing
- [ ] Session management testing
- [ ] OWASP security scan

---

## Emergency Contacts

- **Security Team**: security@fused-gaming.com
- **On-Call Admin**: [Encrypted contact method]
- **Incident Response**: Follow [incident-response.md]

---

**CRITICAL**: Keep this document secure. Do not commit actual credentials to git.

**Next Steps**: See [ADMIN_IMPLEMENTATION.md] for technical implementation details.
