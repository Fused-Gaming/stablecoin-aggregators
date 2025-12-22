# Hardware Wallet Troubleshooting Guide

**Version**: 1.0.0
**Last Updated**: December 21, 2024
**Track**: M2 Track 3 - Hardware Wallet Integration

---

## Table of Contents

1. [Connection Issues](#connection-issues)
2. [Transaction Failures](#transaction-failures)
3. [Address Verification Issues](#address-verification-issues)
4. [Deployment Errors](#deployment-errors)
5. [Network-Specific Issues](#network-specific-issues)
6. [Environment-Specific Issues](#environment-specific-issues)

---

## Connection Issues

### Ledger: "Device not found" or "Cannot connect"

**Symptoms**: Script cannot detect Ledger device

**Solutions**:

1. **Check USB connection**
   ```bash
   # Verify device is connected (Linux/Mac)
   lsusb | grep Ledger
   ```

2. **Unlock Ledger**
   - Enter PIN on device
   - Open Ethereum app
   - Ensure app shows "Application is ready"

3. **Close Ledger Live**
   - Ledger Live locks the device
   - Close the application completely

4. **Check permissions (Linux)**
   ```bash
   # Add udev rules
   wget -q -O - https://raw.githubusercontent.com/LedgerHQ/udev-rules/master/add_udev_rules.sh | sudo bash

   # Reload udev
   sudo udevadm control --reload-rules
   sudo udevadm trigger

   # Reconnect device
   ```

5. **Update Ledger firmware**
   - Open Ledger Live
   - Go to Manager
   - Update if available

6. **Reinstall USB drivers (Windows)**
   - Device Manager → Universal Serial Bus devices
   - Right-click → Uninstall
   - Reconnect device

### Trezor: "Trezor not connected"

**Symptoms**: Cannot initialize Trezor Connect

**Solutions**:

1. **Install Trezor Bridge**
   ```bash
   # Download from
   https://trezor.io/trezor-bridge

   # Verify installation
   curl http://localhost:21325/status
   ```

2. **Restart Trezor Bridge**
   ```bash
   # Windows
   services.msc → Trezor Bridge → Restart

   # Mac
   killall trezord
   trezord &

   # Linux
   sudo systemctl restart trezord.service
   ```

3. **Check browser permissions**
   - Trezor Connect needs browser popup permissions
   - Allow popups for deployment script

4. **Update firmware**
   - Visit https://trezor.io/start
   - Follow firmware update instructions

---

## Transaction Failures

### "Transaction rejected by user"

**Cause**: Transaction cancelled on hardware wallet

**Solutions**:

1. **Review transaction details**
   - Check recipient address
   - Verify gas fees are acceptable
   - Ensure transaction type is correct

2. **Increase timeout**
   - You have up to 60 seconds to confirm
   - Don't rush, verify everything

3. **Restart deployment**
   - If cancelled, run deployment script again
   - Previous successful transactions won't re-deploy

### "Insufficient funds for gas"

**Cause**: Not enough ETH for transaction gas fees

**Solutions**:

**Testnet**:
```bash
# Get testnet ETH from faucets

# Base Sepolia
https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

# Ethereum Sepolia
https://sepoliafaucet.com/
```

**Mainnet**:
```bash
# Check balance
npm run deploy:hw:base
# Script will show balance

# Transfer ETH to hardware wallet address
# Recommended: 0.5 ETH for full deployment
```

### "Nonce too low" or "Nonce too high"

**Cause**: Transaction nonce mismatch

**Solutions**:

1. **Wait for pending transactions**
   ```bash
   # Check pending transactions on Etherscan
   https://etherscan.io/address/0xYourAddress
   ```

2. **Clear mempool (if stuck)**
   ```bash
   # Send 0 ETH to yourself with same nonce but higher gas
   # This will replace stuck transaction
   ```

3. **Restart script**
   - Script auto-calculates nonce
   - Should recover automatically

---

## Address Verification Issues

### "Address mismatch" error

**Cause**: Hardware wallet address doesn't match expected address

**Solutions**:

1. **Check derivation path**
   ```bash
   # In .env file
   LEDGER_DERIVATION_PATH=m/44'/60'/0'/0/0

   # Make sure you're using the correct account number
   # Account 0: m/44'/60'/0'/0/0
   # Account 1: m/44'/60'/0'/0/1
   ```

2. **Verify address on device**
   - Ledger: Settings → Ethereum → Display address
   - Trezor: Receive → Show full address

3. **Update LEDGER_ADDRESS in .env**
   ```bash
   LEDGER_ADDRESS=0xActualAddressFromDevice
   ```

### "Cannot retrieve address"

**Cause**: Hardware wallet not responding

**Solutions**:

1. **Ensure Ethereum app is open** (Ledger only)
2. **Check USB connection**
3. **Restart device**
4. **Try different USB port**

---

## Deployment Errors

### "Blind signing not enabled" (Ledger only)

**Error**: Contract deployment rejected

**Solution**:

1. On Ledger device:
   - Open Ethereum app
   - Navigate to **Settings**
   - Scroll to **Blind signing**
   - Press both buttons to enable (shows "Enabled")

2. Also enable **Contract data**:
   - Settings → Contract data → Enable

3. Restart deployment script

### "Gas estimation failed"

**Cause**: Cannot estimate gas for deployment

**Solutions**:

1. **Check network connectivity**
   ```bash
   # Test RPC connection
   curl -X POST -H "Content-Type: application/json" \
     --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
     https://sepolia.base.org
   ```

2. **Update RPC URL**
   ```bash
   # In .env, use alternative RPC
   # Base Sepolia
   BASE_RPC_URL=https://sepolia.base.org

   # Ethereum Sepolia
   ETH_RPC_URL=https://rpc.sepolia.org
   ```

3. **Check contract code**
   - Ensure contracts compile: `npm run compile`
   - Fix any compilation errors

### "Deployment transaction failed"

**Cause**: Transaction reverted on-chain

**Solutions**:

1. **Check transaction hash**
   ```bash
   # View on block explorer
   # Base Sepolia: https://sepolia.basescan.org/tx/0xTxHash
   # Ethereum: https://etherscan.io/tx/0xTxHash
   ```

2. **Review revert reason**
   - Look for error message in block explorer
   - Common causes:
     - Constructor parameter issues
     - Insufficient gas limit
     - Network congestion

3. **Increase gas limit**
   ```typescript
   // In deployment script, add gas limit
   const router = await Router402.deploy(treasury, feeBps, {
     gasLimit: 3000000
   });
   ```

---

## Network-Specific Issues

### Base Sepolia Issues

**Problem**: Testnet deployment fails

**Solutions**:

1. **Get testnet ETH**
   ```bash
   # Coinbase faucet (easiest)
   https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

   # Requires Coinbase account
   # Sends to your hardware wallet address
   ```

2. **Verify network**
   ```bash
   # In .env
   USE_HARDWARE_WALLET=true
   NETWORK=baseSepolia

   # RPC should be
   BASE_RPC_URL=https://sepolia.base.org
   ```

3. **Check chain ID**
   - Base Sepolia: 84532
   - Script auto-detects but verify in output

### Ethereum Sepolia Issues

**Problem**: Cannot deploy to Ethereum testnet

**Solutions**:

1. **Get testnet ETH**
   ```bash
   # Multiple faucets available
   https://sepoliafaucet.com/
   https://faucet.sepolia.dev/
   ```

2. **Gas prices may be high**
   ```bash
   # Check current gas prices
   https://etherscan.io/gastracker

   # For testnet, adjust in script if needed
   ```

### Mainnet Deployment Concerns

**Before deploying to mainnet**:

1. ✅ **Deploy to testnet first**
   - Test full deployment flow
   - Verify all transactions
   - Practice hardware wallet confirmation

2. ✅ **Verify configuration**
   - Double-check treasury address
   - Verify token addresses for correct network
   - Confirm fee parameters

3. ✅ **Sufficient ETH balance**
   - Recommended: 0.5 ETH for Base
   - Recommended: 1.5 ETH for Ethereum
   - Check gas prices first

---

## Environment-Specific Issues

### Testnet Environment

**Setup Checklist**:
```bash
# .env for testnet
USE_HARDWARE_WALLET=true
HARDWARE_WALLET_TYPE=ledger

# Testnet RPCs
BASE_RPC_URL=https://sepolia.base.org
ETH_RPC_URL=https://rpc.sepolia.org

# Testnet treasury (can be same as deployer for testing)
TREASURY_ADDRESS=0xYourHardwareWalletAddress
```

**Common Issues**:

1. **Testnet ETH not arriving**
   - Wait 5-10 minutes
   - Try alternative faucets
   - Verify address is correct

2. **Testnet RPC rate limiting**
   - Use public RPCs (shown above)
   - Consider Alchemy/Infura for higher limits

### Production Environment

**Setup Checklist**:
```bash
# .env for production
USE_HARDWARE_WALLET=true
HARDWARE_WALLET_TYPE=ledger

# Mainnet RPCs (use paid RPC for reliability)
BASE_RPC_URL=https://mainnet.base.org
ETH_RPC_URL=https://eth.llamarpc.com

# Production multisig treasury
TREASURY_ADDRESS=0xYourProductionMultisig

# Verify deployer has enough ETH
```

**Pre-Production Checklist**:
- [ ] Tested on testnet successfully
- [ ] All hardware wallet signers have devices
- [ ] Testnet deployment verified and working
- [ ] Mainnet treasury multisig is set up
- [ ] All signers know the deployment process
- [ ] Emergency procedures documented
- [ ] Sufficient ETH for deployment gas

**Critical Errors in Production**:

1. **Wrong network deployed**
   ```bash
   # STOP immediately
   # Verify network in deployment output:
   # Network: base (Chain ID: 8453) ← Correct
   # Network: baseSepolia (Chain ID: 84532) ← Wrong!
   ```

2. **Wrong treasury address**
   ```bash
   # Cannot change after deployment with current contracts
   # Would need to redeploy
   # VERIFY treasury address before confirming deployment transaction
   ```

3. **Deployment partial success**
   ```bash
   # Check deployment JSON file
   # Verify all contracts deployed
   # May need to manually complete configuration
   ```

---

## Recovery Procedures

### Lost Hardware Wallet

**Immediate Actions**:

1. **DO NOT PANIC** - Funds are safe if you have recovery phrase

2. **Get new hardware wallet**
   - Purchase identical model if possible
   - Any compatible wallet works

3. **Restore from recovery phrase**
   - Use 24-word recovery phrase
   - Set new PIN
   - Verify address matches

4. **Verify access**
   ```bash
   # Test on testnet first
   USE_HARDWARE_WALLET=true
   npm run deploy:hw:base-sepolia

   # Confirm address matches expected
   ```

### Forgotten PIN

**Ledger**:
- After 3 wrong attempts, device resets
- Must restore from recovery phrase

**Trezor**:
- Similar to Ledger
- Can try to remember, but limited attempts

**Recovery**:
1. Restore from recovery phrase to new or reset device
2. Verify address
3. Continue operations

### Compromised Recovery Phrase

**CRITICAL EMERGENCY**:

1. **Immediately**:
   - Transfer all funds to new secure address
   - Consider multisig for production
   - Never use compromised phrase again

2. **For deployed contracts**:
   - If owner, transfer ownership to new address
   - If multisig signer, initiate signer rotation
   - Document incident

---

## Getting Help

### Escalation Path

1. **Check this guide** first
2. **Search documentation**: `docs/` directory
3. **Test on testnet**: Isolate the issue
4. **GitHub Issues**: File detailed bug report
5. **Community**: Reach out on Discord/Telegram

### Information to Provide

When reporting issues:

```
**Hardware Wallet**: Ledger Nano S Plus / Trezor Model T
**Firmware Version**: X.X.X
**Network**: Base Sepolia / Base Mainnet
**Environment**: Testnet / Production
**Error Message**: [Exact error text]
**Steps to Reproduce**: [Detailed steps]
**Expected vs Actual**: [What should happen vs what happened]
**Logs**: [Relevant console output]
```

### Support Channels

- **Ledger**: https://support.ledger.com
- **Trezor**: https://trezor.io/support
- **Hardhat**: https://hardhat.org/docs
- **Project**: GitHub Issues

---

## Prevention Tips

1. **Always test on testnet first**
2. **Keep firmware updated**
3. **Verify addresses on device screen**
4. **Practice deployment flow before mainnet**
5. **Document your configuration**
6. **Have backup signers for multisig**
7. **Store recovery phrase securely offline**
8. **Never share recovery phrase or PIN**

---

## Appendix: Error Code Reference

| Error Code | Cause | Solution |
|------------|-------|----------|
| `0x6985` | User rejected transaction | Review and confirm on device |
| `0x6B00` | App not open (Ledger) | Open Ethereum app |
| `0x6D00` | Blind signing disabled | Enable in Ethereum app settings |
| `0x6511` | Device locked | Unlock with PIN |
| `0x5515` | Invalid derivation path | Check path format |

---

**Remember**: **ALWAYS** deploy and test on **testnet** (Base Sepolia) before deploying to **production** (Base Mainnet).
