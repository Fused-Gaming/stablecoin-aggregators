# Level 1 Testing Guide
## Mock API Workflow with Central Developer Wallet

**Purpose**: Test multisig and deployment workflows using a single developer wallet before coordinating with multiple signers.

**Status**: Testing/Development Only - NOT for production use

---

## Quick Start

### Prerequisites

```bash
# 1. Ensure you have Node.js 20+
node --version  # Should be 20.x or higher

# 2. Install dependencies
npm install

# 3. Get testnet ETH
# Visit: https://www.alchemy.com/faucets/base-sepolia
# Request testnet ETH for your dev wallet address
```

### Setup Level 1 Configuration

Your `.env` file is already configured for Level 1 testing:

```bash
# Level 1: Dev Mock (1-of-5)
MULTISIG_LEVEL=1
MULTISIG_NAME="LEVEL1_SIGNER"
MULTISIG_THRESHOLD=1
LEVEL1_SIGNERS=5

# All signers point to your central dev wallet
LEVEL1_SIGNER1=0xc8506acce670b54cf08625edbc7b2176fff45ee3
LEVEL1_SIGNER2=0xc8506acce670b54cf08625edbc7b2176fff45ee3
LEVEL1_SIGNER3=0xc8506acce670b54cf08625edbc7b2176fff45ee3
LEVEL1_SIGNER4=0xc8506acce670b54cf08625edbc7b2176fff45ee3
LEVEL1_SIGNER5=0xc8506acce670b54cf08625edbc7b2176fff45ee3

# Developer wallet private key
PRIVATE_KEY=your_private_key_here

# Mock API URL
VLN_URL=https://402.vln.gg
```

---

## Running the Level 1 Workflow

### Option 1: Full Workflow Test (Recommended)

```bash
# Run complete Level 1 testing workflow
npm run test:level1

# This will:
# 1. Verify Level 1 configuration
# 2. Mock API authorization request
# 3. Generate signatures
# 4. Deploy test contract (CREATE2Factory)
# 5. Register deployment with mock API
# 6. Test multisig transaction flow
# 7. Verify complete workflow
# 8. Generate detailed report
```

### Option 2: Local Hardhat Network

```bash
# Test on local Hardhat network (faster, no gas costs)
npx hardhat run scripts/test-level1-workflow.ts --network hardhat
```

### Option 3: Base Sepolia Testnet

```bash
# Test on Base Sepolia testnet (real network)
npx hardhat run scripts/test-level1-workflow.ts --network baseSepolia
```

---

## Understanding the Workflow

### What Level 1 Does

**Level 1 is a simulation** where:
- ✅ All 5 multisig signers are the same dev wallet
- ✅ You control all signatures (no coordination needed)
- ✅ Mock API responses simulate real backend
- ✅ Deployments happen on testnet
- ✅ Full workflow can be tested end-to-end

**Level 1 is NOT**:
- ❌ Production-ready (single point of failure)
- ❌ Real multisig (no true multi-signature security)
- ❌ Mainnet deployment (testnet only)

### Workflow Steps Explained

#### Step 1: Configuration Verification
```
Checks:
- All LEVEL1_SIGNERx variables are set
- All point to your dev wallet address
- Wallet has testnet ETH
- Network is accessible
```

#### Step 2: Mock API Authorization
```
Simulates:
- Authorization request to 402.vln.gg
- API validates request
- Returns authorization token
```

#### Step 3: Signature Generation
```
Developer wallet signs:
- Deployment authorization message
- Transaction data
- Multisig approval
```

#### Step 4: Contract Deployment
```
Deploys:
- CREATE2Factory contract
- Uses your dev wallet
- Records deployment address
- Saves transaction hash
```

#### Step 5: Deployment Registration
```
Registers with mock API:
- Contract address
- Deployer info
- Network details
- Signature proof
```

#### Step 6: Multisig Flow Test
```
Simulates:
- Creating multisig transaction
- Collecting signatures (1-of-5)
- Verifying threshold met
- Transaction ready to execute
```

#### Step 7: Workflow Verification
```
Mock API verifies:
- All steps completed
- Signatures valid
- No errors
- Ready for next level
```

---

## Expected Output

### Successful Run

