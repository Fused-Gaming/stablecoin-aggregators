# Quickstart: Level 1 Testnet Deployment

**Purpose**: Deploy and test the complete stablecoin aggregator system on Base Sepolia testnet using Level 1 configuration (single developer wallet for all signers).

**Estimated Time**: 15-20 minutes
**Network**: Base Sepolia (testnet)
**Cost**: Free (testnet ETH from faucet)

---

## Prerequisites

### 1. Development Environment

```bash
# Verify Node.js version (20+ required)
node --version  # Should output v20.x.x or higher

# Clone repository (if not already done)
git clone https://github.com/Fused-Gaming/stablecoin-aggregators.git
cd stablecoin-aggregators

# Install dependencies
npm install

# Verify installation
npm run compile  # Should compile all contracts successfully
```

### 2. Get Testnet ETH

You'll need Base Sepolia testnet ETH for deployment:

1. **Create/Use Wallet**: Use MetaMask or export your private key
2. **Get Testnet ETH**: Visit https://www.alchemy.com/faucets/base-sepolia
3. **Request**: 0.5 ETH should be sufficient for testing
4. **Verify**: Check balance at https://sepolia.basescan.org/

### 3. Get API Keys (Free)

```bash
# Base Sepolia Block Explorer API Key
# Visit: https://basescan.org/apis
# Sign up and create API key (free)

# Base Sepolia RPC URL (choose one):
# - Alchemy: https://base-sepolia.g.alchemy.com/v2/YOUR-API-KEY
# - QuickNode: Get from https://www.quicknode.com/
# - Public: https://sepolia.base.org (rate-limited)
```

---

## Step-by-Step Deployment

### Step 1: Configure Environment

Create a `.env` file in the project root:

```bash
# Copy example file
cp .env.example .env

# Edit .env with your values
nano .env  # or use your preferred editor
```

**Minimal .env Configuration:**

```bash
# ============ Deployment Wallet ============
# Your private key (WITH 0x prefix)
PRIVATE_KEY=0x1234567890abcdef...

# ============ RPC & API Keys ============
# Base Sepolia RPC URL
BASE_SEPOLIA_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR-API-KEY

# BaseScan API key for contract verification
BASESCAN_API_KEY=YOUR_BASESCAN_API_KEY

# ============ Level 1 Configuration ============
# Level 1 = Single dev wallet controls all signatures
MULTISIG_LEVEL=1
MULTISIG_NAME="Level 1 Dev Testing"
MULTISIG_THRESHOLD=1

# All signers point to YOUR wallet address (replace with your address)
LEVEL1_SIGNER1=0xYOUR_WALLET_ADDRESS
LEVEL1_SIGNER2=0xYOUR_WALLET_ADDRESS
LEVEL1_SIGNER3=0xYOUR_WALLET_ADDRESS
LEVEL1_SIGNER4=0xYOUR_WALLET_ADDRESS
LEVEL1_SIGNER5=0xYOUR_WALLET_ADDRESS

# ============ Testing Configuration ============
# Mock API URL for development
VLN_URL=https://mock-api.402.vln.gg

# Disable hardware wallet for quick testing
USE_HARDWARE_WALLET=false

# Enable gas reporting
REPORT_GAS=true
```

**Security Note**: NEVER commit your `.env` file or share your private key!

### Step 2: Verify Configuration

```bash
# Check environment setup
npx hardhat verify-env

# Expected output:
# ✅ Private key configured
# ✅ Base Sepolia RPC configured
# ✅ BaseScan API key configured
# ✅ Level 1 configuration valid
# ✅ Wallet has sufficient balance
```

### Step 3: Run Level 1 Workflow Test

This automated script will:
1. ✅ Verify your configuration
2. ✅ Deploy CREATE2Factory contract
3. ✅ Deploy Router402 via CREATE2
4. ✅ Deploy FeeCollector402 via CREATE2
5. ✅ Configure supported tokens (USDC, USDT)
6. ✅ Approve Socket bridge
7. ✅ Test swap functionality
8. ✅ Verify all deployments

```bash
# Run complete Level 1 workflow on Base Sepolia
npx hardhat run scripts/test-level1-workflow.ts --network base-sepolia

# Expected duration: 3-5 minutes
```

**Sample Output:**

