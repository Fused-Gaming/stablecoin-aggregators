# Hardware Wallet Quick Start Guide

**Version**: 1.0.0
**Last Updated**: December 21, 2024
**Estimated Time**: 15-30 minutes

---

## Overview

This quick start guide gets you deploying with hardware wallets (or software wallets) in under 30 minutes. For comprehensive documentation, see [hardware-wallet-setup.md](./hardware-wallet-setup.md).

---

## Prerequisites

- Node.js v18+ installed
- npm or yarn
- Git repository cloned
- **For software wallet**: Private key
- **For hardware wallet**: Ledger or Trezor device

---

## Quick Start: Software Wallet (5 minutes)

### Step 1: Install Dependencies

```bash
cd stablecoin-aggregators
npm install
```

### Step 2: Configure Environment

```bash
# Copy example
cp .env.example .env

# Edit .env with your settings
nano .env  # or use your preferred editor
```

Set these variables:
```bash
# Software Wallet Configuration
USE_HARDWARE_WALLET=false
PRIVATE_KEY=0xYourPrivateKeyHere

# Network RPC (optional, has defaults)
BASE_RPC_URL=https://sepolia.base.org

# Treasury (optional, defaults to deployer)
TREASURY_ADDRESS=0xYourTreasuryAddress
```

### Step 3: Get Testnet ETH

Visit: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

### Step 4: Deploy to Testnet

```bash
npm run deploy:base-sepolia
```

### Step 5: Verify Success

Check output for:
```
✅ Router402 deployed: 0x...
✅ FeeCollector402 deployed: 0x...
💾 Deployment info saved: ./deployments/baseSepolia-[timestamp].json
```

Verify on Basescan Sepolia: https://sepolia.basescan.org

**✅ Done!** You've deployed with a software wallet.

---

## Quick Start: Hardware Wallet (30 minutes)

### Step 1: Install Dependencies

```bash
cd stablecoin-aggregators
npm install
```

### Step 2: Set Up Hardware Wallet

#### For Ledger:

1. **Connect Ledger** via USB
2. **Enter PIN** on device
3. **Open Ethereum app** on device
4. **Enable blind signing**:
   - On device: Settings → Blind signing → Enable
   - Also enable: Contract data

#### For Trezor:

1. **Install Trezor Bridge**: https://trezor.io/trezor-bridge
2. **Connect Trezor** via USB
3. **Enter PIN** when prompted

### Step 3: Get Your Hardware Wallet Address

#### Ledger:
- Open Ledger Live
- Go to Accounts → Add Account → Ethereum
- Note your address: `0x...`

#### Trezor:
- Visit: https://suite.trezor.io
- Connect device
- View Ethereum account address

### Step 4: Fund Your Hardware Wallet

Get testnet ETH: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

Send to your hardware wallet address.

### Step 5: Configure Environment

```bash
# Copy example
cp .env.example .env

# Edit .env
nano .env
```

**For Ledger**:
```bash
# Hardware Wallet Configuration
USE_HARDWARE_WALLET=true
HARDWARE_WALLET_TYPE=ledger
LEDGER_ADDRESS=0xYourLedgerAddress
LEDGER_DERIVATION_PATH=m/44'/60'/0'/0/0

# Network
BASE_RPC_URL=https://sepolia.base.org

# Treasury
TREASURY_ADDRESS=0xYourTreasuryAddress
```

**For Trezor**:
```bash
# Hardware Wallet Configuration
USE_HARDWARE_WALLET=true
HARDWARE_WALLET_TYPE=trezor
TREZOR_DERIVATION_PATH=m/44'/60'/0'/0/0

# Network
BASE_RPC_URL=https://sepolia.base.org

# Treasury
TREASURY_ADDRESS=0xYourTreasuryAddress
```

### Step 6: Deploy to Testnet

```bash
npm run deploy:hw:base-sepolia
```

**Important**: Watch your hardware wallet screen!

You'll need to confirm:
1. Router402 deployment
2. FeeCollector402 deployment
3. Token configuration (2 transactions)
4. Bridge approval (1 transaction)

**Total**: 5 confirmations required

### Step 7: Verify Success

Check terminal output:
```
✅ Router402 deployed: 0x...
✅ FeeCollector402 deployed: 0x...
💾 Deployment info saved: ./deployments/baseSepolia-[timestamp].json
```

Verify on Basescan: https://sepolia.basescan.org

**✅ Done!** You've deployed with a hardware wallet.

---

## Common Commands

### Compile Contracts
```bash
npm run compile
```

### Run Tests
```bash
npm test
```

### Deploy to Testnet (Software Wallet)
```bash
npm run deploy:base-sepolia
```

### Deploy to Testnet (Hardware Wallet)
```bash
npm run deploy:hw:base-sepolia
```

### Deploy to Base Mainnet (Software Wallet)
```bash
npm run deploy:base
```

### Deploy to Base Mainnet (Hardware Wallet)
```bash
npm run deploy:hw:base
```

### Deploy to Ethereum Mainnet (Hardware Wallet)
```bash
npm run deploy:hw:ethereum
```

---

## Troubleshooting

### "hardhat: not found"
```bash
# Install dependencies
npm install
```

### "Insufficient funds for gas"
```bash
# Get testnet ETH
https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
```

### Ledger: "Device not found"
1. Ensure Ledger is connected and unlocked
2. Open Ethereum app on device
3. Close Ledger Live (it locks the device)

### Ledger: "Transaction rejected"
1. Check device screen
2. Verify transaction details are correct
3. Enable blind signing in Ethereum app settings