```
============================================================
🚀 STARTING LEVEL 1 TESTING WORKFLOW
============================================================

📋 Step 1: Verifying Level 1 Configuration
✅ All Level 1 signers configured correctly
   Threshold: 1-of-5
   All signers: 0xc8506acce670b54cf08625edbc7b2176fff45ee3
✅ Network: base-sepolia (ChainID: 84532)
✅ Wallet Balance: 0.5 ETH

🌐 Step 2: Mock API - Request Deployment Authorization
📤 Sending authorization request to mock API...
📥 Mock API Response:
{
  "success": true,
  "requestId": "req_1735689300000",
  "timestamp": 1735689300000,
  "data": {
    "authorized": true,
    "level": 1,
    "signers_required": 1,
    "expires_at": 1735692900000
  }
}
✅ Authorization granted by mock API

✍️  Step 3: Generate Level 1 Signature
📝 Message to sign: Level1 Deployment Authorization - 1735689300000
🔐 Message hash: 0x1234...
✅ Signature generated: 0xabcd...
✅ Signature verified: 0xc8506acce670b54cf08625edbc7b2176fff45ee3

🚀 Step 4: Deploy Test Contract (CREATE2Factory)
📦 Deploying CREATE2Factory...
✅ CREATE2Factory deployed at: 0x5678...
📝 Deployment TX: 0x9abc...

🌐 Step 5: Mock API - Register Deployment
📤 Registering deployment with mock API...
📥 Mock API Response:
{
  "success": true,
  "requestId": "deploy_1735689301000",
  "timestamp": 1735689301000,
  "data": {
    "deployment_id": "dep_1735689301000",
    "verified": true,
    "explorer_url": "https://sepolia.basescan.org/address/0x5678..."
  }
}
✅ Deployment registered successfully

🔐 Step 6: Test Multisig Transaction Flow (Simulated)
📝 Multisig Transaction Data:
{
  "to": "0x5678...",
  "value": 0,
  "data": "0x",
  "operation": 0,
  "nonce": 0
}
🔐 Transaction hash: 0xdef0...
✅ Signature 1/1: 0x1234...
✅ Multisig flow test completed
   Signatures collected: 2
   Threshold met: 1/1 ✓

🌐 Step 7: Mock API - Verify Complete Workflow
📤 Verifying workflow with mock API...
📥 Mock API Response:
{
  "success": true,
  "requestId": "verify_1735689302000",
  "timestamp": 1735689302000,
  "data": {
    "workflow_status": "completed",
    "all_checks_passed": true,
    "ready_for_production": false,
    "next_step": "Deploy to Level 2 (Admin Multisig) for staging"
  }
}
✅ Workflow verification completed

============================================================
📊 LEVEL 1 TESTING WORKFLOW REPORT
============================================================

✅ Completed Steps:
   Total Steps: 7/7

📝 Signatures Generated:
   1. 0xabcd1234567890...1234567890
   2. 0x1234567890abcd...abcdef1234

📜 Transactions:
   1. 0x9abcdef123...

🏗️  Deployed Contract:
   Address: 0x5678...

✨ No errors - All tests passed!

============================================================
🎯 Next Steps:
   1. Review workflow output above
   2. Fix any errors if present
   3. Update to Level 2 (2-of-3) for staging
   4. Coordinate real signers for production
============================================================

✅ LEVEL 1 TESTING WORKFLOW COMPLETED SUCCESSFULLY!
```

---

## GitHub Actions Integration

The workflow automatically runs on:
- Push to `feat/m2-track*` branches
- Pull requests to `master` or `develop`
- Manual trigger via GitHub Actions UI

### Manual Trigger

1. Go to GitHub Actions tab
2. Select "Level 1 Testing Workflow"
3. Click "Run workflow"
4. Choose network (hardhat or base-sepolia)
5. Click "Run workflow"

### View Results

Results are available in:
- GitHub Actions summary
- Uploaded artifacts (deployments/, logs/)
- Step logs for detailed output

---

## Mock API Endpoints

The workflow simulates these API endpoints:

### `POST /authorize`
**Purpose**: Authorization for deployment

**Request**:
```json
{
  "level": 1,
  "requestor": "0xc8506...",
  "action": "deploy_contracts",
  "network": "base-sepolia",
  "timestamp": 1735689300000
}
```

**Response**:
```json
{
  "success": true,
  "requestId": "req_1735689300000",
  "data": {
    "authorized": true,
    "level": 1,
    "signers_required": 1,
    "expires_at": 1735692900000
  }
}
```

### `POST /deployment/register`
**Purpose**: Register contract deployment

**Request**:
```json
{
  "contract_address": "0x5678...",
  "deployer": "0xc8506...",
  "network": "base-sepolia",
  "contract_type": "CREATE2Factory",
  "signature": "0xabcd..."
}
```

