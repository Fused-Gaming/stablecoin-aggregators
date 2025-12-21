# Overview

## Introduction

The Stablecoin Aggregator smart contracts enable efficient cross-chain stablecoin routing with integrated x402 micropayment fees. This system allows users to swap stablecoins across multiple blockchain networks with minimal friction and competitive fees.

## Key Features

- **Cross-Chain Routing**: Support for Ethereum, Base, and other EVM-compatible chains
- **Micropayment Fees**: Integrated x402-style fee structure (0.2% default)
- **Bridge Integration**: Compatible with Socket, LayerZero, and other bridge protocols
- **Security Features**: ReentrancyGuard, pausable mechanisms, multisig treasury
- **Gas Optimization**: Compiled with IR optimizer for efficient execution

## Architecture Components

### Router402
The main routing contract that handles:
- Cross-chain stablecoin swaps
- Fee calculation and collection
- Bridge integration
- Emergency controls

### FeeCollector402
A simple fee collector for off-chain routing scenarios that provides:
- Base fee collection
- Custom fee handling
- Admin controls

### Treasury402
A 2/3 multisig treasury that manages:
- Fee withdrawal approvals
- Multi-signature security
- Treasury operations

## Supported Networks

- **Ethereum Mainnet**: USDC, USDT
- **Base**: USDC, USDT
- **Future Support**: TON, Monad, Solana

## Use Cases

1. **Cross-Chain Stablecoin Transfers**: Move USDC/USDT between chains efficiently
2. **DeFi Arbitrage**: Execute arbitrage strategies across chains
3. **Payment Routing**: Enable seamless cross-chain payments
4. **Liquidity Aggregation**: Access best rates across multiple chains

## Getting Started

See [Deployment Guide](deployment.md) for setup instructions and [API Reference](api-reference.md) for integration details.
