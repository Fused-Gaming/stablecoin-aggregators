# Roadmap

## Overview

This roadmap outlines the development milestones for the Stablecoin Aggregator project, prioritized by importance and dependencies. Each milestone includes security protocols, technical requirements, and success criteria.

**Current Version**: v1.0.0 (see [VERSION.md](VERSION.md))
**Progress Tracking**: See [CHANGELOG.md](CHANGELOG.md) for detailed updates

---

## Milestone 1: Foundation & Security Setup ✅ COMPLETED

**Priority**: CRITICAL
**Status**: Completed
**Target**: Q4 2024
**Version**: v1.0.0

### Objectives
- Establish core contract architecture
- Implement fundamental security patterns
- Set up development infrastructure

### Deliverables
- [x] Core smart contracts (Router402, FeeCollector402, Treasury402)
- [x] OpenZeppelin security patterns (ReentrancyGuard, Ownable2Step, Pausable)
- [x] Comprehensive test suite
- [x] Development environment (Hardhat, TypeScript)
- [x] CI/CD workflows (testing, linting, coverage)
- [x] Initial documentation

### Security Protocols
- [x] **ReentrancyGuard**: All swap functions protected
- [x] **Ownable2Step**: Safe ownership transfer mechanism
- [x] **Pausable**: Emergency pause functionality
- [x] **SafeERC20**: Token interaction safety
- [x] **Input Validation**: All parameters validated
- [x] **Custom Errors**: Gas-efficient error handling

### Success Criteria
- All tests passing (100% critical paths)
- Gas optimization benchmarks met
- Documentation complete
- Code follows Solidity best practices

---

## Milestone 2: Deterministic Deployment & Key Management 🔄 IN PROGRESS

**Priority**: CRITICAL
**Status**: In Progress
**Target**: Q1 2025
**Version**: v1.1.0

### Objectives
- Implement CREATE2 deterministic deployment
- Establish secure key management protocols
- Set up multisig infrastructure

### Deliverables
- [ ] CREATE2 factory contract for deterministic addresses
- [ ] Deployment scripts using CREATE2
- [ ] Hardware wallet integration for deployments
- [ ] Multisig configuration documentation
- [ ] Key ceremony documentation
- [ ] Emergency key rotation procedures

### Security Protocols

#### CREATE2 Deployment
```solidity
// Deterministic deployment ensures:
// - Predictable contract addresses across chains
// - Verification of deployment integrity
// - Reproducible deployments
```

**Implementation Requirements**:
- [ ] CREATE2 factory contract deployed on all target chains
- [ ] Salt generation with chain-specific entropy
- [ ] Pre-deployment address verification
- [ ] Post-deployment bytecode verification
- [ ] Cross-chain address consistency checks

#### Key Management Hierarchy

**Level 1: Deployment Keys**
- **Purpose**: Initial contract deployment only
- **Storage**: Hardware wallet (Ledger/Trezor)
- **Access**: Single authorized developer
- **Rotation**: After deployment complete
- **Security**: Air-gapped signing, verified on testnet first

**Level 2: Admin/Owner Keys**
- **Purpose**: Contract configuration, pause controls
- **Storage**: 2-of-3 multisig (Gnosis Safe)
- **Signers**: 3 independent key holders
- **Threshold**: 2 signatures required
- **Rotation**: Quarterly or on-demand
- **Security**: Geographic distribution, hardware wallets

**Level 3: Treasury Signers**
- **Purpose**: Fund withdrawals, treasury management
- **Storage**: 3-of-5 multisig (Gnosis Safe)
- **Signers**: 5 trusted parties
- **Threshold**: 3 signatures required
- **Limits**: Daily/monthly withdrawal caps
- **Rotation**: Semi-annually
- **Security**: Hardware wallets, biometric backup

**Level 4: Emergency Response**
- **Purpose**: Emergency pause, critical incident response
- **Storage**: 1-of-3 emergency multisig
- **Access**: Fast response team
- **Authority**: Pause only (cannot withdraw)
- **Activation**: Immediate on security incident

#### Key Ceremony Protocol

**Pre-Ceremony**:
1. Audit all signer identities
2. Prepare hardware wallets
3. Verify secure environment
4. Document all participants

**Ceremony Execution**:
1. Generate keys in air-gapped environment
2. Create multisig contracts on testnet
3. Test signature flows end-to-end
4. Deploy production multisigs
5. Transfer initial control

**Post-Ceremony**:
1. Verify all signatures work
2. Test emergency procedures
3. Document all addresses
4. Secure backup procedures
5. Distribute signer responsibilities