### Trezor: "Trezor not connected"
1. Install Trezor Bridge: https://trezor.io/trezor-bridge
2. Restart Trezor Bridge service
3. Reconnect device

### "Blind signing not enabled" (Ledger)
On device:
- Open Ethereum app
- Go to Settings
- Enable "Blind signing"
- Enable "Contract data"

### Gas estimation failed
1. Check RPC connection
2. Verify network is correct
3. Ensure contracts compile: `npm run compile`

For more troubleshooting, see: [hardware-wallet-troubleshooting.md](./hardware-wallet-troubleshooting.md)

---

## Next Steps

### After Successful Testnet Deployment

1. **Test Functionality**
   - Execute test swap
   - Verify fee collection
   - Test pause mechanism

2. **Practice More**
   - Deploy multiple times
   - Try different configurations
   - Practice emergency procedures

3. **Review Documentation**
   - [Hardware Wallet Setup](./hardware-wallet-setup.md)
   - [Co-Signer Guide](./cosigner-guide.md)
   - [Troubleshooting](./hardware-wallet-troubleshooting.md)

4. **Prepare for Mainnet**
   - Complete 4-week testnet practice
   - Verify all procedures
   - Get sufficient mainnet ETH
   - Review security checklist

### For Co-Signers

If you're a multisig co-signer:

1. **Read the Co-Signer Guide**: [cosigner-guide.md](./cosigner-guide.md)
2. **Complete testnet training**: 4-week program
3. **Join testnet multisig**: Practice with the team
4. **Validate readiness**: Complete all scenarios
5. **Join production multisig**: After team approval

---

## Configuration Reference

### Software Wallet Configuration

```bash
# .env for software wallet

# Deployment
USE_HARDWARE_WALLET=false
PRIVATE_KEY=0xYourPrivateKeyHere
TREASURY_ADDRESS=0xYourTreasuryAddress

# RPC URLs (optional, have defaults)
BASE_RPC_URL=https://sepolia.base.org
ETH_RPC_URL=https://rpc.sepolia.org

# API Keys (for verification)
BASESCAN_API_KEY=your_basescan_key
ETHERSCAN_API_KEY=your_etherscan_key
```

### Ledger Hardware Wallet Configuration

```bash
# .env for Ledger

# Deployment
USE_HARDWARE_WALLET=true
HARDWARE_WALLET_TYPE=ledger
LEDGER_ADDRESS=0xYourLedgerAddress
LEDGER_DERIVATION_PATH=m/44'/60'/0'/0/0
TREASURY_ADDRESS=0xYourTreasuryAddress

# RPC URLs
BASE_RPC_URL=https://sepolia.base.org
ETH_RPC_URL=https://rpc.sepolia.org

# API Keys
BASESCAN_API_KEY=your_basescan_key
ETHERSCAN_API_KEY=your_etherscan_key
```

### Trezor Hardware Wallet Configuration

```bash
# .env for Trezor

# Deployment
USE_HARDWARE_WALLET=true
HARDWARE_WALLET_TYPE=trezor
TREZOR_DERIVATION_PATH=m/44'/60'/0'/0/0
TREASURY_ADDRESS=0xYourTreasuryAddress

# RPC URLs
BASE_RPC_URL=https://sepolia.base.org
ETH_RPC_URL=https://rpc.sepolia.org

# API Keys
BASESCAN_API_KEY=your_basescan_key
ETHERSCAN_API_KEY=your_etherscan_key
```

---

## Security Reminders

### ⚠️ NEVER
- ❌ Share your private key
- ❌ Share your recovery phrase
- ❌ Screenshot your recovery phrase
- ❌ Store recovery phrase digitally
- ❌ Commit `.env` to git (already in `.gitignore`)

### ✅ ALWAYS
- ✅ Test on testnet first
- ✅ Verify addresses on device screen
- ✅ Store recovery phrase offline
- ✅ Use strong PINs
- ✅ Keep firmware updated
- ✅ Review transactions before confirming

---

## Support

### Documentation
- [Hardware Wallet Setup Guide](./hardware-wallet-setup.md)
- [Troubleshooting Guide](./hardware-wallet-troubleshooting.md)
- [Co-Signer Guide](./cosigner-guide.md)
- [M2 Track 3 Completion](./M2_TRACK3_COMPLETION.md)

### Hardware Wallet Support
- Ledger: https://support.ledger.com
- Trezor: https://trezor.io/support

### Project Support
- GitHub Issues: https://github.com/Fused-Gaming/stablecoin-aggregators/issues
- Email: dev@vln.gg

---

## FAQ

**Q: Do I need a hardware wallet?**
A: No, hardware wallets are optional. You can use software wallets (private keys) for deployment and multisig participation.

**Q: Can I switch from software to hardware wallet later?**
A: Yes! See the [Co-Signer Guide](./cosigner-guide.md) for migration procedures.

**Q: Which hardware wallet should I buy?**
A: We recommend Ledger Nano S Plus or Ledger Nano X based on extensive testing.

**Q: How long does testnet practice take?**
A: Recommended 4 weeks for co-signers. Individual deployments take 15-30 minutes.

**Q: Can I use the same hardware wallet for personal funds?**
A: Not recommended. Use a dedicated device or different derivation path.

**Q: What if I lose my hardware wallet?**
A: If you have your recovery phrase, you can restore to a new device. Always backup your recovery phrase securely!

---

**Ready to Deploy?** Start with testnet (Base Sepolia) and follow this guide step-by-step.

**Questions?** See [hardware-wallet-troubleshooting.md](./hardware-wallet-troubleshooting.md)

**For Production:** Complete 4-week testnet practice before deploying to mainnet.
