# Architecture

## System Design

The Stablecoin Aggregator consists of three core smart contracts that work together to enable secure, efficient cross-chain stablecoin routing.

## Contract Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Router402                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  swap() - Main swap with any bridge                    │ │
│  │  swapViaSocket() - Simplified Socket integration       │ │
│  │  calculateFee() - Fee calculation                      │ │
│  │  Admin functions (pause, config, emergency)            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─────────────┐
                              │             │
                ┌─────────────▼───┐   ┌─────▼──────────────┐
                │ FeeCollector402 │   │   Treasury402      │
                │                 │   │                    │
                │  payFee()       │   │  approveWithdrawal │
                │  payCustomFee() │   │  2/3 Multisig      │
                └─────────────────┘   └────────────────────┘
```

## Router402 Contract

### Responsibilities
- Execute cross-chain swaps
- Collect and route fees
- Integrate with multiple bridges
- Enforce daily volume limits
- Emergency pause functionality

### Key Functions
- `swap(token, amount, bridge, data)` - Execute swap via any approved bridge
- `swapViaSocket(token, amount, router, data)` - Simplified Socket integration
- `calculateFee(amount)` - Calculate fee for given amount
- `pause()` - Standard pause mechanism
- `setEmergencyPause(bool)` - Emergency pause override
- `emergencyWithdraw(token, amount, recipient)` - Emergency token recovery

### Security Mechanisms
- ReentrancyGuard on all swap functions
- Ownable2Step for safe ownership transfer
- Daily volume limits per user
- Pausable for emergency situations
- SafeERC20 for token interactions

## FeeCollector402 Contract

### Responsibilities
- Collect fees for off-chain routing
- Support fixed and variable fee models
- Admin fee management

### Key Functions
- `payFee()` - Pay standard base fee
- `payCustomFee(amount)` - Pay variable fee
- Admin functions for configuration

## Treasury402 Contract

### Responsibilities
- Secure storage of collected fees
- Multi-signature approval for withdrawals
- Treasury management

### Design
- 2-of-3 multisig requirement
- Withdrawal approval system
- View functions for transparency

## Fee Structure

```
User Amount: 1000 USDC
Fee (0.2%):    2 USDC
Net Amount:  998 USDC
```

- Default Fee: 0.2% (20 basis points)
- Maximum Fee: 1.0% (100 basis points)
- Configurable by admin

## Bridge Integration

### Supported Bridges
- **Socket Router**: Primary bridge integration
- **LayerZero**: Planned integration
- **Custom Bridges**: Configurable by admin

### Integration Pattern
```solidity
function swap(
    address token,
    uint256 amount,
    address bridge,
    bytes calldata bridgeData
) external nonReentrant whenNotPaused {
    // Fee calculation and collection
    uint256 fee = calculateFee(amount);
    uint256 netAmount = amount - fee;

    // Execute bridge call
    (bool success, ) = bridge.call(bridgeData);
    require(success, "Bridge call failed");
}
```

## Gas Optimization

- Compiled with IR optimizer enabled
- Custom errors instead of revert strings
- Efficient storage patterns
- Minimal external calls

### Gas Costs
- Typical swap: ~150K gas
- Fee collection: ~50K gas
- Socket integration: ~200K gas total

## Security Considerations

1. **Reentrancy Protection**: All swap functions protected
2. **Access Control**: Owner-only admin functions
3. **Input Validation**: All parameters validated
4. **Emergency Controls**: Multiple pause mechanisms
5. **Token Safety**: SafeERC20 for all transfers
6. **Volume Limits**: Per-user daily limits

## Upgrade Path

Current contracts are not upgradeable by design. Future versions will require:
1. Deploy new contracts
2. Pause old contracts
3. Migrate treasury funds
4. Update frontend integrations

## Network Deployment

Contracts are deployed on:
- Ethereum Mainnet
- Base Mainnet
- Base Sepolia (testnet)

Each deployment maintains independent state and configuration.