### Deliverables
- [ ] CREATE2 factory contract (audited)
- [ ] Deployment automation scripts
- [ ] Multisig setup documentation
- [ ] Key management runbook
- [ ] Emergency response playbook
- [ ] Signer onboarding guide

### Success Criteria
- Same contract addresses on all chains
- All multisigs tested and verified
- Key ceremony completed with witnesses
- Emergency procedures tested
- Documentation reviewed by security team

---

## Milestone 3: Testnet Deployment & Validation

**Priority**: HIGH
**Status**: Not Started
**Target**: Q1 2025
**Version**: v1.2.0

### Objectives
- Deploy to multiple testnets
- Validate cross-chain functionality
- Stress test security measures

### Deliverables
- [ ] Base Sepolia deployment
- [ ] Ethereum Sepolia deployment
- [ ] Bridge integration testing
- [ ] Load testing results
- [ ] Security incident simulations

### Security Protocols
- [ ] **Deployment Verification**: Bytecode matching across networks
- [ ] **Bridge Testing**: Security validation of all bridge integrations
- [ ] **Pause Testing**: Emergency pause scenarios
- [ ] **Multisig Testing**: Full withdrawal approval flows
- [ ] **Attack Simulations**: Reentrancy, front-running, MEV scenarios

### Test Scenarios
1. Normal swap operations (1000+ transactions)
2. High-volume stress testing
3. Emergency pause activation
4. Multisig withdrawal approvals
5. Bridge failure scenarios
6. Gas limit edge cases
7. Token approval edge cases

### Success Criteria
- 10,000+ successful testnet swaps
- Zero security incidents in testing
- All emergency procedures validated
- Gas costs within acceptable ranges
- Cross-chain consistency verified

---

## Milestone 4: Security Audit & Remediation

**Priority**: CRITICAL
**Status**: Not Started
**Target**: Q1 2025
**Version**: v1.3.0

### Objectives
- Professional security audit
- Remediate all findings
- Establish bug bounty program

### Deliverables
- [ ] Audit partner selected
- [ ] Pre-audit security review
- [ ] Professional audit report
- [ ] Remediation of all critical/high findings
- [ ] Re-audit of changes
- [ ] Public audit report
- [ ] Bug bounty program launch

### Security Audit Scope
- [ ] Smart contract code review
- [ ] Architecture analysis
- [ ] Access control verification
- [ ] Economic model validation
- [ ] Integration testing
- [ ] Gas optimization review
- [ ] Upgrade path analysis

### Audit Partners (Shortlist)
- [ ] Trail of Bits
- [ ] OpenZeppelin
- [ ] Consensys Diligence
- [ ] Certora
- [ ] ChainSecurity

### Bug Bounty Program
- **Platform**: Immunefi or HackerOne
- **Rewards**: Tiered by severity
  - Critical: $50,000 - $100,000
  - High: $10,000 - $50,000
  - Medium: $2,500 - $10,000
  - Low: $500 - $2,500
- **Scope**: All deployed contracts
- **Out of Scope**: Known issues, testnet contracts

### Success Criteria
- [ ] Zero critical findings unresolved
- [ ] All high findings remediated
- [ ] Audit report published
- [ ] Bug bounty program active
- [ ] Community review period completed

---

## Milestone 5: Mainnet Deployment (Phase 1)

**Priority**: HIGH
**Status**: Not Started
**Target**: Q2 2025
**Version**: v2.0.0

### Objectives
- Deploy to Base mainnet
- Establish monitoring infrastructure
- Begin limited operations

### Deliverables
- [ ] Base mainnet deployment (CREATE2)
- [ ] Contract verification on Basescan
- [ ] Monitoring dashboards (Tenderly/Defender)
- [ ] Alert system for critical events
- [ ] Public deployment announcement

### Security Protocols

#### Pre-Deployment Checklist
- [ ] All audit findings resolved
- [ ] Bug bounty program running 30+ days
- [ ] Testnet validation complete
- [ ] Multisig signers confirmed
- [ ] Emergency contacts established
- [ ] Insurance coverage secured (if applicable)

#### Deployment Process
1. **Preparation**
   - Final code freeze
   - Generate CREATE2 salt
   - Pre-compute deployment addresses
   - Verify deployment transactions
   - Prepare monitoring alerts

2. **Execution** (Hardware Wallet Required)
   - Deploy CREATE2 factory
   - Deploy Treasury402 (verify address)
   - Deploy FeeCollector402 (verify address)
   - Deploy Router402 (verify address)
   - Verify all contracts on Basescan
   - Transfer ownership to multisig

