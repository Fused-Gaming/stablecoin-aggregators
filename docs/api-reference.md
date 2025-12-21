# API Reference

## Router402 Contract

### Swap Functions

#### `swap(address token, uint256 amount, address bridge, bytes calldata data)`

Execute a cross-chain swap using any approved bridge.

**Parameters:**
- `token` - Address of the stablecoin to swap
- `amount` - Amount to swap (in token decimals)
- `bridge` - Address of the approved bridge contract
- `data` - Encoded bridge-specific calldata

**Returns:** None

**Events:**
- `Swap(address indexed user, address indexed token, uint256 amount, uint256 fee)`

**Example:**
```solidity
router.swap(
    usdcAddress,
    1000e6, // 1000 USDC
    socketRouterAddress,
    bridgeCalldata
);
```

---

#### `swapViaSocket(address token, uint256 amount, address socketRouter, bytes calldata socketData)`

Simplified swap function specifically for Socket integration.

**Parameters:**
- `token` - Address of the stablecoin
- `amount` - Amount to swap
- `socketRouter` - Address of Socket router
- `socketData` - Socket-specific calldata

**Returns:** None

**Example:**
```solidity
router.swapViaSocket(
    usdcAddress,
    1000e6,
    socketRouterAddress,
    socketCalldata
);
```

### Fee Functions

#### `calculateFee(uint256 amount) → uint256`

Calculate the fee for a given swap amount.

**Parameters:**
- `amount` - Swap amount

**Returns:**
- Fee amount in same decimals as input

**Example:**
```solidity
uint256 fee = router.calculateFee(1000e6); // Returns 2e6 (0.2%)
uint256 netAmount = amount - fee;
```

---

#### `setFeeBps(uint256 newFeeBps)`

Set the fee in basis points (admin only).

**Parameters:**
- `newFeeBps` - New fee in basis points (e.g., 20 = 0.2%)

**Restrictions:**
- Only owner
- Maximum 100 bps (1.0%)

---

### Configuration Functions

#### `addApprovedBridge(address bridge)`

Add an approved bridge contract (admin only).

**Parameters:**
- `bridge` - Address of bridge to approve

---

#### `removeApprovedBridge(address bridge)`

Remove an approved bridge contract (admin only).

**Parameters:**
- `bridge` - Address of bridge to remove

---

#### `setTreasury(address newTreasury)`

Update the treasury address (admin only).

**Parameters:**
- `newTreasury` - New treasury contract address

---

#### `setDailyLimit(uint256 newLimit)`

Set daily swap limit per user (admin only).

**Parameters:**
- `newLimit` - New daily limit in token decimals

---

### Emergency Functions

#### `pause()`

Pause all swap operations (admin only).

---

#### `unpause()`

Unpause operations (admin only).

---

#### `setEmergencyPause(bool paused)`

Emergency pause override (admin only).

**Parameters:**
- `paused` - True to pause, false to unpause

---

#### `emergencyWithdraw(address token, uint256 amount, address recipient)`

Withdraw stuck tokens in emergency (admin only).

**Parameters:**
- `token` - Token address to withdraw
- `amount` - Amount to withdraw
- `recipient` - Address to receive tokens

---

### View Functions

#### `isApprovedBridge(address bridge) → bool`

Check if a bridge is approved.

---

#### `getDailyVolume(address user) → uint256`

Get user's daily swap volume.

---

#### `feeBps() → uint256`

Get current fee in basis points.

---

#### `treasury() → address`

Get treasury address.

---

## FeeCollector402 Contract

### Payment Functions

#### `payFee()`

Pay the standard base fee.

**Value:** Must send exact base fee amount in ETH

---

#### `payCustomFee(uint256 amount)`

Pay a custom fee amount.

**Parameters:**
- `amount` - Custom fee amount

**Value:** Must send exact amount in ETH

---

### Admin Functions

#### `setBaseFee(uint256 newFee)`

Set the base fee amount (admin only).

**Parameters:**
- `newFee` - New base fee in wei

---

#### `withdraw(address recipient, uint256 amount)`

Withdraw collected fees (admin only).

**Parameters:**
- `recipient` - Address to receive funds
- `amount` - Amount to withdraw

---

## Treasury402 Contract

### Withdrawal Functions

#### `approveWithdrawal(uint256 withdrawalId)`

Approve a withdrawal (signer only).

**Parameters:**
- `withdrawalId` - ID of withdrawal to approve

**Requirements:**
- Caller must be a signer
- 2 of 3 signers must approve

---

#### `proposeWithdrawal(address token, uint256 amount, address recipient) → uint256`

Propose a new withdrawal (signer only).

**Parameters:**
- `token` - Token to withdraw
- `amount` - Amount to withdraw
- `recipient` - Recipient address

**Returns:**
- ID of created withdrawal proposal

---

### View Functions

#### `getWithdrawal(uint256 id) → Withdrawal`

Get withdrawal details.

**Returns:**
- Withdrawal struct with token, amount, recipient, approvals, executed status

---

#### `isSigner(address account) → bool`

Check if address is a signer.

---

## Events

### Router402 Events

```solidity
event Swap(address indexed user, address indexed token, uint256 amount, uint256 fee);
event BridgeAdded(address indexed bridge);
event BridgeRemoved(address indexed bridge);
event TreasuryUpdated(address indexed newTreasury);
event FeeUpdated(uint256 newFeeBps);
event EmergencyWithdraw(address indexed token, uint256 amount, address indexed recipient);
```

### FeeCollector402 Events

```solidity
event FeePaid(address indexed user, uint256 amount);
event BaseFeeUpdated(uint256 newFee);
event Withdrawal(address indexed recipient, uint256 amount);
```

### Treasury402 Events

```solidity
event WithdrawalProposed(uint256 indexed id, address token, uint256 amount, address recipient);
event WithdrawalApproved(uint256 indexed id, address indexed signer);
event WithdrawalExecuted(uint256 indexed id);
```

## Error Codes

```solidity
error InvalidAmount();
error InvalidBridge();
error ExceededDailyLimit();
error InsufficientFee();
error UnauthorizedCaller();
error AlreadyExecuted();
error InsufficientApprovals();
```

## Integration Example

```typescript
import { ethers } from "ethers";
import { Router402__factory } from "./typechain-types";

// Setup
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const router = Router402__factory.connect(ROUTER_ADDRESS, signer);

// Calculate fee
const amount = ethers.parseUnits("1000", 6); // 1000 USDC
const fee = await router.calculateFee(amount);
console.log(`Fee: ${ethers.formatUnits(fee, 6)} USDC`);

// Approve token
const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
await usdc.approve(ROUTER_ADDRESS, amount);

// Execute swap
const tx = await router.swapViaSocket(
    USDC_ADDRESS,
    amount,
    SOCKET_ROUTER_ADDRESS,
    socketCalldata
);

await tx.wait();
console.log("Swap completed!");
```
