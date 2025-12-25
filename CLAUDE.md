# Claude Code Developer Guide

**Last Updated**: 2025-12-24
**Project**: Stablecoin Aggregator Smart Contracts
**Organization**: Fused-Gaming

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Architecture](#project-architecture)
3. [Development Workflow](#development-workflow)
4. [Key Decisions & Rationale](#key-decisions--rationale)
5. [Common Tasks](#common-tasks)
6. [Troubleshooting](#troubleshooting)
7. [Integration Points](#integration-points)
8. [Security Considerations](#security-considerations)
9. [Testing Strategy](#testing-strategy)
10. [Deployment Guide](#deployment-guide)

---

## Quick Start

### Understanding the Project

This is a **production-grade cross-chain stablecoin aggregator** with integrated x402 micropayments. The system enables users to swap stablecoins across multiple chains (Ethereum, Base, TON, Monad, Solana) with minimal fees (0.2% default).

**Core Value Proposition**: Unified stablecoin liquidity across chains with predictable, low fees.

### Initial Setup

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm test

# Check coverage
npm run coverage
```

### Key Files to Read First

1. [README.md](README.md) - Project overview and quick reference
2. [ROADMAP.md](ROADMAP.md) - Development milestones and progress
3. [docs/architecture.md](docs/architecture.md) - System architecture
4. [contracts/Router402.sol](contracts/Router402.sol) - Main contract
5. [CHANGELOG.md](CHANGELOG.md) - Recent changes and version history

---

## Project Architecture

### Contract Hierarchy

```
CREATE2Factory (Deployment)
    └── Router402 (Main routing logic)
        ├── Ownable2Step (Safe ownership)
        ├── ReentrancyGuard (Reentrancy protection)
        └── Pausable (Emergency controls)

    └── FeeCollector402 (Simple fee collection)
        └── Ownable (Admin controls)

    └── Treasury402 (Not yet implemented - planned 2/3 multisig)
```

### Critical Design Patterns

1. **CREATE2 Deterministic Deployment**
   - Ensures same contract addresses across all chains
   - Located in: [contracts/CREATE2Factory.sol](contracts/CREATE2Factory.sol)
   - See: [docs/CREATE2_DEPLOYMENT.md](docs/CREATE2_DEPLOYMENT.md)

2. **x402 Micropayment Architecture**
   - Pay-per-quote execution model
   - Fee payment unlocks off-chain routing
   - Tracked via `quotesExecuted` mapping

3. **Bridge Abstraction**
   - Generic `swap()` function accepts any bridge
   - Specialized `swapViaSocket()` for Socket Protocol
   - Approved bridges via whitelist

### File Structure

```
stablecoin-aggregators/
├── contracts/               # Solidity smart contracts
│   ├── Router402.sol       # Main routing contract
│   ├── FeeCollector402.sol # Fee collection
│   ├── CREATE2Factory.sol  # Deterministic deployment
│   └── interfaces/         # Contract interfaces
├── scripts/                 # Deployment and testing scripts
│   └── deploy.ts           # Main deployment script
├── test/                    # Test suites
├── docs/                    # Comprehensive documentation
│   ├── architecture.md     # System architecture
│   ├── deployment.md       # Deployment guides
│   ├── security.md         # Security protocols
│   └── procedures/         # Operational procedures
├── .github/
│   ├── workflows/          # CI/CD pipelines
│   └── scripts/            # Auto-documentation
├── ROADMAP.md              # Development milestones
├── CHANGELOG.md            # Version history
└── VERSION.md              # Current version info
```

---

## Development Workflow

### Git Branch Strategy

- **master**: Production-ready code only
- **develop**: Integration branch (currently synced with master)
- **feature/***: Feature branches (use descriptive names)
- **fix/***: Bug fix branches
- **docs/***: Documentation updates

### Commit Message Convention

We follow semantic commit messages with Claude Code attribution:

```
<type>(<scope>): <subject>

<body>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Types**: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`

### Pull Request Process

1. Create feature branch from `master`
2. Implement changes with tests
3. Ensure all CI checks pass (compilation, tests, linting)
4. Create PR with descriptive title and summary
5. Address any review feedback
6. Squash merge into `master`

### CI/CD Workflows

Located in [.github/workflows/](.github/workflows/):

- **test.yml**: Run test suite on PR
- **coverage.yml**: Generate coverage reports
- **lint.yml**: Solidity linting
- **security.yml**: Static security analysis
- **level1-testing.yml**: Integration testing workflow
- **auto-document.yml**: Auto-generate documentation from commits

---

## Key Decisions & Rationale

### Why OpenZeppelin v5?

**Decision**: Upgraded to OpenZeppelin Contracts v5.x

**Rationale**:
- Enhanced security patterns
- Better gas optimization
- Required `Ownable(initialOwner)` in constructor
- Deprecated `safeApprove()` → use `forceApprove()`

**Migration Notes**:
- All contracts updated to pass `msg.sender` to `Ownable()` constructor
- Replaced `safeApprove` with `forceApprove` in Router402.sol:220, 308

### Why CREATE2?

**Decision**: Use CREATE2 for all contract deployments

**Rationale**:
- **Predictability**: Same address across all chains (Ethereum, Base, etc.)
- **Verification**: Users can verify deployment integrity
- **Reproducibility**: Re-deploy at exact same address if needed
- **Trust**: Transparent deployment process

**Implementation**: [CREATE2Factory.sol](contracts/CREATE2Factory.sol)

### Why x402 Micropayments?

**Decision**: Integrate x402-style fee payment before quote execution

**Rationale**:
- **Capital Efficient**: Small upfront fee unlocks routing
- **Anti-Spam**: Prevents DoS via quote requests
- **Fair Pricing**: Pay per execution, not per quote
- **Simple UX**: Single transaction covers fee + swap

### Why 0.2% Default Fee?

**Decision**: Set `feeBps = 20` (0.2% fee)

**Rationale**:
- Competitive with Uniswap (0.3%)
- Higher than simple bridges (0.05-0.1%)
- Justified by cross-chain complexity
- Configurable via `setFee()` for market adjustment

### Why Daily Volume Limits?

**Decision**: Implement per-user daily volume limits (default $100k)

**Rationale**:
- **Anti-Abuse**: Prevent exploitation or money laundering
- **Risk Management**: Limit exposure to potential exploits
- **Regulatory**: Prepare for compliance requirements
- **Adjustable**: Owner can modify via `setMaxDailyVolume()`

### Why No Treasury Contract Yet?

**Current State**: Treasury address is EOA, not multisig contract

**Rationale**:
- Treasury402 contract planned but not implemented
- Using EOA temporarily for development
- Milestone 3 includes proper multisig treasury
- Easy to migrate via `setTreasury()` when ready

**TODO**: Implement and deploy Treasury402 multisig

---

## Common Tasks

### Adding a New Supported Token

```solidity
// In Router402, owner calls:
router.setSupportedToken(USDC_ADDRESS, true);
```

**Location**: Router402.sol:402

### Adding a New Bridge

```solidity
// In Router402, owner calls:
router.setApprovedBridge(LAYER_ZERO_BRIDGE, true);
```

**Location**: Router402.sol:411

### Updating Fee Percentage

```solidity
// Change fee from 0.2% (20 bps) to 0.15% (15 bps)
router.setFee(15);
```

**Maximum**: 100 bps (1%) enforced by `MAX_FEE_BPS` constant

### Emergency Pause

```solidity
// Pause all swaps
router.pause();

// Unpause
router.unpause();

// Emergency pause (different from normal pause)
router.setEmergencyPause(true);
```

### Deploying to New Chain

1. Update [hardhat.config.ts](hardhat.config.ts) with new network
2. Add RPC URL and API key to `.env`
3. Deploy via CREATE2 for consistent address:
   ```bash
   npx hardhat run scripts/deploy.ts --network <network-name>
   ```
4. Verify on block explorer:
   ```bash
   npx hardhat verify --network <network> <address> <args>
   ```

### Running Level 1 Testing Workflow

This is our integration test that simulates real-world usage:

```bash
# Set environment variables
export PRIVATE_KEY="0x..."
export VLN_URL="https://mock-api.402.vln.gg"

# Run workflow
npx hardhat run scripts/test-level1-workflow.ts --network hardhat
```

**Documentation**: [docs/LEVEL1_TESTING_GUIDE.md](docs/LEVEL1_TESTING_GUIDE.md)

---

## Troubleshooting

### Compilation Errors

**Error**: `TypeError: No arguments passed to the base constructor`

**Solution**: OpenZeppelin v5 requires `Ownable(initialOwner)` in constructor:
```solidity
constructor(address _treasury) Ownable(msg.sender) {
    // ...
}
```

**Error**: `Member "safeApprove" not found`

**Solution**: Use `forceApprove` instead:
```solidity
// Old (deprecated):
IERC20(token).safeApprove(bridge, amount);

// New (v5):
IERC20(token).forceApprove(bridge, amount);
```

**Error**: Variable shadowing warning in CREATE2Factory

**Solution**: Fixed in [CREATE2Factory.sol:299](contracts/CREATE2Factory.sol#L299):
```solidity
// Changed from:
function hasCode(address contractAddress) public view returns (bool hasCode) {

// To:
function hasCode(address contractAddress) public view returns (bool) {
    return size > 0;
}
```

### Test Failures

**Issue**: Level 1 workflow test fails with "PRIVATE_KEY not set"

**Solution**: The Level 1 test requires environment setup that's not available in CI. This is expected. Local testing works fine.

**Issue**: Telegram notification workflow fails

**Solution**: action.yml has been moved to repo root. The workflow requires a Dockerfile which is not yet implemented. This is tracked as a known issue.

### Git Workflow Issues

**Issue**: Branch has merge conflicts with master

**Solution**:
```bash
git checkout your-branch
git fetch origin
git rebase origin/master
# Resolve conflicts
git rebase --continue
```

**Issue**: Stale feature branch needs cleanup

**Solution**:
```bash
# Delete local branch
git branch -D branch-name

# Delete remote branch
git push origin --delete branch-name
```

---

## Integration Points

### Frontend Integration (402.vln.gg)

**Location**: Separate Next.js repo (referenced in commits)

**API Endpoints Expected**:
- `POST /api/quote` - Get routing quote
- `POST /api/execute` - Execute swap (after fee paid)
- `GET /api/status/:txHash` - Check transaction status

**Contract Integration**:
```typescript
// 1. Get quote from API
const quote = await fetch('/api/quote', {
  method: 'POST',
  body: JSON.stringify({ token, amount, dstChain })
});

// 2. Pay fee on-chain
const tx = await feeCollector.payFee(quote.quoteId);

// 3. Execute swap
const swapTx = await router.swap({
  token: quote.token,
  amount: quote.amount,
  bridge: quote.bridge,
  bridgeData: quote.encodedData,
  dstChainId: quote.dstChainId,
  recipient: userAddress
});
```

### Bridge Integration

**Socket Protocol**:
- API: https://api.socket.tech/v2
- Docs: https://docs.socket.tech/
- Function: `Router402.swapViaSocket()`

**LayerZero**:
- Docs: https://layerzero.gitbook.io/
- Integration: Generic `Router402.swap()` with LayerZero bridge data

**Adding New Bridge**:
1. Whitelist bridge: `setApprovedBridge(bridgeAddress, true)`
2. Encode bridge call data off-chain
3. Pass to `swap()` function

### Hardware Wallet Integration

**Supported**: Ledger, Trezor (via Hardhat)

**Setup Guide**: [docs/hardware-wallet-setup.md](docs/hardware-wallet-setup.md)

**Usage**:
```bash
# Deploy with hardware wallet
npx hardhat run scripts/deploy.ts --network base --hardware-wallet
```

---

## Security Considerations

### Critical Security Patterns

1. **ReentrancyGuard**: ALL swap functions use `nonReentrant` modifier
2. **Pausable**: Emergency pause stops all swaps instantly
3. **Ownable2Step**: Prevents accidental ownership transfer
4. **SafeERC20**: All token operations use OpenZeppelin SafeERC20
5. **Input Validation**: Amount bounds, address checks, bridge whitelist

### Known Security Measures

- ✅ Min/max swap amounts enforced (`MIN_SWAP_AMOUNT`, `MAX_SWAP_AMOUNT`)
- ✅ Daily volume limits per user (anti-abuse)
- ✅ Bridge whitelist (prevent malicious bridge calls)
- ✅ Token whitelist (prevent fake token exploits)
- ✅ Fee cap (max 1% via `MAX_FEE_BPS`)
- ✅ Emergency withdraw (rescue stuck funds)

### Audit Status

**Status**: Not yet audited

**Planned**: Milestone 5 (see [ROADMAP.md](ROADMAP.md))

**Targets**:
- Trail of Bits
- OpenZeppelin
- Consensys Diligence

### Bug Bounty

**Status**: Not yet launched

**Planned**: Post-audit, pre-mainnet

---

## Testing Strategy

### Test Coverage

**Target**: >90% line coverage, 100% critical path coverage

**Current Coverage**: Check with `npm run coverage`

### Test Structure

```
test/
├── Router402.test.ts       # Main routing tests
├── FeeCollector402.test.ts # Fee collection tests
├── CREATE2Factory.test.ts  # Deployment tests
└── integration/            # End-to-end tests
```

### Writing Tests

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Router402", function() {
  it("should execute swap with correct fee", async function() {
    const [owner, user] = await ethers.getSigners();

    // Deploy contracts
    const Router = await ethers.getContractFactory("Router402");
    const router = await Router.deploy(treasury.address, 20); // 0.2% fee

    // Setup
    await router.setSupportedToken(usdc.address, true);
    await router.setApprovedBridge(bridge.address, true);

    // Execute swap
    const amount = ethers.parseUnits("1000", 6); // 1000 USDC
    const tx = await router.connect(user).swap({
      token: usdc.address,
      amount: amount,
      bridge: bridge.address,
      bridgeData: encodedData,
      dstChainId: 8453, // Base
      recipient: user.address
    });

    // Verify fee collected
    const fee = amount * 20n / 10000n; // 0.2%
    expect(await usdc.balanceOf(treasury.address)).to.equal(fee);
  });
});
```

### Running Tests

```bash
# All tests
npm test

# Specific file
npx hardhat test test/Router402.test.ts

# With gas reporting
REPORT_GAS=true npm test

# With coverage
npm run coverage
```

---

## Deployment Guide

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Coverage >90%
- [ ] Contracts compiled with optimization
- [ ] Environment variables configured
- [ ] Treasury address confirmed (multisig)
- [ ] Fee percentage decided
- [ ] Supported tokens list ready
- [ ] Approved bridges list ready

### Testnet Deployment (Base Sepolia)

```bash
# 1. Configure .env
PRIVATE_KEY=0x...
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=...
TREASURY_ADDRESS=0x...

# 2. Deploy
npx hardhat run scripts/deploy.ts --network base-sepolia

# 3. Verify
npx hardhat verify --network base-sepolia <ROUTER_ADDRESS> <TREASURY> <FEE_BPS>
npx hardhat verify --network base-sepolia <FEE_COLLECTOR> <TREASURY> <FEE_TOKEN> <BASE_FEE>

# 4. Configure
npx hardhat run scripts/configure.ts --network base-sepolia
```

### Mainnet Deployment

**CRITICAL**: Use hardware wallet for mainnet deployments

```bash
# 1. Deploy via CREATE2 for deterministic address
npx hardhat run scripts/deploy-create2.ts --network base

# 2. Verify deployment
npx hardhat verify --network base <ADDRESS> <ARGS>

# 3. Transfer ownership to multisig
router.transferOwnership(MULTISIG_ADDRESS);
# Then accept from multisig

# 4. Configure supported tokens and bridges
# (Use multisig for these operations)
```

**Post-Deployment**:
1. Update [CHANGELOG.md](CHANGELOG.md) with deployment addresses
2. Update [VERSION.md](VERSION.md) with new version
3. Tag release: `git tag v1.x.x && git push --tags`
4. Announce deployment

---

## Additional Resources

### Documentation

- [ROADMAP.md](ROADMAP.md) - Development milestones
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [VERSION.md](VERSION.md) - Current version info
- [docs/architecture.md](docs/architecture.md) - System design
- [docs/security.md](docs/security.md) - Security protocols
- [docs/CREATE2_DEPLOYMENT.md](docs/CREATE2_DEPLOYMENT.md) - CREATE2 guide

### External Resources

- **Hardhat**: https://hardhat.org/docs
- **OpenZeppelin**: https://docs.openzeppelin.com/contracts/5.x/
- **Socket Protocol**: https://docs.socket.tech/
- **LayerZero**: https://layerzero.gitbook.io/
- **Base**: https://docs.base.org/

### Support

- **Issues**: https://github.com/Fused-Gaming/stablecoin-aggregators/issues
- **Discussions**: Use GitHub Discussions for questions
- **Security**: security@fused-gaming.com (for vulnerabilities)

---

## Changelog for This Guide

- **2025-12-24**: Initial creation (December 24, 2025)
  - Comprehensive project overview
  - Architecture documentation
  - Development workflows
  - Key decisions and rationale
  - Common tasks and troubleshooting
  - Testing and deployment guides

---

**Note to Future Developers**: This guide is maintained alongside the codebase. When making significant architectural changes, please update the relevant sections. Keep it practical and example-driven.

**Built with ❤️ by Fused-Gaming using Claude Code**