3. **Configuration**
   - Add approved bridges (multisig vote)
   - Set fee parameters (multisig vote)
   - Configure volume limits (multisig vote)
   - Test pause mechanism
   - Validate all integrations

4. **Validation**
   - Small test swap ($10)
   - Medium test swap ($100)
   - Verify fee collection
   - Verify treasury receipt
   - Monitor for 24 hours

#### Launch Parameters (Conservative)
- **Max Swap**: $10,000 USDC
- **Daily Limit**: $50,000 per user
- **Fee**: 0.2% (20 bps)
- **Approved Bridges**: Socket Router only
- **Emergency Multisig**: Active 24/7

### Success Criteria
- Contracts deployed and verified
- 100+ successful mainnet swaps
- Zero security incidents
- Monitoring operational
- Community confidence established

---

## Milestone 6: Ethereum Mainnet Expansion

**Priority**: MEDIUM
**Status**: Not Started
**Target**: Q2 2025
**Version**: v2.1.0

### Objectives
- Deploy to Ethereum mainnet
- Enable ETH ↔ Base routing
- Scale operations

### Deliverables
- [ ] Ethereum mainnet deployment
- [ ] Cross-chain routing operational
- [ ] Increased volume limits
- [ ] Additional bridge integrations

### Security Protocols
- [ ] Same CREATE2 addresses as Base
- [ ] Independent multisig per chain
- [ ] Cross-chain monitoring
- [ ] Bridge security validation

### Launch Parameters (Expanded)
- **Max Swap**: $100,000 USDC
- **Daily Limit**: $500,000 per user
- **Approved Bridges**: Socket, LayerZero (if audited)

### Success Criteria
- Consistent addresses across chains
- Successful cross-chain swaps
- No security incidents
- Gas costs optimized for ETH mainnet

---

## Milestone 7: Advanced Features & Integrations

**Priority**: MEDIUM
**Status**: Not Started
**Target**: Q3 2025
**Version**: v3.0.0

### Objectives
- LayerZero direct integration
- Additional chain support
- Advanced routing algorithms

### Deliverables
- [ ] LayerZero OFT integration
- [ ] TON bridge support
- [ ] Arbitrum deployment
- [ ] Optimism deployment
- [ ] Route optimization algorithms
- [ ] MEV protection mechanisms

### Security Protocols
- [ ] Independent audits for new integrations
- [ ] Gradual rollout with limits
- [ ] Enhanced monitoring per chain
- [ ] Chain-specific multisigs

### Success Criteria
- Support for 5+ chains
- Multiple bridge options per route
- MEV protection validated
- User costs reduced by 15%+

---

## Milestone 8: Decentralization & Governance

**Priority**: MEDIUM
**Status**: Not Started
**Target**: Q4 2025
**Version**: v4.0.0

### Objectives
- Launch governance token
- Transition to DAO control
- Progressive decentralization

### Deliverables
- [ ] Governance token contract
- [ ] DAO framework (Governor Bravo style)
- [ ] Timelock controller
- [ ] Token distribution plan
- [ ] Governance documentation
- [ ] DAO transition plan

### Security Protocols

#### Governance Structure
- **Timelock**: 48-hour delay on critical actions
- **Proposal Threshold**: 1% of token supply
- **Quorum**: 10% of token supply
- **Voting Period**: 7 days
- **Emergency Override**: Security Council (9-of-13 multisig)

#### Token Security
- [ ] Non-upgradeable token contract
- [ ] Vesting contracts for team/investors
- [ ] Anti-whale mechanisms
- [ ] Audit of governance contracts

#### Progressive Decentralization
1. **Phase 1**: DAO controls fee parameters
2. **Phase 2**: DAO controls bridge approvals
3. **Phase 3**: DAO controls treasury
4. **Phase 4**: DAO controls emergency pause (with Security Council override)
5. **Phase 5**: Full DAO control, founder multisig deprecated

### Success Criteria
- Governance contracts audited
- Fair token distribution
- Active community participation
- Successful governance votes
- Decentralization metrics improving

---

## Milestone 9: Monad & Next-Gen Chains

**Priority**: LOW
**Status**: Not Started
**Target**: Q1 2026
**Version**: v5.0.0

### Objectives
- Deploy to Monad mainnet
- Support emerging L1/L2 chains
- Advanced features

### Deliverables
- [ ] Monad deployment
- [ ] Solana integration (if viable)
- [ ] Next-gen bridge protocols
- [ ] Advanced MEV protection

