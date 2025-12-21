# CREATE2 Deterministic Deployment Guide

## Overview

This guide explains how to deploy the 402.vln.gg smart contracts using CREATE2 for deterministic addresses across multiple chains.

**Key Benefits**:
- **Same addresses on all chains**: Contracts deployed to identical addresses across Base, Ethereum, and other networks
- **Verifiable deployments**: Cryptographic verification that deployed bytecode matches expected
- **Reproducible**: Anyone can verify deployment integrity
- **Cross-chain consistency**: Simplified multi-chain integration

---

## Architecture

### CREATE2Factory Contract

The `CREATE2Factory.sol` contract provides:

1. **Deterministic Deployment**: Deploy contracts to predictable addresses
2. **Salt Generation**: Create chain-specific salts for unique deployments
3. **Address Pre-computation**: Calculate deployment addresses before deployment
4. **Bytecode Verification**: Verify deployed contracts match expected code
5. **Deployment Tracking**: Monitor all deployments through the factory

### How CREATE2 Works

CREATE2 generates contract addresses using the formula:

```
address = keccak256(0xff ++ factory_address ++ salt ++ keccak256(init_code))[12:]
```

Where:
- `factory_address`: Address of the CREATE2Factory contract
- `salt`: A 32-byte value for determinism
- `init_code`: Contract bytecode + constructor arguments

**Important**: To get the same addresses on different chains, the CREATE2Factory itself must be deployed to the same address on each chain.

---

## Deployment Process

### Prerequisites

1. **Hardware Wallet** (recommended for mainnet)
   - Ledger or Trezor
   - See [Hardware Wallet Setup](./hardware-wallet-setup.md)

2. **Environment Variables**
   ```bash
   # .env file
   PRIVATE_KEY=your_deployer_private_key  # For testnet only!

   # Treasury multisig owners (3/3 for initial deployment)
   TREASURY_OWNER_1=0x...
   TREASURY_OWNER_2=0x...
   TREASURY_OWNER_3=0x...

   # Router configuration
   ROUTER_TREASURY=0x...    # Where fees go

   # FeeCollector configuration
   FEE_COLLECTOR_TREASURY=0x...
   ```

3. **Network Configuration** in `hardhat.config.ts`

### Step 1: Deploy to First Chain (e.g., Base Sepolia)

```bash
# Deploy using CREATE2
npx hardhat run scripts/deploy-create2.ts --network baseSepolia
```

**Output**:
- CREATE2Factory address
- Predicted contract addresses
- Deployment salts
- Bytecode hashes
- Deployment JSON file

**Save the output!** You'll need:
- Contract addresses
- Bytecode hashes
- Salts used

### Step 2: Deploy to Second Chain (e.g., Ethereum Sepolia)

```bash
npx hardhat run scripts/deploy-create2.ts --network ethereumSepolia
```

**Important**: Use the **same configuration** (base salt, nonce) as the first deployment.

### Step 3: Verify Cross-Chain Consistency

```bash
npx hardhat run scripts/verify-create2-deployment.ts
```

This script:
- Loads all deployment files
- Verifies addresses match across chains
- Verifies bytecode hashes match
- Reports any inconsistencies

**Expected output**:
```
✅ All contract addresses match across chains!
✅ All bytecode hashes match across chains!
```

### Step 4: Verify Contracts on Block Explorers

```bash
# Base Sepolia
npx hardhat verify --network baseSepolia <address> <constructor-args>

# Ethereum Sepolia
npx hardhat verify --network ethereumSepolia <address> <constructor-args>
```

See deployment script output for exact verification commands.

---

## Configuration

### Salt Generation

Salts are generated using:
```typescript
salt = keccak256(baseSalt + chainId + nonce)
```

**Parameters**:
- `baseSalt`: "402.vln.gg-v1" (version-specific base string)
- `chainId`: Network chain ID (8453 for Base, 1 for Ethereum, etc.)
- `nonce`: Deployment iteration (0 for first deployment, increment for redeployments)

**Example salts**:
```typescript
// Treasury402
treasurySalt = generateSalt("402.vln.gg-v1-treasury", chainId, 0)

// Router402
routerSalt = generateSalt("402.vln.gg-v1-router", chainId, 0)

// FeeCollector402
feeCollectorSalt = generateSalt("402.vln.gg-v1-feecollector", chainId, 0)
```

### Constructor Arguments

**Treasury402**:
```solidity
constructor(address owner1, address owner2, address owner3)
```

**Router402**:
```solidity
constructor(address treasury, uint256 feeBps)
```

**FeeCollector402**:
```solidity
constructor(address treasury, address feeToken, uint256 baseFee)
```

---

## Deployment Verification Checklist

Before deploying to mainnet:

### Pre-Deployment
- [ ] Test on testnet (Base Sepolia + Ethereum Sepolia)
- [ ] Verify addresses match across testnets
- [ ] Verify bytecode hashes match
- [ ] Test all contract functions on testnet
- [ ] Review constructor arguments
- [ ] Prepare multisig signers
- [ ] Hardware wallet ready and tested
- [ ] Backup deployer key (encrypted)

### During Deployment
- [ ] Deploy CREATE2Factory to same address on all chains
- [ ] Use identical configuration across chains
- [ ] Pre-compute addresses before deploying
- [ ] Verify each deployment immediately after
- [ ] Save all deployment artifacts

