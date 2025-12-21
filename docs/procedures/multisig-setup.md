# Multisig Setup Guide

**Version**: 1.0.0
**Last Updated**: December 21, 2025
**Milestone**: M2 - Deterministic Deployment & Key Management
**Status**: Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Multisig Hierarchy](#multisig-hierarchy)
3. [Prerequisites](#prerequisites)
4. [Gnosis Safe Setup](#gnosis-safe-setup)
5. [Level 2: Admin Multisig (2-of-3)](#level-2-admin-multisig-2-of-3)
6. [Level 3: Treasury Multisig (3-of-5)](#level-3-treasury-multisig-3-of-5)
7. [Level 4: Emergency Multisig (1-of-3)](#level-4-emergency-multisig-1-of-3)
8. [Testing Procedures](#testing-procedures)
9. [Ownership Transfer](#ownership-transfer)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This guide provides step-by-step instructions for setting up the multi-signature (multisig) infrastructure for the 402.vln.gg stablecoin aggregator protocol.

### Purpose

Multisig wallets provide:
- **Security**: No single person can control funds or critical functions
- **Decentralization**: Distributed control across multiple trusted parties
- **Accountability**: All actions require multiple approvals
- **Safety**: Protection against key compromise or loss

### Architecture

The protocol uses a **three-tier multisig hierarchy**:

```
Level 2: Admin Multisig (2-of-3)
├── Purpose: Configuration, pause controls
├── Threshold: 2 signatures required
└── Rotation: Quarterly

Level 3: Treasury Multisig (3-of-5)
├── Purpose: Fund withdrawals, treasury management
├── Threshold: 3 signatures required
└── Rotation: Semi-annually

Level 4: Emergency Multisig (1-of-3)
├── Purpose: Emergency pause only
├── Threshold: 1 signature required
└── Authority: Cannot withdraw funds
```

---

## Multisig Hierarchy

### Level 1: Deployment Keys (Not a Multisig)

**Purpose**: Initial contract deployment only
**Type**: Single hardware wallet
**Usage**: One-time use for deployment
**Rotation**: Immediately after deployment

See: [CREATE2 Deployment Guide](../CREATE2_DEPLOYMENT.md)

### Level 2: Admin Multisig (2-of-3)

**Purpose**: Contract configuration and administration
**Powers**:
- Set fee parameters
- Add/remove supported tokens
- Approve/revoke bridges
- Pause/unpause protocol
- Update treasury address
- Set daily volume limits

**Cannot**:
- Withdraw funds directly
- Upgrade contracts (contracts are non-upgradeable)

**Threshold**: 2 out of 3 signatures required
**Rotation Schedule**: Quarterly
**Response Time**: 24-48 hours for routine operations

### Level 3: Treasury Multisig (3-of-5)

**Purpose**: Treasury fund management
**Powers**:
- Withdraw collected fees
- Manage treasury allocations
- Execute treasury operations

**Cannot**:
- Modify protocol configuration
- Pause protocol (except via Level 4)

**Threshold**: 3 out of 5 signatures required
**Daily Withdrawal Limit**: $100,000 USDC
**Monthly Withdrawal Limit**: $1,000,000 USDC
**Rotation Schedule**: Semi-annually
**Response Time**: 48-72 hours for withdrawals

### Level 4: Emergency Response Multisig (1-of-3)

**Purpose**: Emergency pause activation
**Powers**:
- Emergency pause protocol immediately
- Fast response to security incidents

**Cannot**:
- Withdraw funds
- Modify configuration
- Unpause (requires Level 2)

**Threshold**: 1 out of 3 signatures required
**Rotation Schedule**: As needed
**Response Time**: <1 hour for emergencies

---

## Prerequisites

### For All Multisig Setups

1. **Hardware Wallets** (one per signer)
   - Ledger Nano S/X or Trezor Model T
   - Firmware updated to latest version
   - Successfully tested on testnet

2. **Signer Identification**
   - See [Signer Onboarding Guide](./signer-onboarding.md)
   - All signers vetted and committed
   - Contact information confirmed

3. **Network Setup**
   - RPC endpoints for all target chains
   - Block explorer access (Etherscan, Basescan)
   - Gnosis Safe interface access

4. **Documentation**
   - This guide
   - [Key Management Runbook](./key-management-runbook.md)
   - [Emergency Response Playbook](./emergency-response-playbook.md)

---

## Gnosis Safe Setup

We use **Gnosis Safe** as the multisig solution due to:
- Battle-tested security (billions in TVL)
- Wide adoption and tooling support
- Comprehensive UI and API
- Support for all target chains
- Formal verification of core contracts

### Supported Chains

- **Ethereum Mainnet**: https://app.safe.global
- **Base Mainnet**: https://app.safe.global
- **Ethereum Sepolia**: https://app.safe.global (testnet)
- **Base Sepolia**: https://app.safe.global (testnet)

### Alternative Interfaces

- **Gnosis Safe CLI**: For programmatic operations
- **Foundry Safe Tools**: For developer workflows
- **Zodiac Roles Modifier**: For advanced permission management (future)

---

## Level 2: Admin Multisig (2-of-3)

### Step 1: Prepare Signer Information

Collect from each of the 3 admin signers:

- [ ] Name and role
- [ ] Ethereum address (from hardware wallet)
- [ ] Contact information (encrypted channel)
- [ ] Timezone and availability
- [ ] Backup contact method

**Example Signer Roster**:

| Signer | Role | Address | Timezone | Availability |
|--------|------|---------|----------|--------------|
| Alice | Lead Developer | 0xABC...123 | UTC-5 | 9am-5pm EST |
| Bob | Security Lead | 0xDEF...456 | UTC+0 | 9am-5pm GMT |
| Carol | Operations | 0xGHI...789 | UTC-8 | 9am-5pm PST |

### Step 2: Deploy Gnosis Safe (Testnet First)

1. **Navigate to Gnosis Safe**
   - Go to https://app.safe.global
   - Connect with deployer wallet (temporary)
   - Select network: **Base Sepolia** (testnet first)

2. **Create New Safe**
   - Click "Create New Safe"
   - Name: "402.vln.gg Admin Multisig - Base Sepolia"
   - Select "Multi-signature wallet"

3. **Add Signer Addresses**
   - Add all 3 signer addresses
   - Double-check each address (use ENS if available)
   - Verify with each signer via secure channel

4. **Set Threshold**
   - Threshold: **2 out of 3**
   - This means any 2 signers can execute transactions

5. **Review and Deploy**
   - Review all settings
   - Deploy Safe contract
   - **Save the Safe address** (critical!)
   - Verify deployment on block explorer

6. **Verify Safe Creation**
   - Confirm Safe appears in dashboard
   - Check signer list is correct
   - Verify threshold is 2
   - Test that each signer can access the Safe

### Step 3: Test Signature Flows

**Critical**: Test before using on mainnet!

1. **Test Transaction Proposal**
   - Signer 1: Propose a test transaction (send 0.001 ETH to deployer)
   - Verify transaction appears in queue
   - Check all signers can see pending transaction

2. **Test First Signature**
   - Signer 2: Sign the pending transaction
   - Verify signature count updates (1/2)
   - Transaction should not execute yet

3. **Test Second Signature & Execution**
   - Signer 3: Sign the pending transaction
   - Verify signature count updates (2/2)
   - Transaction should auto-execute
   - Verify execution on block explorer

4. **Test Rejection**
   - Signer 1: Propose another test transaction
   - Signer 2 or 3: Reject the transaction
   - Verify transaction is removed from queue

### Step 4: Deploy to All Chains

Repeat Steps 2-3 for each network:

- [ ] **Base Sepolia** (testnet) ✅ (completed above)
- [ ] **Ethereum Sepolia** (testnet)
- [ ] **Base Mainnet** (production)
- [ ] **Ethereum Mainnet** (production)

**Important**: Save all Safe addresses in a secure location.

### Step 5: Optional - Use CREATE2 for Deterministic Addresses

For the same Safe address on all chains:

1. Deploy Gnosis Safe Factory to same address on all chains
2. Use identical signer list and threshold
3. Use deterministic nonce/salt
4. Verify addresses match across chains

See: [Gnosis Safe CREATE2 Deployment](https://github.com/safe-global/safe-contracts)

### Step 6: Document Safe Addresses

Create a table of all Safe addresses:

| Network | Chain ID | Safe Address | Block Explorer |
|---------|----------|--------------|----------------|
| Base Sepolia | 84532 | 0x... | [View](https://sepolia.basescan.org/address/0x...) |
| Ethereum Sepolia | 11155111 | 0x... | [View](https://sepolia.etherscan.io/address/0x...) |
| Base Mainnet | 8453 | 0x... | [View](https://basescan.org/address/0x...) |
| Ethereum Mainnet | 1 | 0x... | [View](https://etherscan.io/address/0x...) |

---

## Level 3: Treasury Multisig (3-of-5)

### Step 1: Prepare Signer Information

Collect from each of the 5 treasury signers (similar to Level 2):

**Example Signer Roster**:

| Signer | Role | Address | Timezone | Availability |
|--------|------|---------|----------|--------------|
| David | CFO | 0xJKL...111 | UTC-5 | 9am-5pm EST |
| Eve | Finance Lead | 0xMNO...222 | UTC+0 | 9am-5pm GMT |
| Frank | Treasury Manager | 0xPQR...333 | UTC+1 | 9am-5pm CET |
| Grace | Compliance | 0xSTU...444 | UTC-8 | 9am-5pm PST |
| Henry | Board Member | 0xVWX...555 | UTC+8 | 9am-5pm SGT |

### Step 2: Deploy Treasury Safe

Follow same process as Level 2, but with:
- **Signers**: 5 addresses
- **Threshold**: 3 out of 5
- **Name**: "402.vln.gg Treasury Multisig - [Network]"

### Step 3: Configure Spending Limits (Optional)

Gnosis Safe supports spending limits via modules:

1. Install "Spending Limit Module"
2. Set daily limit: $100,000 USDC
3. Set monthly limit: $1,000,000 USDC
4. Require full multisig for amounts exceeding limits

### Step 4: Test Treasury Operations

1. **Test Small Withdrawal** ($100)
   - Propose withdrawal transaction
   - Collect 3 signatures
   - Execute and verify

2. **Test Large Withdrawal** ($50,000)
   - Propose larger withdrawal
   - Collect 3 signatures
   - Verify compliance checks
   - Execute and verify

3. **Test Rejection**
   - Propose transaction
   - Have signers reject
   - Verify cancellation

### Step 5: Deploy Across All Chains

Same as Level 2, deploy to all networks.

---

## Level 4: Emergency Multisig (1-of-3)

### Step 1: Select Emergency Responders

Choose 3 individuals who:
- Have 24/7 availability
- Understand protocol security
- Can act quickly in emergencies
- Are geographically distributed

**Example Emergency Roster**:

| Responder | Role | Timezone | Response Time |
|-----------|------|----------|---------------|
| Alice | Lead Dev | UTC-5 | <15 min |
| Bob | Security | UTC+0 | <15 min |
| Ivan | DevOps | UTC+8 | <15 min |

### Step 2: Deploy Emergency Safe

Same process, but with:
- **Signers**: 3 addresses
- **Threshold**: 1 out of 3 (any single signer can act)
- **Name**: "402.vln.gg Emergency Multisig - [Network]"

**Warning**: This is a powerful capability. Only trusted individuals should be signers.

### Step 3: Limit Emergency Powers

The Emergency Safe should **only** have permission to:
- Call `pause()` on Router402 contract
- Nothing else

**Configuration**:
1. After ownership transfer, verify Emergency Safe permissions
2. Test emergency pause on testnet
3. Verify Emergency Safe **cannot** withdraw funds
4. Verify Emergency Safe **cannot** modify configuration

### Step 4: Test Emergency Procedures

1. **Test Emergency Pause**
   - Responder 1: Execute `pause()` immediately
   - Verify protocol pauses
   - Test that swaps fail
   - Test that configuration changes fail

2. **Test Unpause** (requires Level 2)
   - Attempt unpause from Emergency Safe (should fail)
   - Use Admin Safe (Level 2) to unpause
   - Verify protocol resumes

---

## Testing Procedures

### Testnet Testing Checklist

Before mainnet deployment:

#### Admin Multisig (Level 2)
- [ ] All signers can access Safe
- [ ] Can propose configuration changes
- [ ] 2 signatures required for execution
- [ ] Can add supported token
- [ ] Can approve bridge
- [ ] Can pause protocol
- [ ] Can unpause protocol
- [ ] Can update fee parameters
- [ ] **Cannot** withdraw treasury funds

#### Treasury Multisig (Level 3)
- [ ] All signers can access Safe
- [ ] Can propose withdrawals
- [ ] 3 signatures required for execution
- [ ] Can withdraw test USDC
- [ ] Spending limits work (if configured)
- [ ] **Cannot** modify protocol configuration
- [ ] **Cannot** pause protocol directly

#### Emergency Multisig (Level 4)
- [ ] All responders can access Safe
- [ ] Can execute pause with 1 signature
- [ ] Pause takes effect immediately
- [ ] **Cannot** unpause (requires Level 2)
- [ ] **Cannot** withdraw funds
- [ ] **Cannot** modify configuration

### Integration Testing

Test the full multisig ecosystem:

1. **Deployment → Ownership Transfer**
   - Deploy contracts with deployer key
   - Transfer admin ownership to Level 2 Safe
   - Transfer treasury ownership to Level 3 Safe
   - Grant pause permission to Level 4 Safe
   - Verify deployer no longer has permissions

2. **Configuration Change Flow**
   - Admin Safe: Propose adding new token
   - Collect 2 signatures
   - Execute transaction
   - Verify token is supported

3. **Treasury Withdrawal Flow**
   - Collect fees (simulate swaps)
   - Treasury Safe: Propose withdrawal
   - Collect 3 signatures
   - Execute withdrawal
   - Verify funds received

4. **Emergency Response Flow**
   - Simulate security incident
   - Emergency Safe: Execute pause
   - Verify protocol is paused
   - Admin Safe: Investigate issue
   - Admin Safe: Unpause after resolution
   - Verify protocol resumes

---

## Ownership Transfer

### Pre-Transfer Checklist

- [ ] All multisigs deployed and tested
- [ ] All signers have hardware wallets
- [ ] All signers have access to Safes
- [ ] Signature flows tested on testnet
- [ ] Emergency procedures tested
- [ ] Documentation reviewed by all parties
- [ ] Backup communication channels established

### Transfer Process

#### 1. Transfer Router402 Ownership to Admin Safe

```solidity
// From deployer wallet
Router402.transferOwnership(adminSafeAddress);

// From Admin Safe (after deployer initiates)
Router402.acceptOwnership();
```

**Verification**:
```solidity
Router402.owner() == adminSafeAddress // should be true
Router402.pendingOwner() == address(0) // should be true
```

#### 2. Verify Admin Safe Permissions

From Admin Safe, test:
```solidity
Router402.setSupportedToken(testToken, true); // should succeed
Router402.pause(); // should succeed
Router402.unpause(); // should succeed
```

#### 3. Grant Emergency Pause Permission

From Admin Safe:
```solidity
// Note: Implementation depends on your pause mechanism
// Option 1: If using AccessControl
Router402.grantRole(PAUSER_ROLE, emergencySafeAddress);

// Option 2: If using dedicated setter
Router402.setEmergencyPauser(emergencySafeAddress);
```

#### 4. Treasury Integration

The Treasury402 contract is already a multisig (2/3), but you may want to:

1. Deploy Gnosis Safe for treasury management
2. Set Router402 treasury address to Gnosis Safe
3. Fees will flow to Gnosis Safe
4. Use 3-of-5 Safe to manage withdrawals

### Post-Transfer Verification

- [ ] Deployer has no remaining permissions
- [ ] Admin Safe can configure protocol
- [ ] Treasury Safe can withdraw fees
- [ ] Emergency Safe can pause
- [ ] Test all critical functions
- [ ] Document all Safe addresses publicly

---

## Troubleshooting

### Issue: Transaction stuck in pending

**Symptoms**: Transaction proposed but not executing

**Causes & Solutions**:
1. **Insufficient signatures**: Check signature count vs threshold
   - Solution: Get remaining signers to sign
2. **Wrong network**: Signer connected to different network
   - Solution: Switch to correct network in wallet
3. **Nonce conflict**: Another transaction with same nonce
   - Solution: Cancel conflicting transaction or wait
4. **Gas price too low**: Transaction not mining
   - Solution: Speed up transaction or cancel and repropose

### Issue: Signer cannot access Safe

**Symptoms**: Signer's address not showing as owner

**Causes & Solutions**:
1. **Wrong address**: Signer using different address than registered
   - Solution: Verify address matches Safe configuration
2. **Wrong network**: Connected to different network
   - Solution: Switch to network where Safe is deployed
3. **Not yet deployed**: Safe deployment pending
   - Solution: Wait for deployment confirmation
4. **Cache issue**: UI not updated
   - Solution: Clear cache, refresh, or use block explorer

### Issue: Cannot execute transaction even with threshold met

**Symptoms**: Enough signatures but execution fails

**Causes & Solutions**:
1. **Insufficient gas**: Transaction reverts due to gas limit
   - Solution: Increase gas limit
2. **Contract reverts**: Target contract rejects call
   - Solution: Check contract state, permissions, parameters
3. **Safe has insufficient funds**: Cannot pay gas
   - Solution: Send ETH to Safe for gas
4. **Transaction outdated**: On-chain state changed
   - Solution: Cancel and create new transaction

### Issue: Lost access to signer wallet

**Symptoms**: One signer cannot access their wallet

**Solutions**:
1. **For Level 2 (2-of-3)**: Can still operate with 2 remaining signers
   - Immediate: Continue operations with remaining signers
   - Short-term: Rotate out lost signer, add new one (requires threshold)
2. **For Level 3 (3-of-5)**: Can still operate with 3 out of 4 remaining
   - Immediate: Continue operations
   - Short-term: Rotate out lost signer
3. **For Level 4 (1-of-3)**: Can still operate with 2 remaining
   - Immediate: Emergency procedures still work
   - Short-term: Add replacement responder

**Prevention**:
- Maintain backup seed phrases (secured separately)
- Test wallet recovery procedures
- Document signer rotation procedures

### Issue: Multisig addresses differ across chains

**Symptoms**: Same configuration but different addresses

**Causes**:
- Safe deployed with different factory addresses
- Different nonce/salt used
- Different deployment order

**Solutions**:
- Document actual addresses for each chain
- Update integration documentation
- For future: Use CREATE2 deployment for Safes

---

## Security Best Practices

### Signer Security

1. **Hardware Wallets Only**
   - Never use hot wallets for multisig signers
   - Store hardware wallets securely when not in use
   - Use PIN protection

2. **Seed Phrase Security**
   - Store offline in secure location
   - Use metal backup (fire/water resistant)
   - Never digital storage of seed phrases
   - Consider multisig for seed phrase backup (Shamir's Secret Sharing)

3. **Operational Security**
   - Verify all transaction details before signing
   - Use address book feature in Gnosis Safe
   - Double-check recipient addresses
   - Verify transaction amounts
   - Check contract interaction details

### Communication Security

1. **Secure Channels**
   - Use encrypted messaging (Signal, Keybase)
   - Never share sensitive info via email/SMS
   - Verify signer identities before adding

2. **Transaction Verification**
   - Independent verification of transaction details
   - Out-of-band confirmation for large transactions
   - Document approval process

### Monitoring

1. **Safe Activity Monitoring**
   - Set up notifications for Safe activity
   - Monitor pending transactions
   - Regular security audits

2. **Automated Alerts**
   - Alert on new transaction proposals
   - Alert on signature collection progress
   - Alert on execution

---

## Appendix

### A. Gnosis Safe Resources

- [Official Documentation](https://docs.safe.global/)
- [Safe Contracts Repository](https://github.com/safe-global/safe-contracts)
- [Safe SDK](https://github.com/safe-global/safe-core-sdk)
- [Safe CLI](https://github.com/safe-global/safe-cli)

### B. Signer Roster Template

```csv
Level,Signer Name,Role,Address,Timezone,Email,Phone,Backup Contact
2,Alice,Lead Dev,0x...,UTC-5,alice@...,+1-555-...,Signal: @alice
2,Bob,Security,0x...,UTC+0,bob@...,+44-555-...,Keybase: bob
...
```

### C. Safe Address Registry

```json
{
  "version": "1.0.0",
  "updated": "2024-12-21",
  "multisigs": {
    "level2_admin": {
      "base_sepolia": "0x...",
      "ethereum_sepolia": "0x...",
      "base_mainnet": "0x...",
      "ethereum_mainnet": "0x..."
    },
    "level3_treasury": {
      "base_sepolia": "0x...",
      "ethereum_sepolia": "0x...",
      "base_mainnet": "0x...",
      "ethereum_mainnet": "0x..."
    },
    "level4_emergency": {
      "base_sepolia": "0x...",
      "ethereum_sepolia": "0x...",
      "base_mainnet": "0x...",
      "ethereum_mainnet": "0x..."
    }
  }
}
```

### D. Related Documentation

- [Key Ceremony Protocol](./key-ceremony.md)
- [Emergency Response Playbook](./emergency-response-playbook.md)
- [Key Management Runbook](./key-management-runbook.md)
- [Signer Onboarding Guide](./signer-onboarding.md)

---

**Document Version**: 1.0.0
**Last Updated**: December 21, 2025
**Next Review**: March 21, 2026
**Owner**: Security Team
