# Key Management Runbook

**Version**: 1.0.0
**Last Updated**: December 21, 2025
**Milestone**: M2 - Deterministic Deployment & Key Management
**Classification**: RESTRICTED
**Status**: Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Key Hierarchy](#key-hierarchy)
3. [Hardware Wallet Management](#hardware-wallet-management)
4. [Seed Phrase Security](#seed-phrase-security)
5. [Operational Procedures](#operational-procedures)
6. [Key Rotation](#key-rotation)
7. [Emergency Procedures](#emergency-procedures)
8. [Audit and Compliance](#audit-and-compliance)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Overview

### Purpose

This runbook provides comprehensive procedures for managing cryptographic keys used in the 402.vln.gg stablecoin aggregator protocol.

### Scope

Covers:
- Hardware wallet management
- Seed phrase security
- Key generation and storage
- Operational security
- Key rotation procedures
- Emergency key recovery
- Compliance and audit trails

### Principles

1. **Defense in Depth**: Multiple security layers
2. **Least Privilege**: Minimal necessary permissions
3. **Separation of Duties**: No single point of failure
4. **Accountability**: All actions logged and auditable
5. **Recoverability**: Backup and recovery procedures

---

## Key Hierarchy

### Level 0: Deployer Key (DEPRECATED After Deployment)

**Purpose**: One-time contract deployment
**Type**: Single hardware wallet
**Status**: Deprecated after ownership transfer
**Security**: Highest (air-gapped signing recommended)

**Lifecycle**:
1. Generate on new hardware wallet
2. Use for deployment only
3. Transfer ownership to multisigs
4. Verify no remaining permissions
5. Archive key securely
6. **Never reuse for other purposes**

### Level 1: Individual Signer Keys

**Purpose**: Individual members of multisigs
**Type**: Hardware wallet per signer (11 total)
**Security**: High (hardware wallet + secure backup)

**Distribution**:
- 3 keys for Level 2 Admin Multisig
- 5 keys for Level 3 Treasury Multisig
- 3 keys for Level 4 Emergency Multisig

### Level 2: Admin Multisig (2-of-3)

**Purpose**: Protocol configuration and administration
**Threshold**: 2 out of 3 signatures
**Rotation**: Quarterly
**Geographic Distribution**: Required

**Powers**:
- Configure fee parameters
- Add/remove supported tokens
- Approve/revoke bridges
- Pause/unpause protocol
- Update treasury address

### Level 3: Treasury Multisig (3-of-5)

**Purpose**: Fee management and treasury operations
**Threshold**: 3 out of 5 signatures
**Rotation**: Semi-annually
**Geographic Distribution**: Required

**Powers**:
- Withdraw collected fees
- Manage treasury allocations
- Execute treasury operations

**Limits**:
- Daily withdrawal: $100,000 USDC
- Monthly withdrawal: $1,000,000 USDC

### Level 4: Emergency Multisig (1-of-3)

**Purpose**: Emergency pause only
**Threshold**: 1 out of 3 signatures
**Rotation**: As needed
**Availability**: 24/7 (<15 min response)

**Powers**:
- Emergency pause protocol

**Explicitly Cannot**:
- Unpause (requires Level 2)
- Withdraw funds
- Modify configuration

---

## Hardware Wallet Management

### Approved Hardware Wallets

**Primary Recommendation**: Ledger Nano X
- Latest firmware: Check https://www.ledger.com
- Certified Genuine Device required
- Bluetooth optional (disable for max security)

**Alternative**: Trezor Model T
- Latest firmware: Check https://trezor.io
- Touchscreen for verification
- Shamir Backup supported

**Not Approved**:
- Software wallets (MetaMask, Trust Wallet, etc.)
- Hot wallets
- Exchange-custodied wallets
- Multisig services without hardware wallet integration

### Hardware Wallet Procurement

**Purchase Requirements**:
1. **Buy directly from manufacturer** (never third-party)
   - Ledger: https://shop.ledger.com
   - Trezor: https://shop.trezor.io

2. **Verify packaging**
   - Check holographic seals
   - Verify serial number
   - Inspect for tampering
   - Verify firmware authenticity

3. **Never use pre-initialized devices**
   - Device must be factory sealed
   - You must initialize yourself
   - Reject if seed phrase provided

### Initial Setup

**Pre-Setup Security**:
- [ ] Clean computer (verified OS, no malware)
- [ ] Secure network (trusted WiFi or air-gapped)
- [ ] Private location (no cameras, no observers except witnesses)
- [ ] No phone cameras in room

**Setup Process**:

1. **Unbox and Inspect**
   - Verify packaging integrity
   - Check anti-tamper seals
   - Confirm device appearance matches official images

2. **Connect and Initialize**
   - Connect via USB (not Bluetooth)
   - Follow on-device instructions
   - Select "Initialize as new device"

3. **Create PIN**
   - Choose 6-8 digit PIN
   - **Never use**: birthdays, sequential numbers, repeated digits
   - **Do use**: Random, memorable to you only
   - **Never write PIN with seed phrase**
   - Store PIN separately (password manager or memory only)

4. **Generate Seed Phrase**
   - Device generates 24-word BIP39 seed phrase
   - Write on official recovery sheet (or metal backup)
   - Number each word 1-24
   - Verify spelling
   - Confirm order

5. **Verify Seed Phrase**
   - Device will prompt you to confirm words in random order
   - Enter exactly as written
   - Confirm successful verification

6. **Install Ethereum App** (if needed)
   - Via Ledger Live or Trezor Suite
   - Keep firmware and apps updated

7. **Generate First Address**
   - Derivation path: m/44'/60'/0'/0/0 (default Ethereum)
   - Verify address on device screen
   - Confirm address matches on computer
   - Record address securely

### Daily Operations

**Using Hardware Wallet for Signing**:

1. **Pre-Signing Verification**
   - Verify transaction details on computer
   - Check recipient address (use address book)
   - Verify amount and gas settings
   - Understand what function is being called

2. **Device Connection**
   - Connect hardware wallet
   - Enter PIN
   - Unlock device

3. **Transaction Review**
   - **CRITICAL**: Review all details on device screen (not just computer)
   - Verify recipient address matches
   - Verify amount is correct
   - Check data payload if applicable
   - Confirm network (mainnet vs testnet)

4. **Sign Transaction**
   - Approve on device
   - Wait for confirmation
   - Verify transaction on block explorer

5. **Disconnect**
   - Safely disconnect device
   - Store securely

**Never**:
- Sign blind (always verify on device)
- Leave device connected when not in use
- Use device on untrusted computer
- Install unofficial apps
- Share device screen via screen share when viewing sensitive data

### Device Storage

**When Not in Use**:
- [ ] Store in secure location (home safe, office safe)
- [ ] Protect from physical damage (water, fire, crushing)
- [ ] Keep separate from seed phrase backup
- [ ] Control access (limit who knows location)

**Travel**:
- [ ] Carry in hand luggage (never checked bags)
- [ ] Use tamper-evident bag
- [ ] Have backup signer available if device lost
- [ ] Never travel with seed phrase backup

---

## Seed Phrase Security

### Critical Importance

**Your seed phrase is your private key**:
- Anyone with your seed phrase can access your funds
- Loss of seed phrase = permanent loss of access
- Exposure of seed phrase = immediate compromise
- **No recovery if both device and backup lost**

### Backup Creation

**During Key Ceremony**:
1. Device generates 24 words
2. Write on recovery card/metal backup
3. **Only you see the words** (privacy screen, no cameras)
4. Double-check spelling and order
5. Verify on device
6. Seal backup securely

**Approved Backup Methods**:

1. **Metal Backup** (Recommended)
   - Fire and water resistant
   - Products: Cryptosteel, Billfodl, Steely
   - Stamp or slide letters
   - Store in fireproof safe

2. **Paper Backup**
   - Official Ledger/Trezor recovery sheet
   - Archival quality paper
   - Pencil (not pen, ink can fade)
   - Laminate for water resistance
   - Store in fireproof safe

3. **Shamir Secret Sharing** (Advanced)
   - Split seed into multiple shares
   - Requires threshold of shares to recover
   - Trezor supports natively (SLIP-39)
   - Distribute shares geographically
   - More complex but more resilient

**Never**:
- Store seed phrase digitally (no photos, no text files, no cloud)
- Email seed phrase
- Store in password manager (PIN is OK, seed is NOT)
- Tell anyone your seed phrase
- Store all backups in one location
- Laminate without testing (heat can damage paper)

### Backup Storage

**Primary Backup**:
- Fireproof safe at home
- OR bank safety deposit box
- OR secure office safe

**Secondary Backup** (Optional but Recommended):
- Geographically separate location
- Different security model
- Access by trusted individual (family member) in envelope with tamper-evident seal
- Instructions for use only in emergency

**Geographic Distribution Examples**:
- Primary: Home safe (your city)
- Secondary: Family member's safe (different city/state)
- Tertiary: Bank safety deposit box (different institution)

### Backup Testing

**Quarterly Verification**:
- [ ] Verify backup storage location is secure
- [ ] Check for physical damage (water, fire, degradation)
- [ ] Confirm backup is readable
- [ ] Test recovery on testnet (optional, only if comfortable)

**Never**:
- Enter seed phrase on computer to "test" it
- Use online seed phrase checkers
- Share seed phrase to "verify" it's correct

### Compromise Detection

**Signs Your Seed May Be Compromised**:
- Unauthorized transactions from your address
- Address appeared in data breach
- Device or backup stolen
- Seed phrase potentially photographed
- Entered seed on untrusted device
- Phishing attempt successful

**If Compromised or Suspected**:
1. **Immediate**: Transfer funds to new address (if still have access)
2. **Within 1 hour**: Generate new seed phrase on new hardware wallet
3. **Within 4 hours**: Execute emergency key rotation (see Key Ceremony doc)
4. **Within 24 hours**: Complete incident report
5. **Ongoing**: Monitor old address for any activity

---

## Operational Procedures

### Proposing a Transaction

**Pre-Proposal**:
1. **Verify Authority**
   - Confirm you have authority to propose this transaction
   - Check if transaction aligns with protocol governance
   - For large transactions, get secondary approval

2. **Prepare Transaction Details**
   - Recipient address (verify via multiple sources)
   - Amount (double-check decimals)
   - Function to call
   - Network (correct chain)

3. **Use Address Book**
   - Add frequently used addresses to Gnosis Safe address book
   - Label clearly (e.g., "402.vln.gg Treasury - Base")
   - Verify address before adding

**Proposal Process**:

1. **Access Gnosis Safe**
   - Navigate to https://app.safe.global
   - Connect hardware wallet
   - Select correct Safe
   - Verify correct network

2. **Create Transaction**
   - Click "New Transaction"
   - Select transaction type
   - Enter details
   - Review carefully

3. **Verify on Device**
   - Check recipient on hardware wallet screen
   - Verify amount
   - Confirm function call
   - **If anything looks wrong, REJECT**

4. **Sign and Propose**
   - Sign on hardware wallet
   - Transaction enters queue
   - Notify other signers

5. **Document Proposal**
   - Post in signer channel
   - Include: purpose, amount, recipient, deadline
   - Link to Safe transaction

### Collecting Signatures

**As Proposer**:
1. **Notify Signers**
   - Post in appropriate channel (Admin/Treasury/Emergency)
   - Include context and urgency
   - Provide deadline

2. **Answer Questions**
   - Be available to explain transaction
   - Provide supporting documentation
   - Address concerns

3. **Monitor Progress**
   - Track signatures collected
   - Remind signers if approaching deadline
   - Be ready to execute when threshold met

**As Co-Signer**:
1. **Review Proposal**
   - Check transaction details in Safe UI
   - Verify recipient address independently
   - Understand purpose
   - Check amount is reasonable

2. **Independent Verification**
   - Don't just trust proposer
   - Verify addresses via block explorer
   - Check recent activity
   - For large amounts, use secondary channel to confirm

3. **Sign or Reject**
   - If approved: Sign with hardware wallet
   - If concerns: Ask questions first
   - If rejected: Formally reject in Safe UI
   - Document decision

4. **Verify on Device**
   - **Always verify full transaction details on device screen**
   - Reject if anything unclear

### Executing Transactions

**When Threshold Met**:
1. **Final Verification**
   - All signatures collected
   - Transaction still valid
   - No changes in protocol state that would affect it

2. **Execute**
   - Click "Execute" in Gnosis Safe
   - Sign with hardware wallet
   - Pay gas fee
   - Wait for confirmation

3. **Verify Execution**
   - Check transaction on block explorer
   - Confirm intended effect occurred
   - Monitor for any issues
   - Document completion

**Post-Execution**:
- Update tracking spreadsheet
- Notify stakeholders
- Archive transaction details

---

## Key Rotation

### Rotation Schedule

**Level 2 (Admin)**: Every 3 months (Quarterly)
**Level 3 (Treasury)**: Every 6 months (Semi-annually)
**Level 4 (Emergency)**: As needed (minimum annually)

### Planned Rotation Process

**6 Weeks Before Rotation**:
1. [ ] Identify which signer(s) to rotate
2. [ ] Recruit replacement signer(s)
3. [ ] Begin onboarding process (see Signer Onboarding Guide)
4. [ ] Schedule rotation ceremony

**2 Weeks Before**:
1. [ ] Confirm rotation date with all participants
2. [ ] Prepare hardware wallets for new signers
3. [ ] Review key ceremony procedures
4. [ ] Test infrastructure

**Rotation Day** (Follow Key Ceremony Protocol):
1. [ ] Initialize new signer hardware wallet
2. [ ] Generate and backup seed phrase
3. [ ] Derive Ethereum address
4. [ ] Add new signer to multisig (requires threshold)
5. [ ] Test new signer can access and sign
6. [ ] Remove old signer from multisig (requires threshold)
7. [ ] Verify new threshold configuration

**Post-Rotation**:
1. [ ] Old signer securely destroys key
   - Wipe hardware wallet (factory reset)
   - Destroy seed phrase backup (shred, burn, or pulverize)
   - Confirm destruction
2. [ ] Update signer roster documentation
3. [ ] Test emergency procedures with new configuration
4. [ ] Monitor for 48 hours

### Staggered Rotation

**Never rotate all signers at once**

**Recommended Rotation Pattern**:

**Quarter 1**:
- Rotate Admin Signer 1
- Rotate Treasury Signer 1

**Quarter 2**:
- Rotate Admin Signer 2
- Rotate Treasury Signer 2

**Quarter 3**:
- Rotate Admin Signer 3
- Rotate Treasury Signer 3

**Quarter 4**:
- Rotate Treasury Signer 4
- Rotate Emergency Signer 1 (if needed)

This ensures:
- Always have experienced signers
- Reduce coordination burden
- Maintain operational continuity

---

## Emergency Procedures

### Lost Hardware Wallet (Seed Phrase Intact)

**Severity**: Low to Medium
**Timeline**: Replace within 1 week

**Steps**:
1. **Assess Impact**
   - Which multisig affected?
   - Can threshold still be met?
   - Any unauthorized transactions?

2. **Order Replacement Device**
   - Purchase new hardware wallet
   - Follow procurement procedure

3. **Recover Access**
   - Initialize new device
   - **Enter seed phrase from backup**
   - Verify recovered address matches
   - Test signing

4. **Verify No Compromise**
   - Review recent transactions
   - Check for unauthorized activity
   - If any suspicion, treat as compromised (see below)

5. **Secure New Device**
   - Create new PIN (different from before)
   - Update storage procedures

### Lost Seed Phrase (Hardware Wallet Intact)

**Severity**: Medium
**Timeline**: Rotate within 1 week

**Steps**:
1. **Immediate**
   - Do NOT lose the hardware wallet
   - Lock it securely
   - Continue to use carefully

2. **Plan Rotation**
   - Schedule emergency key ceremony
   - Generate new key on new device
   - Add to multisig
   - Remove old key from multisig

3. **Destroy Old Key**
   - After successfully rotated
   - Wipe old device
   - No backup exists

### Lost Both Hardware Wallet and Seed Phrase

**Severity**: High
**Timeline**: Emergency rotation ASAP

**Steps**:
1. **Assess Risk**
   - Can multisig threshold still be met? (e.g., 2-of-3 becomes 2-of-2)
   - Are funds at risk?
   - Need emergency pause?

2. **Emergency Key Rotation**
   - Follow Emergency Key Recovery procedure (see Key Ceremony doc)
   - Priority: Restore redundancy
   - Add new signer immediately

3. **Post-Mortem**
   - How did this happen?
   - Improve procedures
   - Additional training

### Suspected Key Compromise

**Severity**: Critical (P0)
**Timeline**: Immediate action (<1 hour)

**See**: [Emergency Response Playbook](./emergency-response-playbook.md#scenario-3-suspected-key-compromise)

**Quick Steps**:
1. Reject any pending unauthorized transactions
2. Pause protocol (if Level 2 or 4 compromised)
3. Execute emergency key rotation
4. Transfer funds to new multisig (if needed)
5. Security audit
6. Incident report

---

## Audit and Compliance

### Transaction Logging

**All multisig transactions automatically logged on-chain**:
- Gnosis Safe events
- Ethereum/Base block explorers
- Tenderly/Defender monitoring

**Additional Documentation Required**:
- Purpose of transaction
- Who proposed
- Who signed
- Business justification
- Approval records

### Signer Activity Monitoring

**Track**:
- Last sign date per signer
- Response time to signature requests
- Rejection rate
- Availability

**Alert if**:
- Signer inactive >30 days
- Signer consistently slow to respond
- Signer rejection rate >20%

### Access Reviews

**Quarterly** (for Level 2):
- [ ] Review all signers still appropriate
- [ ] Verify contact information current
- [ ] Confirm hardware wallet access
- [ ] Test response procedures

**Semi-Annually** (for Level 3):
- [ ] Same as quarterly
- [ ] Review spending patterns
- [ ] Audit withdrawal logs
- [ ] Verify limits appropriate

**Annually** (for Level 4):
- [ ] Review emergency responders
- [ ] Test emergency procedures
- [ ] Verify 24/7 coverage
- [ ] Update contact information

### Compliance Obligations

**Maintain**:
- [ ] Complete signer roster (current and historical)
- [ ] All seed phrase generation ceremonies documented
- [ ] Transaction approval records
- [ ] Key rotation logs
- [ ] Incident reports
- [ ] Access review records

**Retention**: 7 years minimum

---

## Best Practices

### Do's

✅ **Always**:
- Verify transaction details on hardware wallet screen
- Use address book for known addresses
- Double-check amounts and recipients
- Keep hardware wallet firmware updated
- Store seed phrase offline only
- Use metal backup for fire/water resistance
- Maintain geographic distribution
- Test recovery procedures
- Document all key ceremonies
- Rotate keys on schedule
- Report suspicious activity immediately

### Don'ts

❌ **Never**:
- Share seed phrases
- Store seed phrase digitally
- Photograph seed phrase
- Enter seed phrase on computer
- Use hot wallets for multisig signers
- Sign without verifying on device
- Leave hardware wallet connected when not in use
- Travel with both device and backup
- Skip security procedures
- Ignore alerts and warnings
- Delay reporting potential compromises

### Operational Security Tips

1. **Secure Your Environment**
   - Private space for key operations
   - No cameras/phones
   - Trusted computer only
   - Secure network

2. **Verify Everything**
   - Addresses via multiple sources
   - Software via checksums
   - Firmware via official signatures
   - Transaction details on device

3. **Plan for Failure**
   - Multiple backups
   - Geographic distribution
   - Threshold > 1 (no single point of failure)
   - Regular drills

4. **Stay Updated**
   - Firmware updates (verify authentic)
   - Security advisories
   - Best practice evolution
   - Threat intelligence

---

## Troubleshooting

### Cannot Connect Hardware Wallet

**Symptoms**: Device not recognized by computer

**Solutions**:
1. Try different USB cable
2. Try different USB port
3. Restart device
4. Restart computer
5. Reinstall device drivers
6. Update firmware (if accessible)
7. Try different computer

### Forgotten PIN

**Symptoms**: Cannot unlock device

**Recovery**:
1. **If have seed phrase**: Reset device, enter seed phrase
2. **If no seed phrase**: Device is permanently locked (funds not lost if in multisig with threshold >1)
3. **Prevention**: Consider PIN hints (stored separately, not with seed)

### Address on Device Doesn't Match Computer

**Symptoms**: Address shown on device ≠ address shown on screen

**DANGER**: Possible malware on computer

**Actions**:
1. **STOP immediately**
2. **Do NOT sign anything**
3. **Disconnect device**
4. **Scan computer for malware**
5. **Try different computer**
6. **If persists, contact security team**

### Seed Phrase Not Working

**Symptoms**: Entering seed phrase doesn't recover expected address

**Possible Causes**:
1. **Typo in seed phrase**: Check spelling, word order
2. **Wrong passphrase**: BIP39 passphrases (if used)
3. **Wrong derivation path**: Try m/44'/60'/0'/0/0 (Ethereum default)
4. **Counterfeit device**: Fake device generated different seed

**Solutions**:
1. Carefully re-enter seed phrase
2. Try without passphrase (if applicable)
3. Try different derivation paths
4. Consult hardware wallet support
5. Check if device is genuine

### Hardware Wallet Firmware Update Failed

**Symptoms**: Update interruption, bricked device

**Recovery**:
1. **Don't panic**: Seed phrase still valid
2. **Try recovery mode**: Device-specific procedure
3. **Contact manufacturer support**
4. **If unrecoverable**: Buy new device, restore from seed phrase

**Prevention**:
- Update firmware carefully
- Don't interrupt update process
- Keep device charged
- Follow manufacturer instructions exactly

---

## Appendices

### Appendix A: Hardware Wallet Comparison

| Feature | Ledger Nano X | Trezor Model T |
|---------|---------------|----------------|
| Screen | Small OLED | Color Touchscreen |
| Backup | 24 words (BIP39) | 12/18/24 words + Shamir |
| Bluetooth | Yes (optional) | No |
| Apps | Ledger Live | Trezor Suite |
| Price | ~$150 | ~$250 |
| Open Source | Partial | Yes |
| Best For | Convenience | Security Purists |

**Recommendation**: Both are excellent. Choose based on preference.

### Appendix B: Seed Phrase Checklist

```
[ ] Seed Phrase Generation
    [ ] Generated on hardware wallet (not computer)
    [ ] 24 words
    [ ] Written on official backup card
    [ ] Each word numbered 1-24
    [ ] Spelling verified
    [ ] Order verified
    [ ] Verified on device

[ ] Backup Storage
    [ ] Primary backup in fireproof safe
    [ ] Secondary backup geographically separate (optional)
    [ ] No digital copies exist
    [ ] No one else has seen seed phrase
    [ ] Backup location documented (securely)

[ ] Security Verification
    [ ] No cameras present during generation
    [ ] Private environment used
    [ ] Backup sealed/secured
    [ ] Device disconnected and stored
    [ ] Recovery card stored separately from device
```

### Appendix C: Quarterly Review Checklist

```
[ ] Signer Access Verification
    [ ] All signers can access hardware wallet
    [ ] All signers can access Gnosis Safe
    [ ] Contact information current
    [ ] Availability confirmed

[ ] Hardware Wallet Status
    [ ] Firmware up to date
    [ ] Device functional
    [ ] No physical damage
    [ ] Storage location secure

[ ] Backup Verification
    [ ] Backup storage location secure
    [ ] No physical damage to backup
    [ ] Backup readable/intact

[ ] Security Review
    [ ] No unauthorized transactions
    [ ] No suspicious activity
    [ ] No compromise indicators
    [ ] Security procedures followed

[ ] Documentation Update
    [ ] Signer roster current
    [ ] Contact information updated
    [ ] Procedures reviewed
    [ ] Changes documented
```

### Appendix D: Related Documentation

- [Multisig Setup Guide](./multisig-setup.md)
- [Key Ceremony Protocol](./key-ceremony.md)
- [Emergency Response Playbook](./emergency-response-playbook.md)
- [Signer Onboarding Guide](./signer-onboarding.md)

---

**Document Version**: 1.0.0
**Last Updated**: December 21, 2025
**Next Review**: March 21, 2026
**Classification**: RESTRICTED
**Owner**: Security Team

**Mandatory Training**: All signers must complete before receiving hardware wallet
**Quarterly Review Required**: Yes
**Updates After Security Incidents**: Mandatory
