# M2 Development Branch Guide

**Milestone**: M2 - Deterministic Deployment & Key Management (v1.1.0)
**Created**: December 21, 2024
**Status**: Active Development

## Branch Structure

All M2 development is organized into 4 parallel track branches. Each branch focuses on a specific aspect of the milestone and can be developed independently.

---

## 🌿 Active Development Branches

### Track 1: CREATE2 Infrastructure
**Branch**: `feat/m2-track1-create2-factory`
**Purpose**: Smart contract development for deterministic deployment
**Team**: Smart Contract Developers
**Priority**: CRITICAL

#### Branch URL
https://github.com/Fused-Gaming/stablecoin-aggregators/tree/feat/m2-track1-create2-factory

#### Scope
- CREATE2Factory.sol contract implementation
- Deployment script updates for CREATE2
- Salt generation and address pre-computation
- Bytecode verification utilities
- Comprehensive test suite

#### Getting Started
```bash
git checkout feat/m2-track1-create2-factory
git pull origin feat/m2-track1-create2-factory

# Create initial files
touch contracts/CREATE2Factory.sol
touch scripts/deploy-create2.ts
touch scripts/utils/salt-generator.ts
touch scripts/utils/address-precompute.ts
touch scripts/utils/bytecode-verify.ts
touch test/CREATE2Factory.test.ts
```

#### Success Criteria
- [ ] CREATE2Factory.sol complete and tested
- [ ] Deployment scripts using CREATE2
- [ ] Same addresses on Base Sepolia + Ethereum Sepolia
- [ ] 100% test coverage on factory contract
- [ ] Documentation updated

---

### Track 2: Documentation & Procedures
**Branch**: `docs/m2-track2-procedures`
**Purpose**: Create comprehensive procedural documentation
**Team**: Technical Writers / Security Engineers
**Priority**: HIGH

#### Branch URL
https://github.com/Fused-Gaming/stablecoin-aggregators/tree/docs/m2-track2-procedures

#### Scope
- Multisig setup documentation
- Key ceremony protocol
- Emergency response playbook
- Key management runbook
- Signer onboarding guide

#### Getting Started
```bash
git checkout docs/m2-track2-procedures
git pull origin docs/m2-track2-procedures

# Create documentation structure
mkdir -p docs/procedures
touch docs/procedures/multisig-setup.md
touch docs/procedures/key-ceremony.md
touch docs/procedures/emergency-response-playbook.md
touch docs/procedures/key-management-runbook.md
touch docs/procedures/signer-onboarding.md
```

#### Success Criteria
- [ ] All 5 documentation files complete
- [ ] Key ceremony protocol reviewed by security team
- [ ] Emergency procedures validated in tabletop exercise
- [ ] Cross-linked with ROADMAP.md and SECURITY.md
- [ ] Peer reviewed and approved

---

### Track 3: Hardware Wallet Integration
**Branch**: `feat/m2-track3-hardware-wallet`
**Purpose**: Integrate hardware wallet support for deployments
**Team**: DevOps Engineers
**Priority**: MEDIUM

#### Branch URL
https://github.com/Fused-Gaming/stablecoin-aggregators/tree/feat/m2-track3-hardware-wallet

#### Scope
- Hardware wallet research and selection
- Hardhat integration with Ledger/Trezor
- Air-gapped signing workflows
- Deployment scripts with hardware wallet support
- Setup and troubleshooting documentation

#### Getting Started
```bash
git checkout feat/m2-track3-hardware-wallet
git pull origin feat/m2-track3-hardware-wallet

# Install hardware wallet dependencies
npm install --save-dev @ledgerhq/hw-app-eth
npm install --save-dev @nomicfoundation/hardhat-ledger

# Create files
touch scripts/deploy-hardware-wallet.ts
touch docs/hardware-wallet-setup.md
touch docs/hardware-wallet-troubleshooting.md
```

#### Success Criteria
- [ ] Hardware wallet integration tested on testnet
- [ ] Support for both Ledger and Trezor
- [ ] Air-gapped signing demonstrated
- [ ] Complete setup documentation
- [ ] Troubleshooting guide with common issues

---

### Track 4: Multisig Infrastructure Setup
**Branch**: `feat/m2-track4-multisig-setup`
**Purpose**: Set up multisig infrastructure and coordinate signers
**Team**: Project Managers / Operations
**Priority**: MEDIUM

#### Branch URL
https://github.com/Fused-Gaming/stablecoin-aggregators/tree/feat/m2-track4-multisig-setup

#### Scope
- Signer identification and vetting
- Hardware wallet procurement
- Testnet multisig deployment
- Key ceremony scheduling
- Signer coordination

#### Getting Started
```bash
git checkout feat/m2-track4-multisig-setup
git pull origin feat/m2-track4-multisig-setup

# Create tracking files
touch docs/signers/signer-roster.md
touch docs/signers/hardware-wallet-inventory.md
touch scripts/deploy-multisig-testnet.ts
touch scripts/test-multisig-flows.ts
```

#### Success Criteria
- [ ] All 11 signers identified (3+5+3)
- [ ] Hardware wallets procured and distributed
- [ ] Testnet multisigs deployed and tested
- [ ] All signers trained on procedures
- [ ] Key ceremony scheduled