```
🚀 Starting Level 1 Testing Workflow
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Configuration Check
  ✅ Network: Base Sepolia (Chain ID: 84532)
  ✅ Deployer: 0x1234...5678
  ✅ Balance: 0.48 ETH
  ✅ Level 1 Mode: Single dev wallet

📦 Step 1: Deploy CREATE2Factory
  ⏳ Deploying...
  ✅ Deployed at: 0xabcd...ef01
  ✅ Gas used: 234,567
  ✅ Verified on BaseScan

📦 Step 2: Deploy Router402
  ⏳ Computing CREATE2 address...
  ✅ Predicted: 0x2222...3333
  ⏳ Deploying via CREATE2...
  ✅ Deployed at: 0x2222...3333 (match!)
  ✅ Gas used: 1,234,567
  ✅ Verified on BaseScan

📦 Step 3: Deploy FeeCollector402
  ⏳ Deploying via CREATE2...
  ✅ Deployed at: 0x4444...5555
  ✅ Gas used: 567,890
  ✅ Verified on BaseScan

⚙️  Step 4: Configure Contracts
  ✅ Added USDC: 0x036CbD53842c5426634e7929541eC2318f3dCF7e
  ✅ Added USDT: 0xf08A50178dfcDe18524640EA6618a1f965821715
  ✅ Approved Socket bridge
  ✅ Set fee: 0.2% (20 bps)

🧪 Step 5: Test Swap
  ⏳ Mocking USDC balance...
  ⏳ Approving Router402...
  ⏳ Executing swap...
  ✅ Swap successful!
  ✅ Fee collected: 2 USDC (from 1000 USDC swap)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ALL TESTS PASSED

📊 Deployment Summary:
  CREATE2Factory: 0xabcd...ef01
  Router402:      0x2222...3333
  FeeCollector402: 0x4444...5555

  Total Gas Used: 2,036,024
  Total Cost: 0.12 ETH (~$400 @ $3,300/ETH)

🔗 View on BaseScan:
  https://sepolia.basescan.org/address/0x2222...3333

📝 Configuration saved to: deployments/base-sepolia.json
```

### Step 4: Verify Deployments

```bash
# Check deployment addresses were saved
cat deployments/base-sepolia.json

# Manually verify on BaseScan (should already be verified)
# Visit: https://sepolia.basescan.org/address/YOUR_ROUTER_ADDRESS

# Test read functions
npx hardhat console --network base-sepolia
> const Router = await ethers.getContractFactory("Router402")
> const router = await Router.attach("0xYOUR_ROUTER_ADDRESS")
> await router.feeBps()
20n  // 0.2% fee
> await router.treasury()
"0xYOUR_WALLET_ADDRESS"
```

### Step 5: Test a Real Swap (Optional)

```bash
# Get testnet USDC from faucet
# Visit: https://faucet.circle.com/ (Base Sepolia)

# Run swap test script
npx hardhat run scripts/test-swap.ts --network base-sepolia

# Or interact via console
npx hardhat console --network base-sepolia
```

---

## Quick Deployment Commands

### Full Workflow (Recommended)
```bash
npx hardhat run scripts/test-level1-workflow.ts --network base-sepolia
```

### Individual Deployments

```bash
# Deploy CREATE2Factory only
npx hardhat run scripts/deploy-create2.ts --network base-sepolia

# Deploy Router402 via CREATE2
npx hardhat run scripts/deploy.ts --network base-sepolia --create2

# Deploy with hardware wallet (Ledger/Trezor)
npx hardhat run scripts/deploy-hardware-wallet.ts --network base-sepolia
```

### Verification

```bash
# Verify Router402
npx hardhat verify --network base-sepolia \
  0xYOUR_ROUTER_ADDRESS \
  "0xYOUR_TREASURY_ADDRESS" \
  20

# Verify FeeCollector402
npx hardhat verify --network base-sepolia \
  0xYOUR_FEE_COLLECTOR_ADDRESS \
  "0xYOUR_TREASURY_ADDRESS" \
  "0xUSDC_ADDRESS" \
  1000000

# Verify CREATE2Factory
npx hardhat verify --network base-sepolia \
  0xYOUR_FACTORY_ADDRESS
```

---

## Testing Your Deployment

### 1. Test via Hardhat Console

```bash
npx hardhat console --network base-sepolia

# Get contract instances
const Router = await ethers.getContractFactory("Router402")
const router = await Router.attach("0xYOUR_ROUTER_ADDRESS")

# Check configuration
await router.treasury()
await router.feeBps()
await router.maxDailyVolume()

# Check supported tokens
await router.supportedTokens("0xUSDC_ADDRESS")  // should be true

# Check approved bridges
await router.approvedBridges("0xSOCKET_ADDRESS")  // should be true
```

### 2. Test Swap Functionality

```bash
# Run comprehensive swap test
npx hardhat test test/Router402.test.ts --network base-sepolia

# Run specific test
npx hardhat test --grep "should execute swap with correct fee"
```

### 3. Monitor Events

```bash
# Watch for swap events
npx hardhat run scripts/watch-events.ts --network base-sepolia

# Or use BaseScan:
# https://sepolia.basescan.org/address/YOUR_ROUTER_ADDRESS#events
```

---

## Troubleshooting

### Error: "Insufficient funds"

