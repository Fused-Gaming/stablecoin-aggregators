# Stablecoin Aggregator Contracts

Smart contracts for cross-chain stablecoin routing with x402 micropayments.

https://402.vln.gg/


**Built by Fused-Gaming**

## Overview

This repository contains production-ready smart contracts for routing stablecoins across multiple chains with integrated x402-style micropayment fees.

### Contracts

- **Router402.sol** - Main routing contract with fee collection and bridge integration
- **FeeCollector402.sol** - Simple fee collector for off-chain routing
- **Treasury402.sol** - 2/3 multisig treasury for fee management

## Features

- ✅ Cross-chain stablecoin routing (ETH, Base, TON, Monad)
- ✅ Integrated x402 micropayment fees (0.2% default)
- ✅ Socket API & LayerZero integration
- ✅ Daily volume limits (anti-abuse)
- ✅ Emergency pause functionality
- ✅ Multisig treasury
- ✅ Gas optimized (via IR compilation)

## Supported Chains

- Ethereum Mainnet
- Base
- TON (via bridge)
- Monad (coming Q1 2025)
- Solana

## Installation

```bash
npm install
```

## Configuration

Create `.env` file:

```bash
# Deployment
PRIVATE_KEY=your_private_key_here
TREASURY_ADDRESS=0x_your_multisig_here

# RPC URLs
BASE_RPC_URL=https://mainnet.base.org
ETH_RPC_URL=https://eth.llamarpc.com

# API Keys
BASESCAN_API_KEY=your_basescan_key
ETHERSCAN_API_KEY=your_etherscan_key
```

## Deployment

### Testnet (Base Sepolia)

```bash
npm run deploy:base-sepolia
```

### Mainnet (Base)

```bash
npm run deploy:base
```

### Verify Contracts

```bash
npx hardhat verify --network base <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## Testing

```bash
# Run all tests
npm test

# Run with gas reporting
npm run gas-report

# Run coverage
npm run coverage
```

## Contract Architecture

```
Router402
├── swap() - Execute cross-chain swap with any bridge
├── swapViaSocket() - Simplified Socket-only swap
├── calculateFee() - Get fee for amount
└── Admin functions (pause, config, emergency)

FeeCollector402
├── payFee() - Pay base fee for quote
├── payCustomFee() - Pay variable fee
└── Admin functions

Treasury402
├── approveWithdrawal() - 2/3 multisig approval
└── View functions
```

## Fee Structure

- **Default Fee**: 0.2% (20 basis points)
- **Maximum Fee**: 1.0% (100 basis points)
- **Minimum Swap**: $1 USDC
- **Maximum Swap**: $1M USDC
- **Daily Limit**: $100K per user (configurable)

## Supported Tokens

### Base
- USDC: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- USDT: `0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2`

### Ethereum
- USDC: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
- USDT: `0xdAC17F958D2ee523a2206206994597C13D831ec7`

## Approved Bridges

- **Socket Router (Base)**: `0x3a23F943181408EAC424116Af7b7790c94Cb97a5`
- More bridges configurable by admin

## Security Features

- ✅ ReentrancyGuard on all swap functions
- ✅ Pausable for emergency situations
- ✅ Separate emergency pause mechanism
- ✅ Daily volume limits per user
- ✅ Ownable2Step for safe ownership transfer
- ✅ SafeERC20 for token interactions
- ✅ Custom errors for gas efficiency
- ✅ Input validation on all parameters

## Gas Optimization

Compiled with IR optimizer enabled:
- Typical swap: ~150K gas
- Fee collection: ~50K gas
- Socket integration: ~200K gas total

## Emergency Procedures

### Pause Contract
```solidity
router.pause(); // Standard pause
router.setEmergencyPause(true); // Emergency pause
```

### Withdraw Stuck Tokens
```solidity
router.emergencyWithdraw(token, amount, recipient);
```

### Update Treasury
```solidity
router.setTreasury(newTreasuryAddress);
```

## Integration Example

```typescript
import { Router402 } from "./typechain-types";

// Get quote
const fee = await router.calculateFee(amount);
const netAmount = amount - fee;

// Execute swap
const tx = await router.swapViaSocket(
  usdcAddress,
  amount,
  socketRouterAddress,
  socketCalldata
);

await tx.wait();
```

## Roadmap

- [x] Phase 1: Core contracts (Router, FeeCollector, Treasury)
- [x] Phase 2: Socket integration
- [ ] Phase 3: LayerZero direct integration
- [ ] Phase 4: TON bridge support
- [ ] Phase 5: Monad mainnet launch
- [ ] Phase 6: Security audit
- [ ] Phase 7: Governance token

## License

MIT License - see LICENSE file

## Audit Status

⚠️ **Not yet audited** - Use at your own risk

Audit planned for Q1 2025 after initial deployment and testing.

## Contact

- GitHub: [Fused-Gaming/stablecoin-aggregators](https://github.com/Fused-Gaming/stablecoin-aggregators)
- Organization: [Fused-Gaming](https://github.com/Fused-Gaming)

## Contributing

Contributions welcome! Please open an issue or PR.

## Disclaimer

This software is provided "as is" without warranty. Use at your own risk. Always test on testnet first.
