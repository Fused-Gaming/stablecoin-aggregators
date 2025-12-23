# Co-Signer Guide

**Version**: 1.0.0
**Last Updated**: December 21, 2024
**Track**: M2 Track 3 & Track 4 - Hardware Wallet Integration & Multisig Setup

---

## Overview

This guide is for co-signers participating in the 402.vln.gg multisig infrastructure. Whether you're an admin signer, treasury signer, or emergency responder, this document explains your role, responsibilities, and options.

**KEY FEATURE**: Hardware wallet support is **OPTIONAL**. Co-signers can participate with:
- ✅ Software wallets (private keys) - Available immediately
- ✅ Hardware wallets (Ledger/Trezor) - Enhanced security
- ✅ Mixed approach - Start with software, upgrade to hardware later

---

## Table of Contents

1. [Multisig Hierarchy](#multisig-hierarchy)
2. [Environment Strategy](#environment-strategy)
3. [Co-Signer Options](#co-signer-options)
4. [Getting Started](#getting-started)
5. [Testnet Practice](#testnet-practice)
6. [Production Operations](#production-operations)
7. [Responsibilities](#responsibilities)
8. [Migration Path](#migration-path)

---

## Multisig Hierarchy

### Level 2: Admin Signers (2-of-3)

**Purpose**: Contract configuration, pause controls

**Signers**: 3 independent key holders
**Threshold**: 2 signatures required
**Permissions**:
- Pause/unpause contracts
- Add/remove supported tokens
- Approve/revoke bridges
- Update fee parameters
- Emergency response

**Rotation**: Quarterly or on-demand

### Level 3: Treasury Signers (3-of-5)

**Purpose**: Fund withdrawals, treasury management

**Signers**: 5 trusted parties
**Threshold**: 3 signatures required
**Permissions**:
- Withdraw collected fees
- Manage treasury funds
- Approve large transactions

**Limits**: Daily/monthly withdrawal caps
**Rotation**: Semi-annually

### Level 4: Emergency Response (1-of-3)

**Purpose**: Emergency pause, critical incident response

**Signers**: 3 fast-response team members
**Threshold**: 1 signature required
**Authority**: Pause only (cannot withdraw funds)
**Activation**: Immediate on security incident

---

## Environment Strategy

### Two-Stage Deployment

We use a **testnet-first** approach to ensure all co-signers are comfortable before production deployment.

#### Stage 1: Testnet Environment (Base Sepolia)

**Purpose**: Training, testing, practice

**Timeline**: 2-4 weeks before mainnet

**Activities**:
- Deploy full infrastructure
- Practice signature flows
- Test emergency procedures
- Validate all integrations
- Build muscle memory for hardware wallets

**Benefits**:
- Risk-free learning
- Free testnet ETH
- Catch configuration issues
- Build confidence

#### Stage 2: Production Environment (Base Mainnet)

**Purpose**: Live operations

**Timeline**: After successful testnet validation

**Prerequisites**:
- [ ] All testnet testing complete
- [ ] All signers trained
- [ ] Hardware wallets distributed (if using)
- [ ] Emergency procedures tested
- [ ] Documentation reviewed

**Go-Live Checklist**:
- [ ] 10+ successful testnet multisig transactions
- [ ] All signers completed practice runs
- [ ] Emergency pause tested on testnet
- [ ] 100% signer availability confirmed
- [ ] Backup procedures documented

---

## Co-Signer Options

### Option 1: Software Wallet (Private Key)

**Best For**:
- Quick onboarding
- Testnet testing
- Co-signers without hardware wallets
- Temporary participation

**Setup Time**: 5 minutes

**Security**: Medium
- Private key stored on computer
- Vulnerable to malware
- Suitable for testnet and limited mainnet use

**Cost**: Free

**Steps**:
```bash
# 1. Generate new wallet (or use existing)
# Using MetaMask, MyEtherWallet, or:
npx hardhat console
> const wallet = ethers.Wallet.createRandom()
> console.log("Address:", wallet.address)
> console.log("Private Key:", wallet.privateKey)
> console.log("Mnemonic:", wallet.mnemonic.phrase)

# 2. Save private key securely
# NEVER share or commit to git

# 3. Configure .env
USE_HARDWARE_WALLET=false
PRIVATE_KEY=your_private_key_here

# 4. You're ready to sign!
```

### Option 2: Hardware Wallet (Ledger/Trezor)

**Best For**:
- Production operations
- High-value transactions
- Long-term co-signers
- Enhanced security requirements

**Setup Time**: 30-60 minutes (first time)

**Security**: High
- Private keys never leave device
- Protected against malware
- Industry standard for crypto custody

**Cost**: $79-$219 (one-time)

**Steps**:
See [hardware-wallet-setup.md](./hardware-wallet-setup.md) for detailed guide.

### Option 3: Hybrid Approach (Recommended)

**Strategy**: Start with software wallet, migrate to hardware wallet

**Timeline**:
- **Week 1-2**: Software wallet for testnet testing
- **Week 3**: Receive and set up hardware wallet
- **Week 4**: Practice with hardware wallet on testnet
- **Week 5+**: Production operations with hardware wallet

**Benefits**:
- Immediate participation
- Time to procure hardware wallet
- Gradual learning curve
- Smooth transition

---

## Getting Started

### For New Co-Signers

#### Step 1: Choose Your Wallet Type

**Testnet Phase** (Recommended):
- Start with **software wallet** for quick testing
- Order hardware wallet in parallel
- Transition before production

**Production Only**:
- Go directly to **hardware wallet** if comfortable
- More setup time but better security

#### Step 2: Initial Setup

**Software Wallet**:
```bash
# 1. Create wallet (save private key!)
# 2. Get testnet ETH
https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

# 3. Configure environment
USE_HARDWARE_WALLET=false
PRIVATE_KEY=your_private_key_here

# 4. Test signing
npm run deploy:base-sepolia
```

**Hardware Wallet**:
```bash
# 1. Set up device (see hardware-wallet-setup.md)
# 2. Get device address
# 3. Fund with testnet ETH
# 4. Configure environment
USE_HARDWARE_WALLET=true
HARDWARE_WALLET_TYPE=ledger  # or trezor
LEDGER_ADDRESS=0xYourAddress

# 5. Test signing
npm run deploy:hw:base-sepolia
```

#### Step 3: Join Multisig

Provide your address to the multisig coordinator:
```
Name: [Your Name]
Role: Level X Signer ([Admin/Treasury/Emergency])
Address: 0x[Your Wallet Address]
Wallet Type: [Software/Ledger/Trezor]
Testnet Verified: [Yes/No]
Hardware Wallet ETA: [Date if applicable]
```

---

## Testnet Practice

### Why Testnet Matters

**Critical for co-signers**:
- Learn signature flows risk-free
- Practice emergency procedures
- Build hardware wallet familiarity
- Identify issues before production
- No financial risk

### Testnet Checklist for Co-Signers

Week 1-2: **Basic Operations**
- [ ] Set up wallet (software or hardware)
- [ ] Get testnet ETH
- [ ] Join testnet multisig
- [ ] Execute first test transaction
- [ ] Verify transaction on Basescan Sepolia

Week 3: **Advanced Operations**
- [ ] Participate in 10+ multisig transactions
- [ ] Practice signature rejection (voting no)
- [ ] Test wallet recovery (if software)
- [ ] Test hardware wallet on different computer (if hardware)
- [ ] Practice emergency pause procedure

Week 4: **Readiness Verification**
- [ ] Complete signature flow in under 5 minutes
- [ ] Successfully use hardware wallet (if applicable)
- [ ] Know emergency contacts
- [ ] Understand all procedures
- [ ] Confirm production readiness

### Testnet Scenarios to Practice

1. **Normal Multisig Transaction**
   - Treasury withdrawal (small amount)
   - Confirm transaction on device
   - Verify on block explorer

2. **Emergency Pause**
   - Simulate security incident
   - Execute pause transaction
   - Verify contract is paused

3. **Configuration Change**
   - Add new supported token
   - 2-of-3 approval process
   - Verify configuration updated

4. **Transaction Rejection**
   - Review proposed transaction
   - Reject if inappropriate
   - Document rejection reason

---

## Production Operations

### Before Production Launch

**All co-signers must**:
- ✅ Complete testnet practice (4 weeks)
- ✅ Execute 10+ successful testnet signatures
- ✅ Understand emergency procedures
- ✅ Have backup communication channels
- ✅ Confirm 24/7 availability (for emergency signers)
- ✅ Migrate to hardware wallet (recommended, not required)

### Production Signature Flow

#### Gnosis Safe Workflow

1. **Transaction Proposed**
   - Receive notification (email/Telegram/Discord)
   - Review transaction details in Gnosis Safe UI
   - Verify:
     - Correct contract address
     - Appropriate action
     - Reasonable parameters
     - Authorized proposer

2. **Due Diligence**
   - Check transaction against documented procedures
   - Confirm with other signers if uncertain
   - Verify on-chain state if needed
   - Document decision

3. **Sign Transaction**

   **Software Wallet**:
   ```bash
   # Via Gnosis Safe UI
   1. Connect MetaMask/WalletConnect
   2. Review transaction
   3. Click "Confirm"
   4. Sign in wallet
   ```

   **Hardware Wallet**:
   ```bash
   # Via Gnosis Safe UI + Hardware Wallet
   1. Connect via WalletConnect or Ledger Live
   2. Review transaction
   3. Click "Confirm"
   4. Verify details on hardware wallet screen
   5. Approve on device
   ```

4. **Verification**
   - Check transaction status in Safe
   - Once threshold met, transaction executes
   - Verify result on Basescan
   - Document in operations log

### Response Time Expectations

| Level | Normal Operations | Emergency |
|-------|------------------|-----------|
| **Level 2: Admin (2-of-3)** | 24-48 hours | 2-4 hours |
| **Level 3: Treasury (3-of-5)** | 48-72 hours | 24 hours |
| **Level 4: Emergency (1-of-3)** | N/A | 15 minutes |

### Communication Channels

**Primary**:
- Gnosis Safe notifications
- Email alerts
- Project Discord/Telegram

**Emergency**:
- Direct phone calls
- SMS alerts
- Signal/WhatsApp

**Backup**:
- GitHub Issues (for non-urgent)
- Weekly sync calls

---

## Responsibilities

### All Co-Signers

**MUST DO**:
- ✅ Respond to signature requests within SLA
- ✅ Review transactions thoroughly before signing
- ✅ Maintain wallet security
- ✅ Keep hardware wallet and recovery phrase secure
- ✅ Update contact information if changed
- ✅ Participate in quarterly key rotation (if scheduled)
- ✅ Report security concerns immediately

**NEVER DO**:
- ❌ Share private keys or recovery phrases
- ❌ Sign transactions without review
- ❌ Use same wallet for personal funds
- ❌ Screenshot or photograph recovery phrase
- ❌ Store recovery phrase digitally
- ❌ Approve transactions you don't understand

### Level 2: Admin Signers

**Additional Responsibilities**:
- Monitor contract health daily
- Review and approve configuration changes
- Participate in emergency response
- Understand contract functionality
- Vote on parameter updates

### Level 3: Treasury Signers

**Additional Responsibilities**:
- Review treasury balance weekly
- Approve withdrawal requests
- Verify withdrawal amounts and recipients
- Maintain withdrawal logs
- Report discrepancies

### Level 4: Emergency Signers

**Additional Responsibilities**:
- **24/7 availability required**
- Immediate response to security incidents
- Authority to pause without coordination
- Post-incident reporting
- Monthly emergency drill participation

---

## Migration Path

### From Software to Hardware Wallet

**Recommended Timeline**: Complete before production launch

#### Week 1: Order Hardware Wallet
```bash
# While hardware wallet ships:
- Continue using software wallet on testnet
- Complete testnet practice
- Prepare for migration
```

#### Week 2: Set Up Hardware Wallet
```bash
# When device arrives:
1. Initialize hardware wallet
2. Backup recovery phrase securely
3. Get device address
4. Fund with testnet ETH (small amount)

# See: hardware-wallet-setup.md
```

#### Week 3: Test on Testnet
```bash
# Practice with hardware wallet:
1. Configure .env for hardware wallet
   USE_HARDWARE_WALLET=true
   HARDWARE_WALLET_TYPE=ledger
   LEDGER_ADDRESS=0xYourNewAddress

2. Execute test transactions
3. Practice signature flow
4. Build confidence
```

#### Week 4: Production Migration
```bash
# Coordinate with team:
1. Announce hardware wallet address
2. Update multisig configuration
   - Remove software wallet address
   - Add hardware wallet address
   - Requires existing multisig vote

3. Verify new configuration
4. Test with small transaction
5. Continue production operations
```

### Address Rotation Process

**Gnosis Safe supports adding/removing signers**:

1. **Propose Change** (via existing signer)
   - Add new hardware wallet address
   - Remove old software wallet address
   - May require threshold adjustment

2. **Multisig Approval**
   - Current signers vote
   - Meets threshold (2-of-3 or 3-of-5)
   - Transaction executes

3. **Verification**
   - New signer tests with small transaction
   - Confirm all signers can still sign
   - Document change

---

## Security Best Practices

### For All Co-Signers

1. **Wallet Security**
   - Use dedicated device for signing (if possible)
   - Keep software updated
   - Use antivirus/anti-malware
   - Enable 2FA on all related accounts

2. **Private Key Management**
   - Never share private keys
   - Store recovery phrases offline
   - Use password manager for encrypted backups
   - Test recovery process

3. **Transaction Verification**
   - Always verify on hardware wallet screen
   - Check addresses match expected
   - Confirm amounts are reasonable
   - Question unusual requests

4. **Communication Security**
   - Verify message authenticity
   - Use encrypted channels for sensitive info
   - Confirm critical requests via multiple channels
   - Report phishing attempts

### Hardware Wallet Specific

1. **Physical Security**
   - Store in safe location
   - Keep PIN private
   - Don't leave connected when not in use
   - Consider geographic distribution

2. **Recovery Phrase**
   - Write on paper, store in safe
   - Consider metal backup for fire protection
   - Split across locations (advanced)
   - Never photograph or digitize

3. **Device Updates**
   - Keep firmware updated
   - Only update via official channels
   - Verify device authenticity

---

## FAQ

### Q: Do I need a hardware wallet to be a co-signer?

**A**: No! Hardware wallets are **optional**. You can:
- Use software wallet indefinitely
- Start with software, upgrade later
- Use hardware wallet from the start

**However**, for production multisig signers, hardware wallets are **strongly recommended** for security.

### Q: What if I lose my hardware wallet?

**A**: If you have your recovery phrase:
1. Purchase new hardware wallet
2. Restore from recovery phrase
3. Verify address matches
4. Continue operations

Without recovery phrase, you lose access (but multisig continues with other signers).

### Q: Can I test on testnet without hardware wallet first?

**A**: Yes! This is **recommended**:
1. Use software wallet for testnet practice
2. Learn multisig flows
3. Get hardware wallet
4. Practice with hardware wallet on testnet
5. Migrate to hardware wallet for production

### Q: How long does testnet practice take?

**A**: Recommended timeline:
- **Minimum**: 2 weeks
- **Recommended**: 4 weeks
- **Includes**: 10+ multisig transactions, emergency drill

### Q: What if I can't respond to a signature request?

**A**:
- **Admin (2-of-3)**: Other 2 signers can complete
- **Treasury (3-of-5)**: Other signers can complete
- **Emergency (1-of-3)**: Critical - notify team immediately

If prolonged absence, initiate signer rotation.

### Q: What happens if I sign a malicious transaction?

**A**: Multisig provides protection:
- Admin: Requires 2-of-3, other signer can block
- Treasury: Requires 3-of-5, multiple signers must approve
- Emergency: Only pause authority (limited damage)

**Always review transactions carefully!**

### Q: Can I use the same hardware wallet for personal funds?

**A**: **Not recommended**. Best practices:
- Dedicated hardware wallet for multisig
- Use different derivation paths minimum
- Reduces risk of operational errors

---

## Next Steps

### New Co-Signer Onboarding

1. ✅ Read this guide
2. ✅ Choose wallet type (software/hardware)
3. ✅ Set up wallet
4. ✅ Get testnet ETH
5. ✅ Join testnet multisig
6. ✅ Complete practice period (4 weeks)
7. ✅ Confirm production readiness
8. ✅ Join production multisig

### Resources

- [Hardware Wallet Setup Guide](./hardware-wallet-setup.md)
- [Troubleshooting Guide](./hardware-wallet-troubleshooting.md)
- [Key Management Runbook](./procedures/key-management-runbook.md) *(coming soon)*
- [Emergency Response Playbook](./procedures/emergency-response-playbook.md) *(coming soon)*

### Support

**Questions?**
- GitHub Discussions
- Project Discord/Telegram
- Weekly co-signer sync calls

**Issues?**
- See troubleshooting guide
- Contact multisig coordinator
- Escalate if urgent

---

**Remember**:
1. **Testnet first, always** - Practice before production
2. **Hardware wallets are optional** - But recommended for production
3. **Security is everyone's responsibility** - Review every transaction
4. **Communication is key** - Stay connected with the team

Welcome to the 402.vln.gg multisig team! 🎉