### Security Protocols
- New chain evaluation framework
- Per-chain security assessment
- Independent audits for new networks

---

## Milestone 10: Institutional Features

**Priority**: LOW
**Status**: Not Started
**Target**: Q2 2026
**Version**: v6.0.0

### Objectives
- Institutional-grade features
- Compliance integrations
- Enterprise partnerships

### Deliverables
- [ ] KYC/AML integration options
- [ ] Whitelisting capabilities
- [ ] Compliance reporting tools
- [ ] API for institutional users
- [ ] SLA guarantees

### Security Protocols
- Privacy-preserving compliance
- Institutional-grade multisigs
- Insurance integrations
- Formal verification of critical paths

---

## Security Principles (All Milestones)

### 1. Defense in Depth
- Multiple security layers at every level
- No single point of failure
- Redundant safety mechanisms

### 2. Principle of Least Privilege
- Minimal permissions for each role
- Time-limited elevated access
- Audit logs for all admin actions

### 3. Secure by Default
- Conservative default settings
- Opt-in for risky features
- Automatic safety limits

### 4. Transparency
- Open source code
- Public audit reports
- On-chain governance
- Real-time monitoring dashboards

### 5. Continuous Improvement
- Regular security reviews
- Bug bounty program
- Community security research
- Post-incident reviews

---

## Key Management Summary

| Role | Type | Threshold | Purpose | Rotation |
|------|------|-----------|---------|----------|
| Deployer | Hardware Wallet | 1-of-1 | Initial deployment | Post-deployment |
| Admin | Gnosis Safe | 2-of-3 | Configuration | Quarterly |
| Treasury | Gnosis Safe | 3-of-5 | Fund management | Semi-annually |
| Emergency | Gnosis Safe | 1-of-3 | Emergency pause | As needed |
| DAO (future) | Governor | 10% quorum | Governance | N/A |

---

## Risk Management

### Critical Risks
1. **Smart Contract Vulnerabilities**: Mitigated by audits, testing, formal verification
2. **Bridge Exploits**: Mitigated by multi-bridge support, monitoring, limits
3. **Key Compromise**: Mitigated by multisigs, hardware wallets, rotation
4. **Oracle Manipulation**: N/A (oracle-free design)
5. **Governance Attacks**: Mitigated by timelocks, security council

### Monitoring & Response
- 24/7 automated monitoring (Tenderly, Defender)
- Alert escalation procedures
- Incident response team
- Emergency pause authority
- Post-incident review process

---

## Dependencies & Blockers

| Milestone | Dependencies | Potential Blockers |
|-----------|--------------|-------------------|
| M2 | Hardware wallets, multisig signers | Signer availability |
| M3 | Testnet tokens, bridge testnets | Bridge API access |
| M4 | Audit firm availability | Scheduling delays |
| M5 | Audit completion, insurance | Market conditions |
| M6 | M5 success | Gas prices, competition |
| M7 | Bridge partnerships | Integration complexity |
| M8 | Legal review | Regulatory clarity |
| M9 | Monad mainnet launch | Chain delays |
| M10 | Legal/compliance partners | Regulatory changes |

---

## Version Milestones

| Version | Milestone | Target | Status |
|---------|-----------|--------|--------|
| v1.0.0 | Foundation | Q4 2024 | ✅ Complete |
| v1.1.0 | CREATE2 & Key Mgmt | Q1 2025 | 🔄 In Progress |
| v1.2.0 | Testnet | Q1 2025 | ⏳ Pending |
| v1.3.0 | Audit | Q1 2025 | ⏳ Pending |
| v2.0.0 | Base Mainnet | Q2 2025 | ⏳ Pending |
| v2.1.0 | ETH Mainnet | Q2 2025 | ⏳ Pending |
| v3.0.0 | Multi-chain | Q3 2025 | ⏳ Pending |
| v4.0.0 | Governance | Q4 2025 | ⏳ Pending |
| v5.0.0 | Next-gen Chains | Q1 2026 | ⏳ Pending |
| v6.0.0 | Institutional | Q2 2026 | ⏳ Pending |

---

## Contributing to the Roadmap

This roadmap is a living document. For suggestions or updates:
1. Open an issue on GitHub
2. Discuss in community channels
3. Submit a PR with detailed rationale

**Last Updated**: 2025-01-01
**Next Review**: 2025-04-01

See [VERSION.md](VERSION.md) for current version details and [CHANGELOG.md](CHANGELOG.md) for detailed progress updates.
