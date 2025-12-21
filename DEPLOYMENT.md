# Deployment Checklist for 402.vln.gg Contracts

## Pre-Deployment

### Environment Setup
- [ ] Create `.env` file from `.env.example`
- [ ] Add PRIVATE_KEY (deployment wallet)
- [ ] Add TREASURY_ADDRESS (multisig recommended)
- [ ] Add RPC URLs (Alchemy/Infura)
- [ ] Add API keys (Basescan/Etherscan)
- [ ] Fund deployment wallet with ETH for gas

### Code Review
- [ ] Review all contract code
- [ ] Run `npm install`
- [ ] Run `npm run compile` successfully
- [ ] Run `npm test` - all tests pass
- [ ] Run `npm run coverage` - check coverage
- [ ] Run `npm run gas-report` - review gas costs

### Configuration
- [ ] Verify treasury address is correct
- [ ] Verify fee basis points (20 = 0.2%)
- [ ] Verify token addresses for network
- [ ] Verify bridge addresses for network
- [ ] Verify daily volume limits

## Testnet Deployment (Base Sepolia)

### Deploy
- [ ] Run `npm run deploy:base-sepolia`
- [ ] Save deployment addresses
- [ ] Verify contracts on Basescan Sepolia
- [ ] Fund test wallet with USDC/USDT

### Configure
- [ ] Call `setSupportedToken(USDC, true)`
- [ ] Call `setSupportedToken(USDT, true)`
- [ ] Call `setApprovedBridge(Socket, true)`
- [ ] Verify all configurations

### Test on Testnet
- [ ] Test small swap (10 USDC)
- [ ] Test fee collection
- [ ] Test pause/unpause
- [ ] Test emergency functions
- [ ] Monitor events in block explorer
- [ ] Test with multiple users
- [ ] Test daily volume limits

## Mainnet Deployment (Base)

### Pre-flight Checks
- [ ] All testnet tests passed
- [ ] Code freeze (no changes from testnet)
- [ ] Treasury multisig set up (2/3 recommended)
- [ ] Deployment wallet has 0.05+ ETH
- [ ] Double-check all addresses

### Deploy Contracts
- [ ] Run `npm run deploy:base`
- [ ] IMMEDIATELY save all addresses
- [ ] Transfer ownership to multisig
- [ ] Verify contracts on Basescan

### Configuration
- [ ] Add USDC support
- [ ] Add USDT support
- [ ] Approve Socket router
- [ ] Set initial limits conservatively
- [ ] Test with $10 swap

### Security
- [ ] Renounce direct ownership (use multisig)
- [ ] Set up monitoring alerts
- [ ] Document emergency procedures
- [ ] Share addresses with team
- [ ] Backup deployment info

## Post-Deployment

### Monitoring
- [ ] Set up Tenderly for transaction monitoring
- [ ] Create Dune dashboard for analytics
- [ ] Monitor first 24 hours closely
- [ ] Check gas costs vs estimates
- [ ] Monitor fee collection

### Integration
- [ ] Update frontend with addresses
- [ ] Update API with addresses
- [ ] Test end-to-end user flow
- [ ] Update documentation
- [ ] Announce deployment

### Gradual Rollout
- [ ] Week 1: Max $100 per swap
- [ ] Week 2: Max $1,000 per swap
- [ ] Week 3: Max $10,000 per swap
- [ ] Week 4: Max $100,000 per swap
- [ ] Month 2: Remove limits if stable

## Emergency Procedures

### If Exploit Detected
1. Call `setEmergencyPause(true)` immediately
2. Call `pause()` for additional safety
3. Investigate issue
4. Do NOT withdraw funds until issue understood
5. Coordinate with multisig owners

### If Funds Stuck
1. Verify it's actually stuck (not in-flight)
2. Get multisig approval
3. Call `emergencyWithdraw(token, amount, recipient)`
4. Document what happened

### If Bridge Fails
1. Temporarily disable bridge: `setApprovedBridge(bridge, false)`
2. Communicate to users
3. Monitor for resolution
4. Re-enable when safe

## Verification Commands

```bash
# Router402
npx hardhat verify --network base <ROUTER_ADDRESS> <TREASURY> <FEE_BPS>

# FeeCollector402
npx hardhat verify --network base <FEE_COLLECTOR_ADDRESS> <TREASURY> <USDC> <BASE_FEE>

# Treasury402
npx hardhat verify --network base <TREASURY_ADDRESS> <OWNER1> <OWNER2> <OWNER3>
```

## Deployment Addresses

### Base Sepolia (Testnet)
- Router402: `TBD`
- FeeCollector402: `TBD`
- Treasury402: `TBD`
- Deployed: `TBD`

### Base Mainnet
- Router402: `TBD`
- FeeCollector402: `TBD`
- Treasury402: `TBD`
- Deployed: `TBD`

## Contact Info

- Emergency Contact: [your telegram/phone]
- Team Lead: [email]
- Multisig Signers:
  1. [name] - [contact]
  2. [name] - [contact]
  3. [name] - [contact]

## Audit Status

- [ ] Internal review complete
- [ ] External audit scheduled
- [ ] Audit findings addressed
- [ ] Final audit report received
- [ ] Public audit published

---

**Remember**: Take your time. Better to delay than deploy with issues.