### Post-Deployment
- [ ] Verify all contracts on block explorers
- [ ] Verify addresses match across chains
- [ ] Verify bytecode hashes match
- [ ] Test basic functionality
- [ ] Transfer ownership to multisig
- [ ] Document all addresses publicly
- [ ] Announce deployment

---

## Troubleshooting

### Issue: Addresses don't match across chains

**Cause**: CREATE2Factory deployed to different addresses

**Solution**:
1. Deploy CREATE2Factory to the same address on all chains first
2. Or use an existing CREATE2 deployer contract at a known address
3. Consider using a CREATE2 factory deployer for the factory itself

### Issue: Bytecode hash mismatch

**Cause**: Different Solidity compiler settings or versions

**Solution**:
1. Ensure same Solidity version across all deployments
2. Use same compiler optimization settings
3. Don't modify contracts between deployments
4. Use git commit hash to track exact code version

### Issue: Salt already used

**Cause**: Trying to deploy with same salt twice

**Solution**:
1. Increment the `nonce` in deploy script
2. Or change the `baseSalt` for a new version
3. Each unique salt can only be used once per factory

### Issue: Deployment fails with no error

**Cause**: Constructor reverts (e.g., invalid address)

**Solution**:
1. Check constructor arguments
2. Verify addresses are valid
3. Test constructor args on testnet first
4. Review contract constructor requirements

---

## Security Considerations

### 1. Factory Deployment

The CREATE2Factory itself must be deployed securely:
- Use hardware wallet for mainnet
- Deploy to same address on all chains (use a deterministic deployer)
- Verify factory bytecode matches expected
- Transfer ownership to multisig after initial deployments

### 2. Salt Privacy

**Salts are public** once used. Anyone can:
- See the salt used for deployment
- Predict future addresses if they know your salt pattern
- Front-run deployments if they see pending transactions

**Mitigation**:
- Use chain-specific entropy in salts
- Don't reuse salts across different contract types
- Consider private mempools for mainnet deployments

### 3. Address Collision

CREATE2 addresses depend on:
- Factory address
- Salt
- Init code (bytecode + constructor args)

**Risk**: If any of these change, addresses will differ

**Mitigation**:
- Lock down factory address
- Document salt generation precisely
- Use version-controlled bytecode
- Never modify contracts between chain deployments

### 4. Bytecode Verification

Always verify:
- Deployed bytecode matches expected hash
- Hash is consistent across all chains
- No unauthorized code modifications

**Tools**:
- `verify-create2-deployment.ts` script
- Block explorer verification
- Independent bytecode comparison

---

## Advanced Usage

### Deploying Factory to Same Address

To get the same factory address on all chains, use a CREATE2 deployer for the factory itself:

```typescript
// Use a well-known CREATE2 deployer like:
// 0x4e59b44847b379578588920cA78FbF26c0B4956C (Arachnid's deployer)

const factorySalt = ethers.keccak256(ethers.toUtf8Bytes("402.vln.gg-factory-v1"));
const factoryBytecode = CREATE2FactoryContract.bytecode;

// Compute expected address
const expectedFactoryAddress = computeCreate2Address(
  deployer,
  factorySalt,
  factoryBytecode
);

// Deploy via deployer contract
await deployerContract.deploy(factorySalt, factoryBytecode);
```

### Custom Salt Strategies

Different salt strategies for different use cases:

```typescript
// 1. Version-based salts (for upgrades)
const saltV1 = generateSalt("402.vln.gg-v1-router", chainId, 0);
const saltV2 = generateSalt("402.vln.gg-v2-router", chainId, 0);

// 2. Environment-based salts (staging vs production)
const stagingSalt = generateSalt("402.vln.gg-staging-router", chainId, 0);
const prodSalt = generateSalt("402.vln.gg-production-router", chainId, 0);

// 3. Date-based salts (for tracking)
const dateSalt = generateSalt(`402.vln.gg-${Date.now()}-router`, chainId, 0);
```

### Batch Deployment

Deploy to multiple chains programmatically:

```typescript
const chains = [
  { name: "baseSepolia", rpc: "..." },
  { name: "ethereumSepolia", rpc: "..." },
  // ... more chains
];

for (const chain of chains) {
  // Switch provider
  const provider = new ethers.JsonRpcProvider(chain.rpc);
  const signer = new ethers.Wallet(privateKey, provider);

  // Deploy
  await deployWithCreate2(signer, chain.name);

  // Verify
  await verifyDeployment(chain.name);
}
```

---

## Reference

### Contract Addresses

See deployment JSON files in `./deployments/` for contract addresses on each chain.

### Deployment Files

Deployment files are saved as:
```
deployments/create2-<network>-<chainId>-<timestamp>.json
```

**Contents**:
- Network info
- CREATE2Factory address
- Salts used
- Contract addresses
- Bytecode hashes
- Constructor arguments
- Timestamp

### Related Documentation

- [M2 Milestone Roadmap](../ROADMAP.md#milestone-2-deterministic-deployment--key-management)
- [Hardware Wallet Setup](./hardware-wallet-setup.md) (Track 3)
- [Multisig Setup](./multisig-setup.md) (Track 4)
- [Key Management](./key-management.md) (Track 2)

---

## Support

For issues or questions:
1. Check this documentation
2. Review deployment logs
3. Run verification scripts
4. Open GitHub issue with:
   - Network deployed to
   - Deployment file
   - Error messages
   - Steps to reproduce

---

**Last Updated**: December 21, 2025
**Version**: 1.0.0 (M2 - Track 1)
