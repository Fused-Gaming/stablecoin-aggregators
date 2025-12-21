# Hardware Wallet Setup Guide

**Version**: 1.0.0
**Last Updated**: December 21, 2024
**Track**: M2 Track 3 - Hardware Wallet Integration

---

## Overview

This guide explains how to set up and use hardware wallets (Ledger or Trezor) for deploying and managing the 402.vln.gg smart contracts. Hardware wallets provide enhanced security by keeping your private keys offline.

**IMPORTANT**: Hardware wallet support is **optional**. You can use software wallets (private keys) for deployment and later upgrade to hardware wallets. This flexibility allows co-signers to participate without hardware wallets initially.

---

## Table of Contents

1. [Hardware Wallet Options](#hardware-wallet-options)
2. [Ledger Setup](#ledger-setup)
3. [Trezor Setup](#trezor-setup)
4. [Configuration](#configuration)
5. [Deployment with Hardware Wallet](#deployment-with-hardware-wallet)
6. [Migration from Software to Hardware Wallet](#migration-from-software-to-hardware-wallet)
7. [Best Practices](#best-practices)

---

## Hardware Wallet Options

### Supported Hardware Wallets

| Wallet | Support | Recommended | Notes |
|--------|---------|-------------|-------|
| **Ledger Nano S Plus** | ✅ Full | ✅ Yes | Most tested, reliable |
| **Ledger Nano X** | ✅ Full | ✅ Yes | Bluetooth optional |
| **Trezor Model T** | ✅ Full | ✅ Yes | Touchscreen interface |
| **Trezor One** | ✅ Full | ⚠️ Limited | No touchscreen |

### Comparison

| Feature | Ledger | Trezor |
|---------|--------|--------|
| Price | $79-$149 | $69-$219 |
| Open Source | Partial | Full |
| Setup Difficulty | Easy | Easy |
| Transaction Confirmation | Physical buttons | Physical buttons/Touchscreen |
| Our Testing | Extensive | Moderate |

**Recommendation**: We recommend **Ledger Nano S Plus** or **Ledger Nano X** for production deployments based on extensive testing.

---

## Ledger Setup

### Prerequisites

- Ledger device (Nano S Plus or Nano X)
- USB cable (included with device)
- Computer with USB port
- Internet connection (for initial setup only)

### Step 1: Initialize Your Ledger

1. **Unbox and connect** your Ledger device via USB
2. **Choose** "Set up as new device" (or restore from recovery phrase)
3. **Create PIN code** (4-8 digits)
   - ⚠️ **CRITICAL**: Do NOT lose this PIN
   - After 3 failed attempts, device will reset
4. **Write down recovery phrase** (24 words)
   - ⚠️ **CRITICAL**: Store in a secure location
   - Never share or photograph
   - This is the ONLY way to recover your funds

### Step 2: Install Ledger Live

1. Download Ledger Live from https://www.ledger.com/ledger-live
2. Install and open Ledger Live
3. Connect your Ledger device
4. Update firmware if prompted

### Step 3: Install Ethereum App

1. Open Ledger Live
2. Go to **Manager** (left sidebar)
3. Connect and unlock your Ledger
4. Search for "Ethereum"
5. Click **Install** on "Ethereum (ETH)"
6. Wait for installation to complete

### Step 4: Configure Ethereum App Settings

On your Ledger device:

1. Open the **Ethereum** app
2. Go to **Settings** (navigate with buttons)
3. Enable:
   - ✅ **Blind signing**: Required for contract deployments
   - ✅ **Contract data**: Required for smart contracts
   - ❌ **Debug data**: Keep disabled for security

### Step 5: Get Your Ethereum Address

**Method 1: Using Ledger Live**
1. Open Ledger Live
2. Go to **Accounts**
3. Click **Add account**
4. Select **Ethereum**
5. Your address will be displayed

**Method 2: Using our deployment script**
```bash
# Set up environment
USE_HARDWARE_WALLET=true
HARDWARE_WALLET_TYPE=ledger

# Run script to display address
npm run deploy:hw:base-sepolia
```

The script will display your Ledger address before deployment.

### Step 6: Derivation Paths (Advanced)

Default derivation path: `m/44'/60'/0'/0/0`

To use a different account:
```bash
# Account 0: m/44'/60'/0'/0/0 (default)
# Account 1: m/44'/60'/0'/0/1
# Account 2: m/44'/60'/0'/0/2
```

Update `.env`:
```
LEDGER_DERIVATION_PATH=m/44'/60'/0'/0/1
```

---

## Trezor Setup

### Prerequisites

- Trezor device (Model T or One)
- USB cable (included with device)
- Computer with USB port
- Internet connection

### Step 1: Initialize Your Trezor

1. **Connect** Trezor via USB
2. Visit https://trezor.io/start
3. **Install Trezor Bridge** (required for communication)
4. **Choose** "Create new wallet"
5. **Create PIN** (4-9 digits)
6. **Write down recovery seed** (12 or 24 words)
   - ⚠️ **CRITICAL**: Store securely
   - Only way to recover funds

### Step 2: Install Trezor Suite (Optional)

1. Download from https://trezor.io/trezor-suite
2. Install and open
3. Connect Trezor
4. Update firmware if needed

### Step 3: Configure for Ethereum

1. Connect Trezor
2. Enter PIN
3. Trezor will automatically support Ethereum
4. No app installation needed (unlike Ledger)

### Step 4: Get Your Ethereum Address

Using our deployment script:
```bash
# Set up environment
USE_HARDWARE_WALLET=true
HARDWARE_WALLET_TYPE=trezor

# Run to see address
npm run deploy:hw:base-sepolia
```

---

## Configuration

### Environment Variables

Create or update `.env` file:

#### For Software Wallet (Default)
```bash
# Software wallet deployment
USE_HARDWARE_WALLET=false
PRIVATE_KEY=your_private_key_here
```

#### For Ledger Hardware Wallet
```bash
# Ledger hardware wallet deployment
USE_HARDWARE_WALLET=true
HARDWARE_WALLET_TYPE=ledger
LEDGER_ADDRESS=0xYourLedgerAddress  # Optional, for verification
LEDGER_DERIVATION_PATH=m/44'/60'/0'/0/0  # Optional, default shown

# Network configuration
BASE_RPC_URL=https://mainnet.base.org
TREASURY_ADDRESS=0xYourMultisigAddress
```

#### For Trezor Hardware Wallet
```bash
# Trezor hardware wallet deployment
USE_HARDWARE_WALLET=true
HARDWARE_WALLET_TYPE=trezor
TREZOR_DERIVATION_PATH=m/44'/60'/0'/0/0  # Optional

# Network configuration
BASE_RPC_URL=https://mainnet.base.org
TREASURY_ADDRESS=0xYourMultisigAddress
```

### Install Dependencies

```bash
npm install
```

This will install:
- `@ledgerhq/hw-app-eth` - Ledger integration
- `@ledgerhq/hw-transport-node-hid` - Ledger USB communication
- `@nomicfoundation/hardhat-ledger` - Hardhat Ledger plugin
- `trezor-connect` - Trezor integration

---

## Deployment with Hardware Wallet

### Pre-Deployment Checklist

- [ ] Hardware wallet initialized and backed up
- [ ] Firmware updated to latest version
- [ ] Ethereum app installed (Ledger only)
- [ ] Blind signing enabled (Ledger only)
- [ ] Sufficient ETH balance for gas fees
- [ ] `.env` configured correctly
- [ ] Tested on testnet first

### Testnet Deployment (Recommended First)

```bash
# Configure for testnet
USE_HARDWARE_WALLET=true
HARDWARE_WALLET_TYPE=ledger  # or trezor

# Deploy to Base Sepolia
npm run deploy:hw:base-sepolia
```

### Mainnet Deployment

```bash
# Configure for mainnet
USE_HARDWARE_WALLET=true
HARDWARE_WALLET_TYPE=ledger  # or trezor

# Deploy to Base Mainnet
npm run deploy:hw:base

# Or Ethereum Mainnet
npm run deploy:hw:ethereum
```

### Deployment Process

1. **Script starts**: Displays signer information
2. **Hardware wallet prompts**:
   - Ledger: Check device screen, press buttons to confirm
   - Trezor: Check device screen, confirm on touchscreen
3. **Multiple transactions**: You'll need to confirm:
   - Router402 deployment
   - FeeCollector402 deployment
   - Token configuration (2 transactions)
   - Bridge approval (1 transaction)
4. **Completion**: Deployment info saved to `./deployments/`

### Expected Output

```
🚀 Deploying 402.vln.gg Contracts
==========================================

🔐 Using LEDGER hardware wallet
🔌 Connecting to Ledger device...
✅ Ledger connected successfully
📍 Hardware Wallet Address: 0x1234...5678

==================================================
💼 Hardware Wallet Configuration
==================================================
Type: LEDGER
Address: 0x1234...5678
Derivation Path: m/44'/60'/0'/0/0
==================================================

💰 Balance: 1.5 ETH

⚠️  HARDWARE WALLET DEPLOYMENT
Please confirm each transaction on your hardware wallet.

📝 Deploying Router402...
   ⚠️  Please confirm on hardware wallet...
   ✅ Router402 deployed: 0xABCD...1234
   Transaction: 0x789...def

...
```

---

## Migration from Software to Hardware Wallet

### Scenario

You initially deployed with a software wallet (private key) and now want to migrate to a hardware wallet for enhanced security.

### Migration Steps

#### Step 1: Deploy Hardware Wallet

1. Set up your hardware wallet (see above)
2. Fund the hardware wallet address
3. Record the hardware wallet address

#### Step 2: Transfer Ownership

For contracts deployed with Ownable2Step:

```bash
# From old deployer (software wallet)
USE_HARDWARE_WALLET=false
PRIVATE_KEY=old_private_key

# Run ownership transfer script
npx hardhat run scripts/transfer-ownership.ts --network base
```

```typescript
// scripts/transfer-ownership.ts
import { ethers } from "hardhat";

async function main() {
  const newOwner = "0xYourHardwareWalletAddress";

  const router = await ethers.getContractAt(
    "Router402",
    "0xDeployedRouterAddress"
  );

  // Step 1: Initiate transfer
  const tx1 = await router.transferOwnership(newOwner);
  await tx1.wait();
  console.log("Transfer initiated");

  // Step 2: Accept from new owner (hardware wallet)
  // Switch to hardware wallet configuration
  const tx2 = await router.acceptOwnership();
  await tx2.wait();
  console.log("Ownership transferred!");
}
```

#### Step 3: Verify

```bash
# Verify new owner
npx hardhat console --network base

> const router = await ethers.getContractAt("Router402", "0xAddress")
> await router.owner()
'0xYourHardwareWalletAddress'
```

---

## Best Practices

### Security

1. **Never share recovery phrase**: Write it down, store in a safe
2. **Verify addresses**: Always check device screen before confirming
3. **Test on testnet first**: Practice with testnet ETH
4. **Keep firmware updated**: Check for updates monthly
5. **Use strong PIN**: Don't use obvious patterns

### Operational

1. **Fund wallet before deployment**: Ensure sufficient ETH for gas
2. **Monitor transactions**: Watch for confirmations on block explorer
3. **Document deployments**: Save deployment addresses securely
4. **Backup configuration**: Keep `.env` backup (without private keys)
5. **Geographic distribution**: For multisig, distribute hardware wallets

### For Multisig Co-Signers

1. **Optional hardware wallet**: Co-signers can start without hardware wallets
2. **Upgrade path**: Plan to migrate to hardware wallets over time
3. **Clear communication**: Document which signers use hardware wallets
4. **Response time**: Hardware wallet transactions may take longer
5. **Backup signers**: Have redundancy in case hardware wallet fails

### Troubleshooting

See [hardware-wallet-troubleshooting.md](./hardware-wallet-troubleshooting.md) for detailed troubleshooting guide.

---

## Next Steps

1. ✅ Set up hardware wallet
2. ✅ Configure `.env`
3. ✅ Test on testnet
4. ✅ Deploy to mainnet
5. ✅ Verify contracts
6. ✅ Transfer to multisig (if applicable)

---

## Support

### Resources

- Ledger Support: https://support.ledger.com
- Trezor Support: https://trezor.io/support
- Hardhat Docs: https://hardhat.org/docs
- Our Documentation: See `docs/` directory

### Common Issues

See [hardware-wallet-troubleshooting.md](./hardware-wallet-troubleshooting.md)

### Contact

For project-specific questions:
- GitHub Issues: https://github.com/Fused-Gaming/stablecoin-aggregators/issues
- Email: dev@vln.gg

---

**Remember**: Hardware wallets are optional. Co-signers can participate with software wallets and upgrade to hardware wallets when ready.