**Response**:
```json
{
  "success": true,
  "requestId": "deploy_1735689301000",
  "data": {
    "deployment_id": "dep_1735689301000",
    "verified": true,
    "explorer_url": "https://sepolia.basescan.org/address/0x5678..."
  }
}
```

### `POST /workflow/verify`
**Purpose**: Verify complete workflow

**Request**:
```json
{
  "workflow_id": "wf_1735689302000",
  "level": 1,
  "signatures_count": 2,
  "transactions_count": 1,
  "errors_count": 0
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "workflow_status": "completed",
    "all_checks_passed": true,
    "ready_for_production": false,
    "next_step": "Deploy to Level 2"
  }
}
```

---

## Troubleshooting

### Issue: "Configuration validation failed"

**Solution**:
```bash
# Check all LEVEL1_SIGNERx variables
grep LEVEL1_SIGNER .env

# Should all be the same address:
# LEVEL1_SIGNER1=0xc8506acce670b54cf08625edbc7b2176fff45ee3
# LEVEL1_SIGNER2=0xc8506acce670b54cf08625edbc7b2176fff45ee3
# ... (all 5 should match)
```

### Issue: "Wallet has 0 ETH"

**Solution**:
```bash
# Get testnet ETH from faucet
# Visit: https://www.alchemy.com/faucets/base-sepolia
# Enter your wallet address: 0xc8506acce670b54cf08625edbc7b2176fff45ee3
# Request testnet ETH (should receive ~0.1 ETH)
```

### Issue: "Contract deployment failed"

**Solution**:
```bash
# Check RPC endpoint
echo $BASE_RPC_URL

# Try compiling first
npm run compile

# Check gas price
npx hardhat run scripts/check-gas-price.ts
```

### Issue: "Signature verification failed"

**Solution**:
```bash
# Verify private key matches address
# In Node.js console:
const ethers = require('ethers');
const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY');
console.log(wallet.address);

# Should output: 0xc8506acce670b54cf08625edbc7b2176fff45ee3
```

---

## Next Steps

After successful Level 1 testing:

### 1. Update to Level 2 (2-of-3 Admin Multisig)

```bash
# In .env, change:
MULTISIG_LEVEL=2
MULTISIG_NAME="Level 2 Admin Multisig"
MULTISIG_THRESHOLD=2

# Get 2 more signers and update:
LEVEL2_SIGNER1=0xc8506acce670b54cf08625edbc7b2176fff45ee3  # supitsj
LEVEL2_SIGNER2=0x_jamie_address_here
LEVEL2_SIGNER3=0x_third_dev_address_here
```

### 2. Deploy Multisig on Testnet

```bash
npm run multisig:deploy:base-sepolia
```

### 3. Test Multi-Signer Coordination

```bash
# Each signer needs to approve transactions
# Use Gnosis Safe UI: https://app.safe.global
```

### 4. Progress to Production

Follow [M2_COMPLETE.md](M2_COMPLETE.md) for production deployment checklist.

---

## FAQ

**Q: Why does Level 1 use the same address for all signers?**
A: Level 1 is for testing workflows without needing to coordinate multiple people. It simulates a multisig but all signatures come from one wallet.

**Q: Can I use Level 1 in production?**
A: NO! Level 1 is testing only. Production requires real multisig with distributed signers.

**Q: What's the difference between Level 1, 2, 3, 4?**
A:
- Level 1: 1-of-5 (all same dev wallet) - Testing only
- Level 2: 2-of-3 (admin multisig) - Staging/configuration
- Level 3: 3-of-5 (treasury multisig) - Fund management
- Level 4: 1-of-3 (emergency multisig) - Fast response

**Q: How do I transition from Level 1 to Level 2?**
A: Update `MULTISIG_LEVEL=2` in `.env`, get real signers for LEVEL2_SIGNER1-3, and redeploy multisig.

**Q: Where is the mock API running?**
A: Currently simulated in the test script. In production, 402.vln.gg will be a real API.

---

## Related Documentation

- [M2_COMPLETE.md](M2_COMPLETE.md) - Complete M2 milestone guide
- [hardware-wallet-setup.md](hardware-wallet-setup.md) - Hardware wallet integration
- [cosigner-guide.md](cosigner-guide.md) - Multi-signer coordination
- [ROADMAP.md](../ROADMAP.md) - Project roadmap

---

**Last Updated**: December 21, 2024
**Status**: Active - Level 1 testing ready
