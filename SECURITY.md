# Security Policy

## Security Features

### Smart Contract Security

1. **ReentrancyGuard**: All swap functions protected against reentrancy attacks
2. **Pausable**: Emergency pause mechanism for critical situations
3. **Ownable2Step**: Safe ownership transfer with two-step process
4. **SafeERC20**: Safe token transfer operations
5. **Custom Errors**: Gas-efficient error handling
6. **Input Validation**: All parameters validated before processing

### Access Control

- **Owner**: Can configure tokens, bridges, fees, pause contract
- **Treasury**: Receives collected fees (should be multisig)
- **Users**: Can only execute swaps, no admin privileges

### Rate Limiting

- **Daily Volume Limits**: Default $100K per user per day
- **Minimum Swap**: $1 USDC (prevents dust attacks)
- **Maximum Swap**: $1M USDC (prevents excessive exposure)

### Emergency Mechanisms

1. **Standard Pause**: Prevents all swaps
2. **Emergency Pause**: Additional layer of security
3. **Emergency Withdraw**: Recover stuck tokens
4. **Bridge Disable**: Quickly disable compromised bridges

## Known Limitations

### Not Yet Audited

⚠️ **These contracts have not undergone a professional security audit.**

Use at your own risk. Audit planned for Q1 2025.

### Centralization Risks

- Contract owner has significant control
- Recommended to use multisig treasury
- Consider timelock for critical changes

### Bridge Dependencies

- Security depends on approved bridge contracts
- Socket, LayerZero, etc. have their own risks
- Monitor bridge security announcements

## Reporting a Vulnerability

### How to Report

**DO NOT** open a public issue for security vulnerabilities.

Instead:

1. **Email**: security@vln.gg (PGP key available on request)
2. **Twitter DM**: [@VLNSecurity](https://twitter.com/VLNSecurity)
3. **Telegram**: @VLNSec (verify it's actually us first)

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if you have one)
- Your contact info for follow-up

### Response Timeline

- **24 hours**: Initial acknowledgment
- **72 hours**: Preliminary assessment
- **7 days**: Detailed response with action plan
- **30 days**: Fix deployed (if valid critical issue)

### Bug Bounty

We currently offer responsible disclosure rewards:

- **Critical**: Up to $10,000
- **High**: Up to $5,000
- **Medium**: Up to $1,000
- **Low**: Recognition + swag

Severity assessed using CVSS 3.1.

### Scope

**In Scope:**
- Router402.sol
- FeeCollector402.sol
- Treasury402.sol
- Deployment scripts
- Integration code

**Out of Scope:**
- Third-party contracts (Socket, LayerZero, etc.)
- Frontend code
- Already known issues
- Social engineering

## Security Best Practices for Users

### Before Swapping

1. **Verify Contract Address**: Always check you're interacting with official contract
2. **Start Small**: Test with small amounts first
3. **Check Allowances**: Review token approvals
4. **Understand Fees**: Know the fee structure (0.2% default)

### During Swap

1. **Review Transaction**: Check recipient, amount, fees
2. **Set Slippage**: Use appropriate slippage tolerance
3. **Monitor Status**: Wait for confirmation before closing tab
4. **Save TX Hash**: Keep record of transaction

### After Swap

1. **Verify Receipt**: Check tokens arrived at destination
2. **Revoke Approvals**: Consider revoking unused approvals
3. **Report Issues**: Contact us if something went wrong

## Security Checklist for Integrators

If you're integrating 402.vln.gg contracts:

- [ ] Read all contract code
- [ ] Understand fee structure
- [ ] Implement proper error handling
- [ ] Add transaction confirmations
- [ ] Show clear user warnings
- [ ] Monitor for failed transactions
- [ ] Have emergency procedures
- [ ] Test on testnet first
- [ ] Implement rate limiting
- [ ] Log all transactions

## Incident Response Plan

### Detection

Monitoring for:
- Unusual transaction patterns
- High gas consumption
- Failed transactions spike
- Fee collection anomalies
- User reports

### Response

1. **Assess severity** (Critical/High/Medium/Low)
2. **Activate pause** if needed
3. **Notify multisig signers**
4. **Investigate root cause**
5. **Implement fix**
6. **Test thoroughly**
7. **Deploy with multisig approval**
8. **Communicate to users**

### Critical Incident

If critical vulnerability found:

1. Immediately pause all contracts
2. Alert multisig team
3. Do NOT publicly disclose details
4. Coordinate fix with security team
5. Deploy fix ASAP
6. Retrospective after resolution

## Security Updates

Subscribe to security updates:

- **Twitter**: [@VLNSecurity](https://twitter.com/VLNSecurity)
- **Telegram**: t.me/vlnsecurity
- **GitHub**: Watch this repository

## Audit History

### Planned

- **Q1 2025**: Initial security audit
- **Q2 2025**: Follow-up audit after mainnet

### Completed

- None yet

## Dependencies

### OpenZeppelin Contracts

Using OpenZeppelin v5.0.1:
- Ownable2Step
- ReentrancyGuard
- Pausable
- SafeERC20

These are industry-standard, audited contracts.

### External Calls

Contracts make external calls to:
- Socket router
- LayerZero endpoints
- ERC20 tokens

Always verify these addresses match official deployments.

## Additional Resources

- [OpenZeppelin Security](https://docs.openzeppelin.com/contracts/4.x/api/security)
- [Consensys Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [Ethereum Security Guide](https://ethereum.org/en/developers/docs/smart-contracts/security/)

## Responsible Disclosure

We believe in responsible disclosure. If you find a vulnerability:

1. Give us reasonable time to fix (usually 30 days)
2. Don't exploit it
3. Don't share it publicly until fixed
4. Work with us to verify the fix

We commit to:

1. Acknowledge reports within 24 hours
2. Keep you updated on progress
3. Credit you in fixes (if desired)
4. Pay bounties for valid findings
5. Work in good faith

---

**Last Updated**: December 21, 2024

For questions: security@vln.gg