**Problem**: Not enough testnet ETH

**Solution**:
```bash
# Check balance
npx hardhat run scripts/check-balance.ts --network base-sepolia

# Get more testnet ETH
# Visit: https://www.alchemy.com/faucets/base-sepolia
```

### Error: "PRIVATE_KEY not set"

**Problem**: Environment variable not configured

**Solution**:
```bash
# Verify .env file exists
ls -la .env

# Check it has PRIVATE_KEY
grep PRIVATE_KEY .env

# Ensure it starts with 0x
# Good: PRIVATE_KEY=0x1234...
# Bad:  PRIVATE_KEY=1234...
```

### Error: "Network base-sepolia not configured"

**Problem**: Missing RPC URL

**Solution**:
```bash
# Add to .env
echo "BASE_SEPOLIA_RPC_URL=https://sepolia.base.org" >> .env

# Or use Alchemy/QuickNode for better reliability
```

### Error: "Contract verification failed"

**Problem**: BaseScan API issue or wrong constructor args

**Solution**:
```bash
# Check BaseScan API key
echo $BASESCAN_API_KEY

# Wait 30 seconds after deployment, then retry
npx hardhat verify --network base-sepolia 0xADDRESS ...ARGS

# If still fails, manually verify on BaseScan:
# https://sepolia.basescan.org/verifyContract
```

### Deployment Takes Too Long

**Problem**: Network congestion or low gas price

**Solution**:
```bash
# Check current gas price
npx hardhat run scripts/check-gas-price.ts --network base-sepolia

# Increase gas limit in hardhat.config.ts:
networks: {
  baseSepolia: {
    gas: 30000000,  // Increase if needed
    gasPrice: 1000000000  // 1 gwei
  }
}
```

---

## Next Steps

### After Successful Deployment

1. **Save Deployment Addresses**
   ```bash
   # Addresses are saved in:
   cat deployments/base-sepolia.json

   # Copy to VERSION.md deployment section
   ```

2. **Update Documentation**
   ```bash
   # Update deployment addresses in:
   # - VERSION.md (Deployment Addresses section)
   # - README.md (if mentioning testnet)
   # - docs/deployment.md
   ```

3. **Test Frontend Integration**
   ```bash
   # Update frontend with deployed addresses
   # Test API integration with contracts
   ```

4. **Move to Level 2 (Optional)**
   - Set up actual multisig with multiple signers
   - See: [docs/procedures/multisig-setup.md](docs/procedures/multisig-setup.md)

---

## Level 1 vs Production

### Level 1 (Current Setup)
- ✅ Single developer wallet controls everything
- ✅ Fast testing and iteration
- ✅ No coordination with co-signers needed
- ❌ **NOT SECURE** - single point of failure
- ❌ **NOT FOR MAINNET** - only for testing

### Production (Future)
- ✅ True multisig with independent signers
- ✅ Hardware wallet security
- ✅ Proper key management ceremonies
- ✅ Geographic distribution
- ✅ Audit and security review

**When to Upgrade**: Before mainnet deployment or handling real value

---

## Useful Commands Reference

```bash
# Compilation
npm run compile          # Compile all contracts
npm run clean           # Clean build artifacts

# Testing
npm test                # Run all tests
npm run test:level1     # Run Level 1 workflow
npm run gas-report      # Generate gas report
npm run coverage        # Generate coverage report

# Deployment
npm run deploy:base-sepolia     # Deploy to Base Sepolia
npm run deploy:create2          # Deploy via CREATE2
npm run deploy:hw               # Deploy with hardware wallet

# Verification
npm run verify:base-sepolia     # Verify on BaseScan

# Network Interaction
npx hardhat console --network base-sepolia  # Interactive console
npx hardhat node                            # Start local node
```

---

## Additional Resources

- **Full Testing Guide**: [docs/LEVEL1_TESTING_GUIDE.md](docs/LEVEL1_TESTING_GUIDE.md)
- **CREATE2 Deployment**: [docs/CREATE2_DEPLOYMENT.md](docs/CREATE2_DEPLOYMENT.md)
- **Multisig Setup**: [docs/procedures/multisig-setup.md](docs/procedures/multisig-setup.md)
- **Hardware Wallet**: [docs/hardware-wallet-setup.md](docs/hardware-wallet-setup.md)
- **Developer Guide**: [CLAUDE.md](CLAUDE.md)

## Support

- **Issues**: https://github.com/Fused-Gaming/stablecoin-aggregators/issues
- **Discussions**: Use GitHub Discussions
- **Security**: security@fused-gaming.com

---

**Last Updated**: 2025-12-24
**Tested On**: Base Sepolia (Chain ID: 84532)
**Version**: v1.1.1

**Ready to deploy?** Start with Step 1! 🚀