---

## 🔄 Branch Workflow

### Development Process

1. **Checkout your track branch**
   ```bash
   git checkout feat/m2-track1-create2-factory  # or your track
   git pull origin feat/m2-track1-create2-factory
   ```

2. **Create feature branches from track branches**
   ```bash
   # Example: Working on salt generation in Track 1
   git checkout -b feat/m2-track1-salt-generation
   # Do your work
   git add .
   git commit -m "Add salt generation utilities"
   git push origin feat/m2-track1-salt-generation
   ```

3. **Create PR to merge back into track branch**
   ```bash
   gh pr create --base feat/m2-track1-create2-factory \
                --head feat/m2-track1-salt-generation \
                --title "Add salt generation utilities"
   ```

4. **Track branch maintainers review and merge**

5. **When track is complete, create PR to master**
   ```bash
   gh pr create --base master \
                --head feat/m2-track1-create2-factory \
                --title "M2 Track 1: CREATE2 Factory Implementation"
   ```

---

## 📊 Branch Dependencies

### No Dependencies (Can Start Immediately)
- ✅ `feat/m2-track1-create2-factory` - Start immediately
- ✅ `docs/m2-track2-procedures` - Start immediately

### Minimal Dependencies
- ⚠️ `feat/m2-track3-hardware-wallet` - Can start research immediately, integration needs Track 1 design
- ⚠️ `feat/m2-track4-multisig-setup` - Can start signer identification immediately, deployment needs Track 1 + 3

### Merge Order (To Master)
1. Track 1 (CREATE2 Factory) - First
2. Track 2 (Documentation) - Can be parallel with Track 1
3. Track 3 (Hardware Wallet) - After Track 1
4. Track 4 (Multisig Setup) - After Track 1 + 3

---

## 🎯 Branch Assignments

| Track | Branch | Assignee | Status |
|-------|--------|----------|--------|
| Track 1 | `feat/m2-track1-create2-factory` | TBD | 🟡 Ready |
| Track 2 | `docs/m2-track2-procedures` | TBD | 🟡 Ready |
| Track 3 | `feat/m2-track3-hardware-wallet` | TBD | 🟡 Ready |
| Track 4 | `feat/m2-track4-multisig-setup` | TBD | 🟡 Ready |

**Status Legend**:
- 🟡 Ready - Branch created, ready for development
- 🟢 Active - Development in progress
- 🔵 Review - In code review
- ✅ Complete - Merged to master

---

## 📋 Branch Protection Rules

### Recommended Settings (To Be Configured)

For all M2 track branches:
- [ ] Require pull request reviews (1 approval minimum)
- [ ] Require status checks to pass before merging
  - [ ] CI: Tests pass
  - [ ] CI: Lint checks pass
  - [ ] CI: Coverage threshold met (Track 1)
- [ ] Require conversation resolution before merging
- [ ] Do not allow force pushes
- [ ] Do not allow deletions

For master branch:
- [ ] Require pull request reviews (2 approvals for M2 merges)
- [ ] Require all status checks to pass
- [ ] Require linear history
- [ ] Include administrators

---

## 🔍 Monitoring Progress

### GitHub Issues
Each track should have associated issues labeled with:
- Milestone: `M2`
- Track label: `M2-track1`, `M2-track2`, `M2-track3`, `M2-track4`
- Priority: Based on task criticality
- Type: `feat`, `docs`, `devops`, etc.

### Project Board
Consider creating a GitHub Project Board with columns:
- 📋 Backlog
- 🟡 Ready
- 🟢 In Progress
- 👀 In Review
- ✅ Complete

---

## 🚀 Quick Start Commands

### List all M2 branches
```bash
git branch -a | grep m2-track
```

### Switch between tracks
```bash
git checkout feat/m2-track1-create2-factory
git checkout docs/m2-track2-procedures
git checkout feat/m2-track3-hardware-wallet
git checkout feat/m2-track4-multisig-setup
```

### Pull latest changes for all tracks
```bash
git fetch --all
git checkout feat/m2-track1-create2-factory && git pull
git checkout docs/m2-track2-procedures && git pull
git checkout feat/m2-track3-hardware-wallet && git pull
git checkout feat/m2-track4-multisig-setup && git pull
git checkout master
```

### Check branch status
```bash
gh pr list --state all --base master | grep m2-track
```

---

## 📚 Related Documentation

- [M2_PARALLEL_DEVELOPMENT.md](../M2_PARALLEL_DEVELOPMENT.md) - Detailed parallel development plan
- [ROADMAP.md](../ROADMAP.md) - Milestone 2 full details
- [CHANGELOG.md](../CHANGELOG.md) - Track progress updates
- [VERSION.md](../VERSION.md) - Version targeting (v1.1.0)

---

## 🆘 Support

### Questions about branches?
- Open a discussion on GitHub
- Tag issues with `question` label
- Check M2_PARALLEL_DEVELOPMENT.md for details

### Having trouble with a track?
- Document blockers in GitHub issues
- Update CHANGELOG.md with progress notes
- Communicate with other track teams

---

**Last Updated**: December 21, 2024
**Next Review**: Weekly during M2 development

All branches are live and ready for development to begin! 🚀
