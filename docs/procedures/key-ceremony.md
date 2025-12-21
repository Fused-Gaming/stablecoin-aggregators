# Key Ceremony Protocol

**Version**: 1.0.0
**Last Updated**: December 21, 2025
**Milestone**: M2 - Deterministic Deployment & Key Management
**Classification**: RESTRICTED
**Status**: Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Ceremony Types](#ceremony-types)
3. [Pre-Ceremony Preparation](#pre-ceremony-preparation)
4. [Ceremony Execution](#ceremony-execution)
5. [Post-Ceremony Procedures](#post-ceremony-procedures)
6. [Remote Ceremony Protocol](#remote-ceremony-protocol)
7. [In-Person Ceremony Protocol](#in-person-ceremony-protocol)
8. [Emergency Key Recovery](#emergency-key-recovery)
9. [Key Rotation Ceremony](#key-rotation-ceremony)
10. [Audit Trail](#audit-trail)

---

## Overview

### Purpose

A **key ceremony** is a formal, witnessed procedure for:
- Generating cryptographic key pairs
- Distributing signing responsibilities
- Creating multisig wallets
- Establishing operational security
- Transferring protocol ownership

### Goals

1. **Security**: Keys generated in secure environment
2. **Distribution**: No single point of failure
3. **Accountability**: All actions witnessed and documented
4. **Verifiability**: Process can be audited
5. **Redundancy**: Backup procedures in place

### When to Conduct a Key Ceremony

- **Initial Setup**: Before mainnet deployment
- **Key Rotation**: Quarterly (Level 2), Semi-annually (Level 3)
- **Signer Change**: When adding/removing signers
- **Security Incident**: After compromise or suspected breach
- **Ownership Transfer**: When governance transitions to DAO

---

## Ceremony Types

### Type 1: Initial Key Generation & Multisig Creation

**Purpose**: First-time setup of all multisig infrastructure

**Duration**: 4-6 hours

**Participants**:
- All multisig signers (11 total: 3+5+3)
- Ceremony coordinator
- Security witness(es)
- Optional: External auditor

**Deliverables**:
- 11 hardware wallets initialized
- 3 Gnosis Safe multisigs created (Levels 2, 3, 4)
- Ownership transferred from deployer
- All addresses documented and verified

### Type 2: Signer Rotation

**Purpose**: Replace one or more signers

**Duration**: 1-2 hours per multisig

**Participants**:
- Remaining signers
- New signer(s)
- Ceremony coordinator

**Deliverables**:
- New hardware wallet(s) initialized
- Multisig signer list updated
- New signer access verified
- Old signer access revoked

### Type 3: Emergency Key Recovery

**Purpose**: Recover from lost or compromised keys

**Duration**: 2-4 hours

**Participants**:
- Remaining signers
- Replacement signer(s)
- Security team
- Incident response team

**Deliverables**:
- Compromised keys revoked
- New keys generated
- Multisigs updated
- Security audit completed

---

## Pre-Ceremony Preparation

### 3-4 Weeks Before Ceremony

#### 1. Participant Confirmation

- [ ] Identify all required signers
- [ ] Confirm availability for ceremony date/time
- [ ] Verify contact information
- [ ] Send calendar invitations
- [ ] Obtain signed participation agreements

#### 2. Hardware Procurement

- [ ] Purchase hardware wallets (Ledger Nano X recommended)
  - Minimum: 11 units for all signers
  - Recommended: 14 units (11 + 3 backup)
- [ ] Verify devices are genuine (check packaging, holographic seals)
- [ ] Update firmware to latest version
- [ ] Test each device (initialization, reset)
- [ ] Prepare backup devices (optional)

#### 3. Documentation Preparation

- [ ] Print ceremony checklist (this document)
- [ ] Prepare signer roster forms
- [ ] Create witness attestation forms
- [ ] Prepare address verification worksheets
- [ ] Set up ceremony recording (if permitted)

#### 4. Environment Preparation

**For In-Person Ceremony**:
- [ ] Book secure, private room
- [ ] Verify room has no surveillance cameras
- [ ] Ensure stable internet connection (or air-gapped setup)
- [ ] Prepare computers (clean OS, verified software)
- [ ] Arrange seating for all participants
- [ ] Prepare name tags

**For Remote Ceremony**:
- [ ] Set up secure video conferencing (end-to-end encrypted)
- [ ] Test screen sharing capabilities
- [ ] Prepare backup communication channels
- [ ] Verify all participants can access tools
- [ ] Schedule test run 1 week before

#### 5. Security Measures

- [ ] Background check participants (if required)
- [ ] NDA/confidentiality agreements signed
- [ ] Device usage policy communicated
- [ ] Photography policy established
- [ ] Information security briefing scheduled

### 1 Week Before Ceremony

#### Technical Verification

- [ ] All hardware wallets firmware updated
- [ ] Gnosis Safe interface accessible
- [ ] Network RPCs tested and functional
- [ ] Block explorers accessible
- [ ] All participants have test wallets working
- [ ] Backup communication channels tested

#### Participant Readiness

- [ ] Send ceremony agenda to all participants
- [ ] Confirm final attendance
- [ ] Verify hardware wallet delivery/possession
- [ ] Send pre-ceremony briefing materials
- [ ] Confirm understanding of responsibilities

#### Final Checklist Preparation

- [ ] Print final ceremony checklist
- [ ] Prepare signer information packets
- [ ] Ready witness documentation
- [ ] Prepare audit trail forms
- [ ] Set up secure document storage

### 24 Hours Before Ceremony

#### Final Confirmations

- [ ] Confirm all participants available
- [ ] Verify location/virtual meeting details
- [ ] Test all equipment
- [ ] Verify backup plans in place
- [ ] Brief security team

#### Preparation

- [ ] Charge all hardware wallets
- [ ] Test all USB connections
- [ ] Prepare ceremony materials
- [ ] Set up recording equipment (if used)
- [ ] Review emergency procedures

---

## Ceremony Execution

### Phase 1: Opening & Verification (30 minutes)

#### 1. Roll Call & Identification

**Coordinator Actions**:
1. Welcome all participants
2. Verify identity of each participant (photo ID)
3. Mark attendance on roster
4. Introduce ceremony purpose and process

**Checklist**:
- [ ] All required participants present
- [ ] Identities verified
- [ ] Witnesses identified
- [ ] Roles assigned

#### 2. Security Briefing

**Cover**:
- [ ] Confidentiality requirements
- [ ] Device security policies
- [ ] No photography/recording without permission
- [ ] Secure seed phrase handling
- [ ] Emergency procedures
- [ ] Q&A session

#### 3. Material Distribution

**Distribute to Each Participant**:
- [ ] Hardware wallet (sealed, verified)
- [ ] USB cable
- [ ] Seed phrase backup card (blank metal/paper)
- [ ] Participant checklist
- [ ] Signer information form

**Verification**:
- [ ] Each participant acknowledges receipt
- [ ] Devices inspected for tampering
- [ ] Packaging verified genuine

### Phase 2: Hardware Wallet Initialization (60-90 minutes)

**This is the most critical phase. Take your time.**

#### For Each Signer (In Parallel or Sequential):

**Step 1: Device Initialization**

1. Connect hardware wallet to computer
2. Follow on-screen instructions
3. Select "Initialize as new device"
4. Create strong PIN (6-8 digits)
   - **Never** share PIN
   - **Never** write PIN with seed phrase
   - Memorize or store separately

**Checklist per Signer**:
- [ ] Device powered on successfully
- [ ] PIN created and confirmed
- [ ] Device ready for seed generation

**Step 2: Seed Phrase Generation**

**CRITICAL SECURITY MOMENT**

1. Device generates 24-word seed phrase
2. Signer writes words on backup card
   - Use provided metal/paper backup
   - Write clearly and legibly
   - Number each word (1-24)
   - Verify spelling of each word

3. Device prompts to verify seed phrase
   - Enter words in random order as requested
   - Confirm all words entered correctly

**Security Requirements**:
- [ ] Signer **alone** sees their seed phrase
- [ ] No cameras/phones pointed at device
- [ ] Seed written on official backup card only
- [ ] Signer verifies word order and spelling
- [ ] Device confirms seed successfully

**Witness Verification** (Without Seeing Seed):
- [ ] Witness confirms signer followed procedure
- [ ] Witness confirms seed was written down
- [ ] Witness confirms signer verified seed
- [ ] Witness signs attestation form

**Step 3: Ethereum Address Generation**

1. Install Ethereum app on hardware wallet (if required)
2. Open Ethereum app
3. Connect to MetaMask/Gnosis Safe interface
4. Derive first address (derivation path: m/44'/60'/0'/0/0)
5. Display address on device screen
6. Record address on signer roster

**Verification**:
- [ ] Address displayed on hardware wallet screen
- [ ] Address matches on computer interface
- [ ] Address recorded accurately on roster
- [ ] Signer confirms ownership

#### Parallel Processing

If multiple facilitators available:
- Process Level 2 signers (3) in parallel: ~30 min
- Process Level 3 signers (5) in parallel: ~30 min
- Process Level 4 signers (3) in parallel: ~30 min

**Total Phase 2 Time**: 60-90 minutes

### Phase 3: Multisig Creation (60-90 minutes)

**Create Each Multisig in Order**: Level 4 → Level 3 → Level 2

#### Level 4: Emergency Multisig (1-of-3)

**Step 1: Navigate to Gnosis Safe**

1. Open https://app.safe.global
2. Select network: **Base Sepolia** (testnet first)
3. Click "Create New Safe"

**Step 2: Configure Safe**

1. **Name**: "402.vln.gg Emergency Response - Base Sepolia"
2. **Add Owners**: Enter 3 emergency responder addresses
   - Emergency Responder 1: 0x...
   - Emergency Responder 2: 0x...
   - Emergency Responder 3: 0x...
3. **Threshold**: 1 out of 3
4. **Review**: Verify all addresses correct

**Step 3: Deploy Safe**

1. Review deployment transaction
2. Coordinator deploys Safe (from deployer wallet)
3. Wait for confirmation
4. **Record Safe Address**: 0x...

**Step 4: Verify Deployment**

- [ ] Safe appears in dashboard
- [ ] 3 owners listed correctly
- [ ] Threshold shows 1/3
- [ ] Each responder can access Safe

**Witness Verification**:
- [ ] Witness confirms correct addresses added
- [ ] Witness confirms threshold is 1/3
- [ ] Witness signs off on Safe creation

#### Level 3: Treasury Multisig (3-of-5)

**Repeat Process Above With**:
- **Name**: "402.vln.gg Treasury - Base Sepolia"
- **Owners**: 5 treasury signer addresses
- **Threshold**: 3 out of 5

#### Level 2: Admin Multisig (2-of-3)

**Repeat Process Above With**:
- **Name**: "402.vln.gg Admin - Base Sepolia"
- **Owners**: 3 admin signer addresses
- **Threshold**: 2 out of 3

### Phase 4: Access Verification & Testing (30-45 minutes)

#### For Each Multisig:

**Step 1: Signer Access Verification**

**Each Signer Must**:
1. Connect hardware wallet to Gnosis Safe interface
2. Unlock wallet with PIN
3. Verify correct Safe appears in dashboard
4. Verify signer address listed as owner
5. Confirm ability to view pending transactions

**Checklist per Signer**:
- [ ] Can connect hardware wallet
- [ ] Safe appears in wallet interface
- [ ] Listed as an owner
- [ ] Can view Safe details

**Step 2: Transaction Flow Test**

**For Each Multisig** (on testnet):

1. **Propose Test Transaction**
   - Level 2 Admin: Propose sending 0.001 ETH to coordinator
   - Level 3 Treasury: Propose sending 0.001 ETH to coordinator
   - Level 4 Emergency: Propose sending 0.001 ETH to coordinator

2. **Collect Signatures**
   - Level 2: Collect 2 signatures
   - Level 3: Collect 3 signatures
   - Level 4: Execute with 1 signature

3. **Verify Execution**
   - [ ] Transaction executes successfully
   - [ ] Funds transferred correctly
   - [ ] Transaction visible on block explorer

### Phase 5: Production Deployment (30-45 minutes)

**Repeat Phase 3 for Production Networks**:

1. **Base Mainnet**
   - Deploy all 3 multisigs
   - Verify deployments
   - Test signer access

2. **Ethereum Mainnet**
   - Deploy all 3 multisigs
   - Verify deployments
   - Test signer access

**IMPORTANT**: Use same signer addresses as testnet for consistency.

### Phase 6: Ownership Transfer (15-30 minutes)

**Pre-Transfer Verification**:
- [ ] All multisigs deployed and tested
- [ ] All signers have access
- [ ] All addresses documented
- [ ] Testnet testing successful

**Transfer Process**:

1. **Router402 to Admin Safe (Level 2)**
   ```
   Deployer: Router402.transferOwnership(adminSafeAddress)
   Admin Safe: Router402.acceptOwnership()
   Verify: Router402.owner() == adminSafeAddress
   ```

2. **Grant Emergency Pause to Emergency Safe (Level 4)**
   ```
   Admin Safe: Router402.grantRole(PAUSER_ROLE, emergencySafeAddress)
   Verify: Router402.hasRole(PAUSER_ROLE, emergencySafeAddress) == true
   ```

3. **Configure Treasury Address**
   ```
   Admin Safe: Router402.setTreasury(treasurySafeAddress)
   Verify: Router402.treasury() == treasurySafeAddress
   ```

**Post-Transfer Verification**:
- [ ] Deployer has no remaining admin rights
- [ ] Admin Safe can configure protocol
- [ ] Emergency Safe can pause (test on testnet)
- [ ] Treasury receives fees correctly

---

## Post-Ceremony Procedures

### Immediate (Within 1 Hour)

#### 1. Documentation

**Complete and Collect**:
- [ ] Signer roster with all addresses
- [ ] Multisig address registry (all networks)
- [ ] Witness attestation forms (signed)
- [ ] Ceremony completion checklist (signed)
- [ ] Any incident reports (if issues occurred)

#### 2. Seed Phrase Security

**Each Signer Must**:
- [ ] Securely store seed phrase backup card
  - Fireproof safe, or
  - Bank safety deposit box, or
  - Secure home safe
- [ ] **Never** photograph seed phrase
- [ ] **Never** store digitally (no photos, no files)
- [ ] **Never** share with anyone

**Recommended**:
- Metal backup in geographically separate location
- Consider multi-location distribution (Shamir's Secret Sharing)

#### 3. Hardware Wallet Security

**Each Signer Must**:
- [ ] Store hardware wallet securely when not in use
- [ ] Never leave hardware wallet in car/unsecured location
- [ ] Keep PIN separate from seed phrase
- [ ] Test wallet access within 48 hours

### Within 24 Hours

#### 1. Verification Testing

- [ ] Test all multisig access again
- [ ] Verify all addresses on block explorers
- [ ] Confirm ownership transfers complete
- [ ] Test one transaction per multisig (testnet)

#### 2. Communication

- [ ] Announce multisig addresses publicly
- [ ] Update documentation with addresses
- [ ] Send confirmation email to all signers
- [ ] Brief wider team on ceremony results

#### 3. Secure Storage

- [ ] Store all ceremony documents securely
- [ ] Encrypt digital records
- [ ] Store physical documents in safe
- [ ] Backup documentation to secure location

### Within 1 Week

#### 1. Public Announcement

Publish on:
- [ ] Project documentation
- [ ] GitHub repository
- [ ] Project blog/website
- [ ] Social media (if applicable)

**Include**:
- Multisig addresses (all networks)
- Threshold configurations
- Signer count (not identities unless public)
- Ceremony date
- Witness attestation (if external auditor)

#### 2. Signer Training

- [ ] Conduct multisig operation training
- [ ] Review emergency procedures
- [ ] Practice transaction signing
- [ ] Answer any questions

#### 3. Monitoring Setup

- [ ] Configure alerts for multisig activity
- [ ] Set up transaction notification system
- [ ] Establish communication protocols
- [ ] Test alert system

### Ongoing

#### Weekly

- [ ] Monitor multisig activity
- [ ] Review any pending transactions
- [ ] Check for security alerts

#### Monthly

- [ ] Test emergency procedures (drill)
- [ ] Verify all signers still have access
- [ ] Review and update documentation

#### Quarterly (Level 2) / Semi-Annually (Level 3)

- [ ] Conduct key rotation ceremony
- [ ] Update signer roster if needed
- [ ] Review security procedures
- [ ] Audit multisig permissions

---

## Remote Ceremony Protocol

When in-person ceremony is not feasible, use remote protocol.

### Additional Security Measures

1. **Identity Verification**
   - Video verification of government ID
   - Two-factor authentication
   - Pre-shared secret confirmation

2. **Communication Security**
   - End-to-end encrypted video (Zoom with E2EE, or Jitsi)
   - Encrypted chat for sensitive info (Signal, Keybase)
   - No email/SMS for ceremony communications

3. **Witness Procedures**
   - Screen sharing for critical steps
   - Recording (with consent) for audit trail
   - Real-time attestation via digital signatures

### Modified Ceremony Flow

**Phase 2: Hardware Wallet Initialization (Remote)**

1. **Coordinator Screen Shares**:
   - Show procedure step-by-step
   - Don't show any participant's seed phrases

2. **Each Participant** (one at a time):
   - Shares screen (device only, not seed phrase)
   - Initializes hardware wallet
   - Generates seed phrase (**camera off, screen off** for this step)
   - Confirms completion verbally
   - Shows device screen with address generated

3. **Witnesses**:
   - Observe process via screen share
   - Confirm steps completed correctly
   - Sign digital attestation

**Phase 3: Multisig Creation (Remote)**

- Coordinator screen shares entire process
- Participants verify addresses verbally
- Recording captures all addresses entered
- Witnesses confirm accuracy

### Remote Ceremony Risks

**Be Aware Of**:
- Network eavesdropping (use VPN)
- Screen recording malware
- Compromised participant devices
- Social engineering attacks

**Mitigations**:
- Use trusted, clean devices only
- Verify software integrity (checksums)
- Independent address verification via separate channel
- Post-ceremony security audit

---

## In-Person Ceremony Protocol

### Location Security

**Venue Requirements**:
- [ ] Private room (no public access)
- [ ] No surveillance cameras
- [ ] Soundproofed (or sufficient privacy)
- [ ] Controlled access (sign-in log)
- [ ] Secure WiFi or air-gapped setup

**Physical Security**:
- [ ] Security guard (optional, for high-value)
- [ ] Locked doors during ceremony
- [ ] Controlled electronic devices
- [ ] Faraday bag for phones (optional)

### Participant Verification

**In-Person Identity Check**:
1. Government-issued photo ID
2. Match to pre-registered participant list
3. Photo taken (retained securely)
4. Sign attendance log

### Enhanced Witness Procedures

**Witnesses Should**:
- Observe all seed phrase generation (without viewing seeds)
- Verify proper security practices
- Confirm no unauthorized recording
- Attest to ceremony integrity
- Sign physical attestation forms

### Air-Gapped Option

For maximum security, conduct ceremony without internet:

**Process**:
1. Initialize all hardware wallets offline
2. Record addresses manually
3. Create multisigs offline (using Gnosis Safe contract deploy)
4. Broadcast transactions later via trusted node

**Benefits**:
- No network attack surface during ceremony
- Complete air-gap during key generation

**Drawbacks**:
- More complex process
- Requires technical expertise
- Longer ceremony duration

---

## Emergency Key Recovery

### When to Execute

- Signer lost hardware wallet and seed phrase
- Hardware wallet stolen or compromised
- Suspicion of seed phrase exposure
- Signer no longer available/trustworthy

### Recovery Process

**Step 1: Assess Situation** (Immediate)

- [ ] Determine which key(s) compromised
- [ ] Assess risk level (active threat vs. preventive)
- [ ] Notify all remaining signers
- [ ] Convene emergency meeting

**Step 2: Evaluate Options**

**Option A: Rotate Signer Within Existing Multisig**
- If threshold can still be met
- Add new signer, remove old signer
- Requires threshold signatures

**Option B: Create New Multisig**
- If security compromise is severe
- Deploy new Safe, migrate authority
- More disruptive but cleaner

**Step 3: Execute Recovery** (Within 24-48 hours)

**For Option A**:
1. Conduct mini key ceremony for new signer
2. Propose add new signer transaction
3. Collect threshold signatures
4. Execute transaction
5. Propose remove old signer transaction
6. Collect threshold signatures
7. Execute transaction

**For Option B**:
1. Conduct full key ceremony for new multisig
2. Deploy new Safe
3. Transfer ownership from old to new Safe
4. Update documentation
5. Announce changes publicly

**Step 4: Post-Recovery Actions**

- [ ] Verify new configuration works
- [ ] Update all documentation
- [ ] Conduct security audit
- [ ] Review what went wrong
- [ ] Improve procedures to prevent recurrence

---

## Key Rotation Ceremony

**Frequency**:
- Level 2 (Admin): Quarterly
- Level 3 (Treasury): Semi-annually
- Level 4 (Emergency): As needed

**Purpose**:
- Reduce long-term key exposure risk
- Maintain signer diversity
- Update to latest security practices

**Process**:

1. **Pre-Rotation** (1 week before)
   - Identify which signer(s) to rotate
   - Recruit replacement signer(s)
   - Schedule rotation ceremony

2. **Rotation Ceremony** (2-3 hours)
   - Initialize new signer hardware wallet
   - Add new signer to multisig
   - Test new signer access
   - Remove old signer from multisig
   - Verify new threshold works

3. **Post-Rotation**
   - Old signer securely destroys keys (wipe device, destroy seed backup)
   - Update documentation
   - Test new configuration
   - Monitor for issues

**Stagger Rotations**: Never rotate all signers simultaneously.

---

## Audit Trail

### Required Documentation

Every key ceremony must produce:

1. **Ceremony Report**
   - Date, time, location
   - List of participants
   - Purpose of ceremony
   - Summary of actions taken
   - Any incidents or issues
   - Conclusion and next steps

2. **Signer Roster**
   - Signer names and roles
   - Ethereum addresses
   - Multisig assignment (Level 2/3/4)
   - Contact information

3. **Multisig Registry**
   - All Safe addresses (all networks)
   - Threshold configurations
   - Deployment transactions
   - Block explorer links

4. **Witness Attestations**
   - Signed by all witnesses
   - Confirms ceremony integrity
   - Documents any deviations from protocol

5. **Incident Reports**
   - Any security concerns
   - Equipment failures
   - Procedural deviations
   - Resolutions

### Record Retention

**Storage**:
- Encrypted digital storage (AES-256)
- Physical copies in secure safe
- Backup copies in geographically separate location

**Access Control**:
- Restricted to authorized personnel only
- Audit log of all access
- Regular access reviews

**Retention Period**:
- Keep indefinitely for initial ceremony
- Keep rotation ceremony records for 7 years
- Keep incident reports indefinitely

---

## Appendix

### A. Ceremony Checklist (Printable)

```
[ ] Pre-Ceremony
    [ ] Participants confirmed
    [ ] Hardware wallets procured
    [ ] Environment prepared
    [ ] Documentation printed

[ ] Opening
    [ ] Roll call complete
    [ ] Identities verified
    [ ] Security briefing given
    [ ] Materials distributed

[ ] Hardware Wallet Init
    [ ] All devices initialized
    [ ] All seed phrases generated and backed up
    [ ] All addresses recorded

[ ] Multisig Creation
    [ ] Level 4 Emergency Safe created
    [ ] Level 3 Treasury Safe created
    [ ] Level 2 Admin Safe created
    [ ] All Safes verified on testnet

[ ] Production Deployment
    [ ] Safes created on Base mainnet
    [ ] Safes created on Ethereum mainnet
    [ ] All addresses documented

[ ] Ownership Transfer
    [ ] Router ownership transferred
    [ ] Emergency pause granted
    [ ] Treasury configured

[ ] Post-Ceremony
    [ ] Documentation complete
    [ ] Seed phrases secured
    [ ] Public announcement prepared
```

### B. Witness Attestation Form

```
WITNESS ATTESTATION

I, [WITNESS NAME], hereby attest that on [DATE], I witnessed
a key ceremony conducted for 402.vln.gg project.

I confirm that:
- All participants were properly identified
- Security procedures were followed
- Seed phrases were generated securely
- No unauthorized observation of seed phrases occurred
- Multisig addresses were verified correctly
- The ceremony was conducted according to protocol

Any deviations or incidents:
[DESCRIBE OR STATE "NONE"]

Witness Signature: ___________________
Date: _____________
```

### C. Related Documentation

- [Multisig Setup Guide](./multisig-setup.md)
- [Key Management Runbook](./key-management-runbook.md)
- [Signer Onboarding Guide](./signer-onboarding.md)
- [Emergency Response Playbook](./emergency-response-playbook.md)

---

**Document Version**: 1.0.0
**Last Updated**: December 21, 2025
**Next Review**: March 21, 2026
**Classification**: RESTRICTED
**Owner**: Security Team
