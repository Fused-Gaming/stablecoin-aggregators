# Deployment Guide

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- Hardhat
- Private key with funds for deployment
- RPC endpoints for target networks
- Etherscan/Basescan API keys for verification

## Installation

```bash
# Clone the repository
git clone https://github.com/Fused-Gaming/stablecoin-aggregators.git
cd stablecoin-aggregators

# Install dependencies
npm install
```

## Environment Setup

Create a `.env` file in the project root:

```bash
# Deployment
PRIVATE_KEY=your_private_key_here
TREASURY_ADDRESS=0x_your_multisig_here

# RPC URLs
BASE_RPC_URL=https://mainnet.base.org
ETH_RPC_URL=https://eth.llamarpc.com

# API Keys (for contract verification)
BASESCAN_API_KEY=your_basescan_key
ETHERSCAN_API_KEY=your_etherscan_key
```

**Security Note**: Never commit `.env` files. Ensure `.env` is in your `.gitignore`.

## Compile Contracts

```bash
npm run compile
```

This will compile all contracts with IR optimization enabled.

## Testing

Before deployment, run the full test suite:

```bash
# Run all tests
npm test

# Run with gas reporting
npm run gas-report

# Generate coverage report
npm run coverage
```

## Deployment

### Testnet Deployment (Base Sepolia)

```bash
npm run deploy:base-sepolia
```

This will deploy all three contracts:
1. Treasury402
2. FeeCollector402
3. Router402

Save the deployed contract addresses for verification.

### Mainnet Deployment (Base)

```bash
npm run deploy:base
```

### Ethereum Mainnet Deployment

```bash
npm run deploy:ethereum
```

## Contract Verification

After deployment, verify contracts on block explorers:

```bash
# Verify Router402
npx hardhat verify --network base <ROUTER_ADDRESS> <TREASURY_ADDRESS>

# Verify FeeCollector402
npx hardhat verify --network base <FEE_COLLECTOR_ADDRESS> <TREASURY_ADDRESS>

# Verify Treasury402
npx hardhat verify --network base <TREASURY_ADDRESS> <SIGNER1> <SIGNER2> <SIGNER3>
```

## Post-Deployment Configuration

### 1. Configure Approved Bridges

```bash
npx hardhat run scripts/configure-bridges.ts --network base
```

Or manually:
```solidity
router.addApprovedBridge(socketRouterAddress);
```

### 2. Configure Fee Parameters

```solidity
router.setFeeBps(20); // 0.2%
router.setMaxSwapAmount(1000000e6); // 1M USDC
router.setMinSwapAmount(1e6); // 1 USDC
```

### 3. Configure Daily Limits

```solidity
router.setDailyLimit(100000e6); // 100K USDC per day per user
```

### 4. Test Initial Swap

Run a small test swap to verify deployment:

```bash
npx hardhat run scripts/test-swap.ts --network base
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Contracts compiled successfully
- [ ] All tests passing
- [ ] Treasury multisig addresses ready
- [ ] Sufficient funds for deployment gas
- [ ] Deploy contracts
- [ ] Verify contracts on block explorer
- [ ] Configure approved bridges
- [ ] Set fee parameters
- [ ] Set volume limits
- [ ] Test small swap
- [ ] Monitor initial transactions
- [ ] Update frontend with new addresses

## Network-Specific Details

### Base Mainnet
- Chain ID: 8453
- Socket Router: `0x3a23F943181408EAC424116Af7b7790c94Cb97a5`
- USDC: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- USDT: `0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2`

### Ethereum Mainnet
- Chain ID: 1
- USDC: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
- USDT: `0xdAC17F958D2ee523a2206206994597C13D831ec7`

## Troubleshooting

### Deployment Fails
- Check private key has sufficient funds
- Verify RPC endpoint is accessible
- Ensure gas price is reasonable

### Verification Fails
- Check API key is correct
- Wait a few minutes after deployment
- Verify constructor arguments match deployment

### Contract Not Working
- Check contract is not paused
- Verify approved bridges are configured
- Ensure token approvals are set

## Security Recommendations

1. Use a hardware wallet for mainnet deployments
2. Deploy from a fresh, secure environment
3. Verify all contract addresses before configuration
4. Start with conservative limits
5. Monitor transactions closely after launch
6. Have emergency pause procedures ready
