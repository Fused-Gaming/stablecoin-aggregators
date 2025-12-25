# Version Control

## Current Version: v1.2.0

**Release Date**: December 24, 2025
**Status**: Admin Dashboard Architecture & Subdomain Infrastructure
**Milestone**: [Milestone 2 - Deterministic Deployment & Key Management](ROADMAP.md#milestone-2-deterministic-deployment--key-management--complete)

---

## Version History

### v1.2.0 - Admin Dashboard & Subdomain Architecture (December 24, 2025)

**Status**: ✅ Released

#### Features
- **Admin Dashboard Security Architecture** ([ADMIN_SECURITY.md](402-vln-gg/docs/ADMIN_SECURITY.md))
  - Multi-layered security (environment auth, MFA, session management, bot protection)
  - 7 documented administrative flows
  - Permission matrix for all operations
  - Multi-admin approval for critical operations
  - Deployed on dedicated subdomain: `admin.402.vln.gg`

- **Subdomain Architecture** ([VERCEL_DEPLOYMENT.md](402-vln-gg/docs/VERCEL_DEPLOYMENT.md))
  - `admin.402.vln.gg` - Secure admin dashboard (deployed)
  - `402.vln.gg` - x402 Payment Gateway (planned M5-M7)
  - `manage.402.vln.gg` - Internal management platform (planned M3-M4)
  - `swap.402.vln.gg` - Stablecoin aggregator UI (planned M8-M9)

- **Vercel Analytics Integration**
  - Installed `@vercel/analytics` package
  - Analytics component added to root layout
  - Real-time traffic and performance monitoring

- **Documentation Organization**
  - Reorganized docs into structured folders:
    - `docs/web-platform/` - Platform architecture
    - `docs/milestones/` - Milestone completion reports
    - `docs/tracks/` - Track completion documentation
    - `docs/specifications/` - Protocol specifications (x402)
  - Updated `docs.json` with new structure

#### Security
- Bot protection via `robots.txt` (blocks admin routes, AI scrapers)
- SEO isolation via `sitemap.xml` (excludes admin routes)
- Dedicated subdomain for admin dashboard (isolation)
- Environment-based authentication strategy
- IP whitelisting and rate limiting architecture
- JWT token management (15min access, 7day refresh)
- TOTP-based MFA requirement

#### Deployment
- Successfully deployed to Vercel (https://402-vln-gg.vercel.app)
- Custom domain configuration documented
- Production-ready security headers
- HTTPS enforcement
- Environment variable management guide

#### Documentation
- **New**: [VERCEL_DEPLOYMENT.md](402-vln-gg/docs/VERCEL_DEPLOYMENT.md) - Complete deployment guide
- **Updated**: [ADMIN_SECURITY.md](402-vln-gg/docs/ADMIN_SECURITY.md) - Reflects subdomain architecture
- **Updated**: [docs.json](docs.json) - New documentation structure

### v1.0.0 - Foundation Release (December 21, 2025)

**Status**: ✅ Released

#### Features
- Core smart contracts implemented:
  - Router402.sol - Main routing contract with fee collection
  - FeeCollector402.sol - Simple fee collector for off-chain routing
  - Treasury402.sol - 2/3 multisig treasury for fee management
- Security patterns implemented:
  - ReentrancyGuard on all swap functions
  - Ownable2Step for safe ownership transfer
  - Pausable for emergency controls
  - SafeERC20 for token interactions
- Development infrastructure:
  - Hardhat development environment
  - TypeScript integration
  - Comprehensive test suite
  - GitHub Actions CI/CD workflows
- Documentation:
  - API reference
  - Architecture documentation
  - Deployment guides
  - Security documentation

#### Security
- OpenZeppelin security patterns
- Custom errors for gas efficiency
- Input validation on all functions
- Daily volume limits
- Emergency pause mechanisms

#### Testing
- Unit tests for all contracts
- Integration tests for swap flows
- Gas optimization tests
- Coverage reports

#### Known Limitations
- Not yet audited by external security firm
- Testnet only (not deployed to mainnet)
- Single bridge integration (Socket)
- Conservative volume limits

#### Breaking Changes
- N/A (initial release)

#### Migration Guide
- N/A (initial release)

---

### v1.1.0 - CREATE2 & Key Management (Released: December 21, 2025)

**Status**: ✅ Released
**Milestone**: [Milestone 2 - Deterministic Deployment & Key Management](ROADMAP.md#milestone-2-deterministic-deployment--key-management)

#### Features
- **CREATE2 Factory Contract**: Deterministic contract deployments across all chains
  - CREATE2Factory.sol with salt generation
  - Address pre-computation utilities
  - Cross-chain address consistency
  - Bytecode verification tools

- **Hardware Wallet Integration**: Optional hardware wallet support for secure deployments
  - Full Ledger support (Nano S Plus, Nano X)
  - Full Trezor support (Model T, One)
  - Flexible signer factory (software OR hardware wallets)
  - Air-gapped signing workflows
  - Migration path from software to hardware wallets

- **Multisig Infrastructure**: Three-level Gnosis Safe multisig hierarchy
  - Level 2: Admin Multisig (2-of-3) - Contract configuration
  - Level 3: Treasury Multisig (3-of-5) - Fund management
  - Level 4: Emergency Multisig (1-of-3) - Fast response
  - Fillable environment variables for signer configuration
  - Deployment and testing utilities

- **Comprehensive Documentation**: 12 operational guides
  - 5 hardware wallet guides (50+ pages)
  - 5 operational procedure guides
  - 2 track completion reports
  - Complete M2 milestone summary

#### Security Enhancements
- Deterministic deployment verification
- Multi-level key hierarchy (4 levels)
- Key ceremony protocols documented
- Geographic distribution guidelines
- Hardware wallet security best practices
- Multisig threshold enforcement

#### Development Status
- ✅ CREATE2 factory contract implemented and tested
- ✅ Deployment scripts updated for CREATE2
- ✅ Hardware wallet integration complete (Ledger & Trezor)
- ✅ Multisig configurations documented and implemented
- ✅ Key ceremony procedures drafted and reviewed
- ✅ Co-signer onboarding program (4-week testnet practice)

#### New Scripts
- `npm run deploy:hw:base-sepolia` - Hardware wallet deployment (testnet)
- `npm run deploy:hw:base` - Hardware wallet deployment (Base mainnet)
- `npm run deploy:hw:ethereum` - Hardware wallet deployment (Ethereum)
- `npm run multisig:deploy:base-sepolia` - Deploy multisig (testnet)
- `npm run multisig:deploy:base` - Deploy multisig (Base mainnet)
- `npm run multisig:deploy:ethereum` - Deploy multisig (Ethereum)
- `npm run multisig:test` - Test deployed multisig

#### Dependencies Added
- `@ledgerhq/hw-app-eth@^6.35.0` - Ledger integration
- `@ledgerhq/hw-transport-node-hid@^6.28.0` - Ledger USB communication
- `@nomicfoundation/hardhat-ledger@^1.0.3` - Hardhat Ledger plugin
- `trezor-connect@^9.1.0` - Trezor integration

#### Breaking Changes
- None (additive features only)

#### Known Limitations
- Hardware wallet testing requires physical devices
- Multisig deployment requires signer coordination
- Testnet validation pending actual signer participation

---

### v1.1.1 - OpenZeppelin v5 Migration & Developer Tooling (Released: December 24, 2025)

**Status**: ✅ Released

#### Features
- **OpenZeppelin v5 Migration**: Updated all contracts for compatibility
  - Added `Ownable(msg.sender)` to FeeCollector402 and Router402 constructors
  - Replaced deprecated `safeApprove()` with `forceApprove()`
  - Fixed CREATE2Factory variable shadowing warning

- **Developer Documentation**: Comprehensive onboarding guide
  - CLAUDE.md with complete project context
  - Architecture decisions and rationale
  - Common tasks and troubleshooting
  - Testing and deployment procedures

- **GitHub Actions Fix**: Corrected action.yml location
  - Moved from `.github/workflows/actions.yml` to repo root `action.yml`
  - Fixes workflow validation errors

#### Bug Fixes
- Fixed `DeploymentFailed` error naming conflict → `Create2DeploymentFailed`
- Fixed OpenZeppelin v5 constructor compatibility issues
- Fixed CREATE2Factory `hasCode()` return value shadowing

#### Dependencies
- Updated to OpenZeppelin Contracts v5.x
- Regenerated package-lock.json and pnpm-lock.yaml

#### Development
- Cleaned up stale feature branches
- Merged PR #29 (compilation fixes)
- Closed stale PR #21 (superseded changes)
- Deleted 3 merged remote branches

#### Breaking Changes
- None (backward compatible fixes only)

---

### v1.2.0 - Testnet Validation (Target: Q1 2026)

**Status**: ⏳ Planned
**Milestone**: [Milestone 3 - Testnet Deployment & Validation](ROADMAP.md#milestone-3-testnet-deployment--validation)

#### Planned Features
- Base Sepolia deployment
- Ethereum Sepolia deployment
- Cross-chain validation
- Load testing results
- Security incident simulations

#### Testing Scope
- 10,000+ testnet transactions
- Bridge integration validation
- Emergency procedure testing
- Multisig workflow validation

---

### v1.3.0 - Security Audit (Target: Q1 2025)

**Status**: ⏳ Planned
**Milestone**: [Milestone 4 - Security Audit & Remediation](ROADMAP.md#milestone-4-security-audit--remediation)

#### Planned Features
- Professional security audit completion
- All critical/high findings remediated
- Bug bounty program launch
- Public audit report

#### Security Deliverables
- External audit report
- Remediation documentation
- Re-audit verification
- Bug bounty program active

---

### v2.0.0 - Base Mainnet Launch (Target: Q2 2025)

**Status**: ⏳ Planned
**Milestone**: [Milestone 5 - Mainnet Deployment (Phase 1)](ROADMAP.md#milestone-5-mainnet-deployment-phase-1)

#### Planned Features
- Base mainnet deployment
- Production monitoring infrastructure
- Conservative launch parameters
- Public launch announcement

#### Launch Parameters
- Max Swap: $10,000 USDC
- Daily Limit: $50,000 per user
- Fee: 0.2% (20 bps)
- Approved Bridges: Socket Router only

#### Breaking Changes
- Production contract addresses
- Mainnet-specific configurations

---

### v2.1.0 - Ethereum Mainnet (Target: Q2 2025)

**Status**: ⏳ Planned
**Milestone**: [Milestone 6 - Ethereum Mainnet Expansion](ROADMAP.md#milestone-6-ethereum-mainnet-expansion)

#### Planned Features
- Ethereum mainnet deployment
- Cross-chain ETH ↔ Base routing
- Increased volume limits
- Additional bridge support

#### Launch Parameters
- Max Swap: $100,000 USDC
- Daily Limit: $500,000 per user
- Approved Bridges: Socket, LayerZero

---

### v3.0.0 - Multi-Chain Expansion (Target: Q3 2025)

**Status**: ⏳ Planned
**Milestone**: [Milestone 7 - Advanced Features & Integrations](ROADMAP.md#milestone-7-advanced-features--integrations)

#### Planned Features
- 5+ chain support (Arbitrum, Optimism, etc.)
- LayerZero direct integration
- TON bridge support
- Route optimization algorithms
- MEV protection mechanisms

#### Breaking Changes
- New routing architecture
- Updated fee models
- Enhanced API

---

### v4.0.0 - Governance & DAO (Target: Q4 2025)

**Status**: ⏳ Planned
**Milestone**: [Milestone 8 - Decentralization & Governance](ROADMAP.md#milestone-8-decentralization--governance)

#### Planned Features
- Governance token launch
- DAO framework implementation
- Progressive decentralization
- Timelock controllers

#### Breaking Changes
- Ownership transition to DAO
- New governance processes
- Token-based voting

---

### v5.0.0 - Next-Gen Chains (Target: Q1 2026)

**Status**: ⏳ Planned
**Milestone**: [Milestone 9 - Monad & Next-Gen Chains](ROADMAP.md#milestone-9-monad--next-gen-chains)

#### Planned Features
- Monad deployment
- Emerging L1/L2 support
- Next-gen bridge protocols
- Advanced MEV protection

---

### v6.0.0 - Institutional Features (Target: Q2 2026)

**Status**: ⏳ Planned
**Milestone**: [Milestone 10 - Institutional Features](ROADMAP.md#milestone-10-institutional-features)

#### Planned Features
- KYC/AML integrations
- Whitelisting capabilities
- Compliance reporting
- Enterprise API
- SLA guarantees

---

## Versioning Scheme

We follow [Semantic Versioning](https://semver.org/) (SemVer):

**Format**: `MAJOR.MINOR.PATCH`

- **MAJOR**: Incompatible API changes, major new features
- **MINOR**: New functionality in a backward-compatible manner
- **PATCH**: Backward-compatible bug fixes

### Special Versions
- **Pre-release**: `v1.0.0-alpha.1`, `v1.0.0-beta.1`, `v1.0.0-rc.1`
- **Build metadata**: `v1.0.0+20250121`

---

## Version Status Indicators

- ✅ **Released**: Version is live and deployed
- 🔄 **In Progress**: Active development underway
- ⏳ **Planned**: Scheduled for future development
- ⚠️ **Deprecated**: No longer supported
- 🚫 **Cancelled**: Will not be implemented

---

## Deployment Addresses

### Testnet (Base Sepolia)
**Status**: Ready for Level 1 deployment
**Guide**: See [QUICKSTART_DEPLOYMENT.md](QUICKSTART_DEPLOYMENT.md)

*Awaiting first testnet deployment - use quickstart guide to deploy*

### Mainnet (Base)
**Status**: Not deployed (pending testnet validation)
*Awaiting Milestone 3 completion*

### Mainnet (Ethereum)
**Status**: Not deployed (pending Base mainnet)
*Planned for Milestone 6*

---

## Support Policy

### Active Support
- **Current Version** (v1.1.1): Full support, active development
- **Previous Minor** (v1.1.0): Security updates only

### End of Life
- Versions older than 2 major releases are no longer supported
- Critical security patches may be backported at discretion

---

## Release Process

### 1. Pre-Release
- Feature freeze
- Testing freeze (testnet validation)
- Security review
- Documentation update
- CHANGELOG preparation

### 2. Release Candidate
- Deploy to testnet
- Community testing period (7-14 days)
- Bug fixes only
- Final audit review (for mainnet releases)

### 3. Release
- Tag version in Git
- Deploy to mainnet (if applicable)
- Publish release notes
- Update documentation
- Announce to community

### 4. Post-Release
- Monitor for issues
- Hotfix preparation if needed
- Gather community feedback
- Plan next version

---

## Hotfix Policy

Critical security issues may result in immediate hotfix releases:
- Format: `v1.0.1`, `v1.0.2`, etc.
- Emergency multisig approval required
- Expedited audit review
- Immediate deployment
- Public disclosure after fix

---

## Upgrade Path

### Non-Upgradeable Contracts
Current contracts are **not upgradeable** by design. Major updates require:
1. Deploy new contracts
2. Pause old contracts
3. Migrate treasury funds (via multisig)
4. Update frontend integrations
5. Communicate with users
6. Grace period for migration

### Future Upgradeable Contracts
- May implement proxy patterns for v3.0.0+
- Will require additional security considerations
- Community governance approval required

---

## Version Roadmap Timeline

```
2025 Q4: v1.0.0 ✅
2025 Q4: v1.1.0 ✅
2025 Q4: v1.1.1 ✅
2026 Q1: v1.2.0 → v1.3.0
2026 Q2: v2.0.0 → v2.1.0
2026 Q3: v3.0.0
2026 Q4: v4.0.0
2027 Q1: v5.0.0
2027 Q2: v6.0.0
```

---

## Related Documentation

- [ROADMAP.md](ROADMAP.md) - Detailed milestone planning
- [CHANGELOG.md](CHANGELOG.md) - Detailed change history
- [README.md](README.md) - Project overview
- [SECURITY.md](SECURITY.md) - Security policies

---

**Last Updated**: December 24, 2025
**Next Review**: April 1, 2026

For detailed progress on current development, see [CHANGELOG.md](CHANGELOG.md).
