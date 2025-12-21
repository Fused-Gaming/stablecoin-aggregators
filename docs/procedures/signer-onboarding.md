# Signer Onboarding Guide

**Version**: 1.0.0
**Last Updated**: December 21, 2025
**Milestone**: M2 - Deterministic Deployment & Key Management
**Classification**: INTERNAL
**Status**: Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Signer Requirements](#signer-requirements)
3. [Onboarding Process](#onboarding-process)
4. [Training Program](#training-program)
5. [Hardware Setup](#hardware-setup)
6. [Access Provisioning](#access-provisioning)
7. [Testing and Verification](#testing-and-verification)
8. [Ongoing Responsibilities](#ongoing-responsibilities)
9. [Offboarding Process](#offboarding-process)
10. [Resources](#resources)

---

## Overview

### Purpose

This guide provides a comprehensive onboarding process for new multisig signers in the 402.vln.gg protocol.

### Signer Roles

#### Level 2: Admin Signer (2-of-3)
**Commitment**: ~2-4 hours/month
**Availability**: 24-48 hour response time
**Rotation**: Quarterly

**Responsibilities**:
- Review and sign configuration changes
- Participate in protocol governance
- Respond to admin multisig requests
- Attend quarterly reviews

#### Level 3: Treasury Signer (3-of-5)
**Commitment**: ~1-2 hours/month
**Availability**: 48-72 hour response time
**Rotation**: Semi-annually

**Responsibilities**:
- Review and approve treasury withdrawals
- Verify fund management operations
- Respond to treasury multisig requests
- Attend semi-annual reviews

#### Level 4: Emergency Responder (1-of-3)
**Commitment**: On-call 24/7
**Availability**: <15 minute response time
**Rotation**: As needed (minimum annually)

**Responsibilities**:
- Monitor emergency alerts
- Execute emergency pause if needed
- Participate in emergency drills
- Maintain 24/7 availability

### Onboarding Timeline

**Total Duration**: 3-4 weeks

```
Week 1: Vetting and Preparation
Week 2: Training and Hardware Setup
Week 3: Testing and Integration
Week 4: Full Activation and Sign-off
```

---

## Signer Requirements

### Technical Requirements

**Must Have**:
- [ ] Computer with updated OS (Windows 10+, macOS 11+, or Linux)
- [ ] Reliable internet connection
- [ ] Hardware wallet (provided, or already owned Ledger/Trezor)
- [ ] Smartphone for 2FA and secure messaging
- [ ] Ability to attend video calls

**Should Have**:
- [ ] Familiarity with cryptocurrency basics
- [ ] Understanding of Ethereum/blockchain fundamentals
- [ ] Experience with web3 wallets (MetaMask, etc.)
- [ ] Technical aptitude

**Nice to Have**:
- [ ] Smart contract development experience
- [ ] DeFi protocol usage experience
- [ ] Gnosis Safe experience
- [ ] Security background

### Personal Requirements

**Essential**:
- [ ] Trustworthy and reliable
- [ ] Strong security mindset
- [ ] Attention to detail
- [ ] Available during required hours
- [ ] Stable and contactable
- [ ] Pass background check (if required)

**For Emergency Responders**:
- [ ] 24/7 availability (with backup coverage)
- [ ] <15 minute response time capability
- [ ] Experience with incident response
- [ ] Calm under pressure

### Legal/Compliance Requirements

**All Signers**:
- [ ] Sign NDA/confidentiality agreement
- [ ] Agree to key management policies
- [ ] Consent to security audits (if applicable)
- [ ] Understand fiduciary responsibilities

**Jurisdiction Considerations**:
- [ ] Verify no legal restrictions on cryptographic key custody
- [ ] Understand tax implications (consult personal advisor)
- [ ] Comply with local regulations

---

## Onboarding Process

### Phase 1: Vetting and Preparation (Week 1)

#### Step 1: Initial Contact and Vetting

**Day 1-2: Application**

1. **Candidate Submits Application**
   - Contact information
   - Background and experience
   - Availability confirmation
   - Role preference (Level 2/3/4)

2. **Initial Screening Call** (30 minutes)
   - Discuss role and responsibilities
   - Assess technical capability
   - Verify availability
   - Answer candidate questions

3. **Background Check** (if required)
   - Identity verification
   - Reference checks
   - Criminal background check (jurisdiction-dependent)
   - Conflict of interest disclosure

**Day 3-5: Security Briefing**

1. **Security Overview Call** (1 hour)
   - Protocol security architecture
   - Key management principles
   - Threat model
   - Q&A

2. **Documentation Review** (Self-paced)
   - Read this onboarding guide
   - Review relevant procedures:
     - [Multisig Setup Guide](./multisig-setup.md) (if applicable)
     - [Key Management Runbook](./key-management-runbook.md)
     - [Emergency Response Playbook](./emergency-response-playbook.md) (Emergency Responders)

3. **Security Questionnaire**
   - Test understanding of key concepts
   - Identify knowledge gaps
   - Pass score: 80%

**Day 6-7: Formal Agreements**

1. **Review and Sign**
   - [ ] NDA/Confidentiality Agreement
   - [ ] Signer Responsibilities Agreement
   - [ ] Key Management Policy Acknowledgment
   - [ ] Code of Conduct

2. **Verify Understanding**
   - Review all signed documents
   - Clarify any questions
   - Obtain legal advice if needed

#### Step 2: Hardware Procurement

**Day 5-10: Hardware Wallet Order**

1. **Determine Hardware Need**
   - Does candidate already have approved hardware wallet?
   - If yes: Verify it's unused (will initialize new seed)
   - If no: Protocol provides hardware wallet

2. **Order Hardware Wallet**
   - [ ] Order from official manufacturer
   - [ ] Ship directly to signer's secure address
   - [ ] Track shipping
   - [ ] Confirm delivery

3. **Verify Device**
   - [ ] Check packaging integrity
   - [ ] Verify anti-tamper seals
   - [ ] Confirm device is factory-sealed
   - [ ] Inspect for any signs of tampering

**Parallel: Setup Checklist Preparation**

- [ ] Prepare setup environment checklist
- [ ] Gather backup materials (metal backup, recovery card)
- [ ] Identify secure location for setup
- [ ] Schedule key ceremony date

### Phase 2: Training and Hardware Setup (Week 2)

#### Step 3: Security Training

**Day 8-10: Interactive Training Sessions**

**Session 1: Key Management Fundamentals** (1.5 hours)

Topics:
- [ ] Hardware wallet architecture
- [ ] Seed phrase security
- [ ] PIN management
- [ ] Backup strategies
- [ ] Threat models
- [ ] Social engineering awareness

**Session 2: Operational Procedures** (1.5 hours)

Topics:
- [ ] Gnosis Safe interface walkthrough
- [ ] Transaction proposal and signing
- [ ] Signature collection
- [ ] Verification procedures
- [ ] Communication protocols
- [ ] Escalation paths

**Session 3: Role-Specific Training** (1 hour)

**For Admin Signers**:
- [ ] Configuration change procedures
- [ ] Fee parameter management
- [ ] Token and bridge approvals
- [ ] Pause/unpause procedures

**For Treasury Signers**:
- [ ] Withdrawal request procedures
- [ ] Spending limits
- [ ] Compliance requirements
- [ ] Audit trails

**For Emergency Responders**:
- [ ] Emergency detection
- [ ] Emergency pause procedures
- [ ] Incident escalation
- [ ] Communication during incidents
- [ ] Post-incident procedures

#### Step 4: Hardware Wallet Setup

**Day 11-12: Guided Setup Session**

**Pre-Setup Checklist**:
- [ ] Private, secure environment
- [ ] No cameras or observers (except authorized witness)
- [ ] Trusted computer with updated software
- [ ] Secure network connection
- [ ] Metal backup or recovery card ready
- [ ] ~2 hours uninterrupted time

**Guided Setup** (Video call with coordinator):

1. **Environment Preparation** (10 min)
   - [ ] Verify secure environment
   - [ ] Close unnecessary applications
   - [ ] Disable cameras/microphones (except primary communication)
   - [ ] Ready backup materials

2. **Device Initialization** (15 min)
   - [ ] Unbox and inspect device
   - [ ] Connect via USB
   - [ ] Select "Initialize as new device"
   - [ ] Create PIN (coordinator doesn't see)
   - [ ] Verify PIN creation

3. **Seed Phrase Generation** (30 min)
   - [ ] **Critical**: Coordinator turns off video/screen share
   - [ ] Signer generates seed phrase on device
   - [ ] Signer writes seed phrase on backup card
   - [ ] Signer verifies seed phrase on device
   - [ ] Signer stores backup securely
   - [ ] Coordinator resumes video (seed never shown)

4. **Address Generation** (10 min)
   - [ ] Install Ethereum app (if needed)
   - [ ] Derive first address
   - [ ] Verify address on device screen
   - [ ] Record address in signer roster
   - [ ] Coordinator verifies address matches

5. **Backup Verification** (5 min)
   - [ ] Signer confirms seed phrase backed up
   - [ ] Signer confirms backup stored securely
   - [ ] Coordinator witnesses (without seeing seed)
   - [ ] Sign attestation form

**Post-Setup**:
- [ ] Disconnect and store hardware wallet securely
- [ ] Document setup completion
- [ ] Add address to signer roster
- [ ] Schedule access provisioning

### Phase 3: Access and Testing (Week 3)

#### Step 5: Access Provisioning

**Day 15-16: Grant Access**

1. **Communication Channels**
   - [ ] Add to emergency Telegram group (all signers)
   - [ ] Add to role-specific Telegram group
   - [ ] Add to email distribution list
   - [ ] Provide PagerDuty access (Emergency Responders)

2. **Documentation Access**
   - [ ] Access to secure document repository
   - [ ] Access to signer handbook
   - [ ] Access to procedure documentation

3. **Multisig Access** (Will occur during key ceremony)
   - Gnosis Safe access granted when added as signer
   - Not applicable during onboarding (happens at key ceremony)

#### Step 6: Testnet Testing

**Day 17-20: Practice on Testnet**

**Objective**: Gain confidence before handling real assets

1. **Setup Testnet Access**
   - [ ] Connect wallet to Base Sepolia
   - [ ] Get testnet ETH from faucet
   - [ ] Access testnet Gnosis Safe

2. **Practice Transaction Flows**

**Exercise 1: View Multisig** (15 min)
   - [ ] Connect hardware wallet to Safe
   - [ ] View Safe details
   - [ ] Check signer list and threshold
   - [ ] Review transaction history

**Exercise 2: Propose Transaction** (30 min)
   - [ ] Create test transaction (send 0.001 ETH)
   - [ ] Verify details on device
   - [ ] Sign and propose
   - [ ] Verify transaction in queue

**Exercise 3: Co-Sign Transaction** (30 min)
   - [ ] Review pending transaction from coordinator
   - [ ] Verify transaction details
   - [ ] Sign with hardware wallet
   - [ ] Observe threshold progress

**Exercise 4: Execute Transaction** (30 min)
   - [ ] When threshold met, execute transaction
   - [ ] Pay gas fee
   - [ ] Verify transaction on block explorer
   - [ ] Confirm transaction completed successfully

**Exercise 5: Reject Transaction** (15 min)
   - [ ] Review inappropriate transaction
   - [ ] Reject in Safe UI
   - [ ] Verify rejection recorded

3. **Emergency Drill** (Emergency Responders Only) (45 min)
   - [ ] Receive simulated alert
   - [ ] Access Emergency Safe
   - [ ] Execute emergency pause on testnet
   - [ ] Verify protocol paused
   - [ ] Document response time
   - [ ] Debrief

**Evaluation**:
- [ ] All exercises completed successfully
- [ ] Response time acceptable for role
- [ ] Comfortable with procedures
- [ ] Hardware wallet functioning correctly

### Phase 4: Activation and Sign-off (Week 4)

#### Step 7: Final Assessment

**Day 21-22: Knowledge Check**

1. **Written Assessment** (30 min)
   - Security procedures
   - Operational workflows
   - Emergency procedures
   - Role-specific knowledge
   - Pass score: 90%

2. **Practical Assessment** (1 hour)
   - Demonstrate transaction signing
   - Explain verification procedures
   - Describe emergency response (if applicable)
   - Answer scenario-based questions

3. **Review and Feedback**
   - Address any knowledge gaps
   - Additional training if needed
   - Answer remaining questions

#### Step 8: Production Integration

**Day 23-25: Key Ceremony Participation**

See: [Key Ceremony Protocol](./key-ceremony.md)

**During Ceremony**:
- [ ] Participate in multisig creation (if new Safe)
- [ ] OR participate in signer addition (if joining existing Safe)
- [ ] Verify added as owner
- [ ] Test signing capability
- [ ] Confirm can access all required Safes

**After Ceremony**:
- [ ] Verify access to all multisigs for your role
- [ ] Test signing on mainnet (small test transaction)
- [ ] Update signer roster with final details
- [ ] Distribute welcome packet

#### Step 9: Onboarding Completion

**Day 26-28: Final Steps**

1. **Welcome Packet**
   - [ ] Final signer information card
   - [ ] Emergency contact list
   - [ ] Quick reference guide
   - [ ] Procedure documentation links

2. **Mentor Assignment**
   - [ ] Assign experienced signer as mentor
   - [ ] Schedule monthly check-ins for first 3 months
   - [ ] Provide direct contact for questions

3. **Sign-off Meeting** (30 min)
   - [ ] Review onboarding completion
   - [ ] Answer final questions
   - [ ] Set expectations for ongoing participation
   - [ ] Schedule first check-in

4. **Onboarding Documentation**
   - [ ] Complete onboarding checklist
   - [ ] Sign onboarding completion form
   - [ ] Archive onboarding records
   - [ ] Update signer roster to "Active"

---

## Training Program

### Initial Training (Weeks 2-3)

**Total**: ~8 hours
- Security Fundamentals: 1.5 hours
- Operational Procedures: 1.5 hours
- Role-Specific Training: 1 hour
- Hardware Setup: 2 hours
- Testnet Practice: 2 hours

### Ongoing Training

**Monthly** (First 3 Months):
- 30-minute check-in with mentor
- Review any new procedures
- Practice testnet transactions
- Q&A session

**Quarterly** (All Signers):
- Participate in emergency drill
- Security updates training
- Procedure updates review
- Refresher on best practices

**Annually**:
- Comprehensive security training update
- Advanced topics (e.g., MEV, bridge security)
- Threat landscape review
- New tool training

---

## Hardware Setup

### Setup Checklist

See detailed steps in [Phase 2: Hardware Setup](#step-4-hardware-wallet-setup)

**Quick Reference**:
1. ✅ Verify device authentic and unopened
2. ✅ Initialize in secure environment
3. ✅ Create strong PIN
4. ✅ Generate and backup 24-word seed phrase
5. ✅ Verify seed phrase on device
6. ✅ Store backup in secure location
7. ✅ Install Ethereum app
8. ✅ Generate and record address
9. ✅ Test device functionality

### Common Setup Issues

**Issue: Device not recognized**
- Solution: Try different USB cable/port, install drivers

**Issue: Firmware update required**
- Solution: Follow official update process carefully

**Issue: Unsure about security**
- Solution: Contact coordinator, review documentation

---

## Access Provisioning

### Communication Access

**All Signers Receive**:
- [ ] Emergency Telegram group access
- [ ] Role-specific Telegram group access
- [ ] Email distribution list
- [ ] Secure document repository access

**Emergency Responders Also Receive**:
- [ ] PagerDuty account
- [ ] Alert system access
- [ ] Emergency contacts list
- [ ] Incident response tools

### Multisig Access

**Granted During Key Ceremony**:
- Added as owner to appropriate Gnosis Safe(s)
- Threshold voting rights activated
- Transaction history visible
- Proposal and signing capabilities enabled

### Revocation Procedures

**If Onboarding Cancelled**:
- Remove from all communication channels
- Revoke document access
- Do not add to multisigs
- Secure hardware wallet (if provided, request return)

---

## Testing and Verification

### Testnet Testing Scenarios

**Scenario 1: Normal Operations**
- Propose and sign configuration change
- Review and approve another signer's proposal
- Execute transaction when threshold met

**Scenario 2: Multi-Party Coordination**
- Coordinate with other signers to collect signatures
- Use communication channels appropriately
- Track signature collection progress

**Scenario 3: Rejection Flow**
- Identify problematic transaction
- Reject appropriately
- Communicate rejection reason

**Scenario 4: Emergency Response** (Emergency Responders)
- Respond to simulated alert
- Execute emergency pause
- Communicate with team
- Document actions

### Success Criteria

Before mainnet access:
- [ ] All testnet exercises completed successfully
- [ ] Response time meets role SLA
- [ ] Comfortable with all procedures
- [ ] Hardware wallet functioning properly
- [ ] Security practices demonstrated
- [ ] Assessment passed (90%+)

---

## Ongoing Responsibilities

### Regular Duties

**Daily** (Emergency Responders Only):
- Monitor alerts and be available for emergency response

**Weekly** (All Signers):
- Check for pending multisig transactions
- Monitor communication channels

**As Needed**:
- Review and sign proposed transactions
- Participate in multisig operations
- Respond to coordination requests
- Attend emergency calls

### Meetings and Reviews

**Monthly** (First 3 Months):
- Check-in with mentor
- Review performance
- Address questions

**Quarterly** (Admin Signers):
- Key rotation (if applicable)
- Security review
- Emergency drill
- Process improvements

**Semi-Annually** (Treasury Signers):
- Key rotation (if applicable)
- Treasury audit
- Spending review
- Process improvements

**Annually** (All Signers):
- Comprehensive training update
- Access review
- Security audit
- Performance review

### Professional Development

**Encouraged Activities**:
- Attend blockchain security conferences
- Complete Web3 security certifications
- Participate in security research
- Contribute to protocol improvements
- Engage with DeFi security community

**Reimbursable** (with approval):
- Relevant security training courses
- Hardware wallet backups
- Conference attendance
- Security tools/subscriptions

---

## Offboarding Process

### Planned Offboarding

**4 Weeks Before Departure**:
1. [ ] Notify leadership of planned departure
2. [ ] Identify replacement signer
3. [ ] Begin replacement onboarding
4. [ ] Transfer knowledge

**2 Weeks Before**:
1. [ ] Complete pending transactions
2. [ ] Document institutional knowledge
3. [ ] Introduce replacement to team

**Departure Week**:
1. [ ] Participate in key rotation ceremony
2. [ ] Verify replacement added to multisig
3. [ ] Remove self from multisig
4. [ ] Securely destroy keys (wipe device, destroy backup)

**After Departure**:
1. [ ] Revoke all access
2. [ ] Remove from communication channels
3. [ ] Archive records
4. [ ] Update documentation

### Emergency Offboarding

**Immediate** (for cause, security incident, or emergency):
1. [ ] Remove from multisig (requires threshold)
2. [ ] Revoke all access immediately
3. [ ] Change communication credentials
4. [ ] Security audit
5. [ ] Incident report (if applicable)

### Key Destruction

**Required Steps**:
1. [ ] Factory reset hardware wallet (wipe seed phrase)
2. [ ] Destroy physical seed phrase backup
   - Shred paper backup
   - OR melt/destroy metal backup
   - OR pulverize/dispose securely
3. [ ] Confirm destruction to security team
4. [ ] Sign key destruction attestation

**Never**:
- Keep hardware wallet with old protocol keys
- Store old seed phrases "just in case"
- Delay key destruction

---

## Resources

### Documentation

**Core Procedures**:
- [Multisig Setup Guide](./multisig-setup.md)
- [Key Ceremony Protocol](./key-ceremony.md)
- [Key Management Runbook](./key-management-runbook.md)
- [Emergency Response Playbook](./emergency-response-playbook.md)

**External Resources**:
- [Ledger User Guide](https://www.ledger.com/academy)
- [Trezor User Guide](https://wiki.trezor.io/)
- [Gnosis Safe Documentation](https://docs.safe.global/)
- [Ethereum.org Security](https://ethereum.org/en/security/)

### Tools and Interfaces

**Required**:
- Gnosis Safe: https://app.safe.global
- Block Explorers:
  - Ethereum: https://etherscan.io
  - Base: https://basescan.org
  - Testnets: Sepolia variants

**Communication**:
- Telegram (encrypted messaging)
- PagerDuty (for Emergency Responders)
- Email (for non-sensitive communications)

**Optional but Recommended**:
- Tenderly (transaction simulation)
- Defender (monitoring)
- Hardware wallet apps (Ledger Live, Trezor Suite)

### Support Contacts

**Technical Support**:
- Hardware Wallet Coordinator: [Contact]
- Multisig Operations Lead: [Contact]

**Security**:
- Security Team Lead: [Contact]
- Emergency Hotline: [Number]

**Administrative**:
- Onboarding Coordinator: [Contact]
- HR/Legal: [Contact]

---

## Appendices

### Appendix A: Onboarding Checklist

```markdown
## New Signer Onboarding Checklist

**Signer Name**: _________________
**Role**: Level [ ] 2 / [ ] 3 / [ ] 4
**Start Date**: _________________

### Phase 1: Vetting (Week 1)
- [ ] Application received
- [ ] Initial screening call
- [ ] Background check completed (if req.)
- [ ] Security briefing attended
- [ ] Documentation reviewed
- [ ] Security questionnaire passed (80%+)
- [ ] NDA/agreements signed
- [ ] Hardware wallet ordered

### Phase 2: Training (Week 2)
- [ ] Security training completed
- [ ] Operational training completed
- [ ] Role-specific training completed
- [ ] Hardware wallet received
- [ ] Hardware wallet setup completed
- [ ] Address generated and recorded
- [ ] Seed phrase backed up

### Phase 3: Testing (Week 3)
- [ ] Communication access granted
- [ ] Testnet testing completed
  - [ ] View multisig
  - [ ] Propose transaction
  - [ ] Co-sign transaction
  - [ ] Execute transaction
  - [ ] Reject transaction
  - [ ] Emergency drill (Emergency Responders)
- [ ] All exercises passed

### Phase 4: Activation (Week 4)
- [ ] Final assessment passed (90%+)
- [ ] Key ceremony participated
- [ ] Added to production multisig(s)
- [ ] Mainnet signing tested
- [ ] Welcome packet distributed
- [ ] Mentor assigned
- [ ] Sign-off meeting completed
- [ ] Onboarding completion form signed

**Onboarding Completed**: [ ] Yes / [ ] No
**Date**: _________________
**Coordinator Signature**: _________________
**Signer Signature**: _________________
```

### Appendix B: Assessment Questions (Sample)

**Security Knowledge**:
1. What should you NEVER do with your seed phrase?
2. How do you verify a transaction is safe to sign?
3. What do you do if you suspect your key is compromised?

**Operational Knowledge**:
4. What is the threshold for your multisig?
5. How do you propose a transaction in Gnosis Safe?
6. When should you reject a transaction?

**Role-Specific**:
7. (Admin) What parameters can you change in Router402?
8. (Treasury) What are the withdrawal limits?
9. (Emergency) When should you execute emergency pause?

**Scenario-Based**:
10. A transaction proposes to withdraw $500k to an unknown address. What do you do?

### Appendix C: Signer Information Card Template

```
═══════════════════════════════════════
   402.VLN.GG SIGNER INFORMATION
═══════════════════════════════════════

Signer: [NAME]
Role: Level [2/3/4] - [Admin/Treasury/Emergency]
Address: 0x...
Joined: [DATE]

EMERGENCY CONTACTS
─────────────────────────────────────
Security Team: [ENCRYPTED]
Emergency Hotline: [ENCRYPTED]
Mentor: [NAME] - [CONTACT]

QUICK REFERENCE
─────────────────────────────────────
Gnosis Safe: app.safe.global
Testnet Safe: [ADDRESS]
Mainnet Safe: [ADDRESS]

Response SLA: [TIME]
Hardware Wallet: [LEDGER/TREZOR]

═══════════════════════════════════════
     CONFIDENTIAL - DO NOT SHARE
═══════════════════════════════════════
```

### Appendix D: Related Documentation

- [Multisig Setup Guide](./multisig-setup.md)
- [Key Ceremony Protocol](./key-ceremony.md)
- [Key Management Runbook](./key-management-runbook.md)
- [Emergency Response Playbook](./emergency-response-playbook.md)

---

**Document Version**: 1.0.0
**Last Updated**: December 21, 2025
**Next Review**: March 21, 2026
**Classification**: INTERNAL
**Owner**: Operations Team

**Required for**: All new signers before receiving production access
**Updates Required**: After any onboarding process changes
**Feedback Mechanism**: Survey all new signers post-onboarding
