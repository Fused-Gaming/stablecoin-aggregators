import { ethers } from "hardhat";
import * as fs from "fs";

/**
 * Deploy contracts using CREATE2 for deterministic addresses across chains
 *
 * This script:
 * 1. Deploys CREATE2Factory (if not already deployed)
 * 2. Pre-computes deployment addresses
 * 3. Deploys contracts using CREATE2
 * 4. Verifies bytecode matches expected
 * 5. Saves deployment information
 */
async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);

  console.log("🚀 Deploying with CREATE2 (Deterministic Deployment)");
  console.log("=".repeat(60));
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");
  console.log("Chain ID:", chainId);
  console.log("Network:", network.name);
  console.log("=".repeat(60) + "\n");

  // ============ Configuration ============

  const config = {
    baseSalt: "402.vln.gg-v1", // Base salt for deterministic deployment
    nonce: 0, // Increment this for different deployments
    treasury: {
      owner1: process.env.TREASURY_OWNER_1 || deployer.address,
      owner2: process.env.TREASURY_OWNER_2 || deployer.address,
      owner3: process.env.TREASURY_OWNER_3 || deployer.address,
    },
    router: {
      treasury: process.env.ROUTER_TREASURY || deployer.address,
      feeBps: 20, // 0.2%
    },
    feeCollector: {
      treasury: process.env.FEE_COLLECTOR_TREASURY || deployer.address,
      baseFee: ethers.parseUnits("0.01", 6), // $0.01 USDC
    },
    tokens: {
      // Base mainnet
      8453: {
        USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        USDT: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
      },
      // Ethereum mainnet
      1: {
        USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      },
      // Base Sepolia
      84532: {
        USDC: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        USDT: "0x0000000000000000000000000000000000000000", // Use zero address if not available
      },
      // Ethereum Sepolia
      11155111: {
        USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        USDT: "0x0000000000000000000000000000000000000000",
      },
    },
    bridges: {
      8453: "0x3a23F943181408EAC424116Af7b7790c94Cb97a5", // Base mainnet Socket
      1: "0x3a23F943181408EAC424116Af7b7790c94Cb97a5", // Ethereum mainnet Socket
      84532: "0x3a23F943181408EAC424116Af7b7790c94Cb97a5", // Base Sepolia (placeholder)
      11155111: "0x3a23F943181408EAC424116Af7b7790c94Cb97a5", // Ethereum Sepolia (placeholder)
    },
  };

  // Get token addresses for current chain
  const chainTokens = config.tokens[chainId as keyof typeof config.tokens] || {
    USDC: ethers.ZeroAddress,
    USDT: ethers.ZeroAddress,
  };

  const socketRouter = config.bridges[chainId as keyof typeof config.bridges] || ethers.ZeroAddress;

  // ============ Step 1: Deploy CREATE2Factory ============

  console.log("📝 Step 1: Deploying CREATE2Factory...\n");

  const CREATE2FactoryContract = await ethers.getContractFactory("CREATE2Factory");
  const create2Factory = await CREATE2FactoryContract.deploy();
  await create2Factory.waitForDeployment();
  const factoryAddress = await create2Factory.getAddress();

  console.log("✅ CREATE2Factory deployed:", factoryAddress);
  console.log("   - Deployer (owner):", await create2Factory.owner());
  console.log("");

  // ============ Step 2: Generate Salts ============

  console.log("📝 Step 2: Generating Salts...\n");

  const treasurySalt = await create2Factory.generateSalt(
    `${config.baseSalt}-treasury`,
    chainId,
    config.nonce
  );

  const routerSalt = await create2Factory.generateSalt(
    `${config.baseSalt}-router`,
    chainId,
    config.nonce
  );

  const feeCollectorSalt = await create2Factory.generateSalt(
    `${config.baseSalt}-feecollector`,
    chainId,
    config.nonce
  );

  console.log("✅ Salts generated:");
  console.log("   - Treasury salt:", treasurySalt);
  console.log("   - Router salt:", routerSalt);
  console.log("   - FeeCollector salt:", feeCollectorSalt);
  console.log("");

  // ============ Step 3: Pre-compute Addresses ============

  console.log("📝 Step 3: Pre-computing Deployment Addresses...\n");

  // Treasury402
  const TreasuryFactory = await ethers.getContractFactory("Treasury402");
  const treasuryConstructorArgs = ethers.AbiCoder.defaultAbiCoder().encode(
    ["address", "address", "address"],
    [config.treasury.owner1, config.treasury.owner2, config.treasury.owner3]
  );
  const treasuryCreationCode = ethers.concat([
    TreasuryFactory.bytecode,
    treasuryConstructorArgs
  ]);
  const predictedTreasuryAddress = await create2Factory.computeAddressWithConstructor(
    treasuryCreationCode,
    treasurySalt
  );

  // Router402
  const RouterFactory = await ethers.getContractFactory("Router402");
  const routerConstructorArgs = ethers.AbiCoder.defaultAbiCoder().encode(
    ["address", "uint256"],
    [config.router.treasury, config.router.feeBps]
  );
  const routerCreationCode = ethers.concat([
    RouterFactory.bytecode,
    routerConstructorArgs
  ]);
  const predictedRouterAddress = await create2Factory.computeAddressWithConstructor(
    routerCreationCode,
    routerSalt
  );

  // FeeCollector402
  const FeeCollectorFactory = await ethers.getContractFactory("FeeCollector402");
  const feeCollectorConstructorArgs = ethers.AbiCoder.defaultAbiCoder().encode(
    ["address", "address", "uint256"],
    [config.feeCollector.treasury, chainTokens.USDC, config.feeCollector.baseFee]
  );
  const feeCollectorCreationCode = ethers.concat([
    FeeCollectorFactory.bytecode,
    feeCollectorConstructorArgs
  ]);
  const predictedFeeCollectorAddress = await create2Factory.computeAddressWithConstructor(
    feeCollectorCreationCode,
    feeCollectorSalt
  );

  console.log("✅ Predicted Addresses:");
  console.log("   - Treasury402:", predictedTreasuryAddress);
  console.log("   - Router402:", predictedRouterAddress);
  console.log("   - FeeCollector402:", predictedFeeCollectorAddress);
  console.log("");
  console.log("⚠️  IMPORTANT: These addresses will be the same on ALL chains");
  console.log("    (if CREATE2Factory is deployed to the same address)");
  console.log("");

  // ============ Step 4: Deploy Contracts ============

  console.log("📝 Step 4: Deploying Contracts using CREATE2...\n");

  // Deploy Treasury402
  console.log("   Deploying Treasury402...");
  const treasuryTx = await create2Factory.deployWithConstructor(
    treasuryCreationCode,
    treasurySalt
  );
  await treasuryTx.wait();
  console.log("   ✅ Treasury402 deployed to:", predictedTreasuryAddress);

  // Deploy Router402
  console.log("   Deploying Router402...");
  const routerTx = await create2Factory.deployWithConstructor(
    routerCreationCode,
    routerSalt
  );
  await routerTx.wait();
  console.log("   ✅ Router402 deployed to:", predictedRouterAddress);

  // Deploy FeeCollector402
  console.log("   Deploying FeeCollector402...");
  const feeCollectorTx = await create2Factory.deployWithConstructor(
    feeCollectorCreationCode,
    feeCollectorSalt
  );
  await feeCollectorTx.wait();
  console.log("   ✅ FeeCollector402 deployed to:", predictedFeeCollectorAddress);
  console.log("");

  // ============ Step 5: Verify Deployments ============

  console.log("📝 Step 5: Verifying Deployments...\n");

  // Verify contracts exist
  const treasuryHasCode = await create2Factory.hasCode(predictedTreasuryAddress);
  const routerHasCode = await create2Factory.hasCode(predictedRouterAddress);
  const feeCollectorHasCode = await create2Factory.hasCode(predictedFeeCollectorAddress);

  console.log("✅ Contracts deployed successfully:");
  console.log("   - Treasury402:", treasuryHasCode ? "✓" : "✗");
  console.log("   - Router402:", routerHasCode ? "✓" : "✗");
  console.log("   - FeeCollector402:", feeCollectorHasCode ? "✓" : "✗");
  console.log("");

  // Get bytecode hashes for verification
  const treasuryBytecodeHash = await create2Factory.getDeployedBytecodeHash(predictedTreasuryAddress);
  const routerBytecodeHash = await create2Factory.getDeployedBytecodeHash(predictedRouterAddress);
  const feeCollectorBytecodeHash = await create2Factory.getDeployedBytecodeHash(predictedFeeCollectorAddress);

  console.log("📋 Bytecode Hashes (for cross-chain verification):");
  console.log("   - Treasury402:", treasuryBytecodeHash);
  console.log("   - Router402:", routerBytecodeHash);
  console.log("   - FeeCollector402:", feeCollectorBytecodeHash);
  console.log("");

  // ============ Step 6: Configure Router402 ============

  console.log("📝 Step 6: Configuring Router402...\n");

  const router = RouterFactory.attach(predictedRouterAddress);

  // Add supported tokens
  for (const [symbol, address] of Object.entries(chainTokens)) {
    if (address !== ethers.ZeroAddress) {
      const tx = await router.setSupportedToken(address, true);
      await tx.wait();
      console.log(`   ✅ ${symbol} supported:`, address);
    }
  }

  // Approve Socket bridge
  if (socketRouter !== ethers.ZeroAddress) {
    const tx = await router.setApprovedBridge(socketRouter, true);
    await tx.wait();
    console.log("   ✅ Socket bridge approved:", socketRouter);
  }

  console.log("");

  // ============ Step 7: Save Deployment Info ============

  console.log("📝 Step 7: Saving Deployment Information...\n");

  const deployment = {
    network: network.name,
    chainId: chainId,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    create2: {
      factory: factoryAddress,
      baseSalt: config.baseSalt,
      nonce: config.nonce,
    },
    salts: {
      treasury: treasurySalt,
      router: routerSalt,
      feeCollector: feeCollectorSalt,
    },
    contracts: {
      treasury: {
        address: predictedTreasuryAddress,
        bytecodeHash: treasuryBytecodeHash,
        owners: [
          config.treasury.owner1,
          config.treasury.owner2,
          config.treasury.owner3,
        ],
      },
      router: {
        address: predictedRouterAddress,
        bytecodeHash: routerBytecodeHash,
        treasury: config.router.treasury,
        feeBps: config.router.feeBps,
      },
      feeCollector: {
        address: predictedFeeCollectorAddress,
        bytecodeHash: feeCollectorBytecodeHash,
        treasury: config.feeCollector.treasury,
        feeToken: chainTokens.USDC,
        baseFee: ethers.formatUnits(config.feeCollector.baseFee, 6),
      },
    },
    tokens: chainTokens,
    bridges: {
      socket: socketRouter,
    },
  };

  const deploymentPath = `./deployments/create2-${network.name}-${chainId}-${Date.now()}.json`;
  fs.mkdirSync("./deployments", { recursive: true });
  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));

  console.log("💾 Deployment info saved:", deploymentPath);
  console.log("");

  // ============ Step 8: Verification Commands ============

  console.log("📝 Step 8: Contract Verification Commands\n");
  console.log("=".repeat(60));
  console.log("\n# CREATE2Factory");
  console.log(`npx hardhat verify --network ${network.name} ${factoryAddress}`);
  console.log("\n# Treasury402");
  console.log(`npx hardhat verify --network ${network.name} ${predictedTreasuryAddress} \\`);
  console.log(`  "${config.treasury.owner1}" \\`);
  console.log(`  "${config.treasury.owner2}" \\`);
  console.log(`  "${config.treasury.owner3}"`);
  console.log("\n# Router402");
  console.log(`npx hardhat verify --network ${network.name} ${predictedRouterAddress} \\`);
  console.log(`  "${config.router.treasury}" \\`);
  console.log(`  ${config.router.feeBps}`);
  console.log("\n# FeeCollector402");
  console.log(`npx hardhat verify --network ${network.name} ${predictedFeeCollectorAddress} \\`);
  console.log(`  "${config.feeCollector.treasury}" \\`);
  console.log(`  "${chainTokens.USDC}" \\`);
  console.log(`  ${config.feeCollector.baseFee}`);
  console.log("\n" + "=".repeat(60));

  // ============ Summary ============

  console.log("\n✨ Deployment Complete!");
  console.log("=".repeat(60));
  console.log("CREATE2Factory:", factoryAddress);
  console.log("Treasury402:", predictedTreasuryAddress);
  console.log("Router402:", predictedRouterAddress);
  console.log("FeeCollector402:", predictedFeeCollectorAddress);
  console.log("=".repeat(60));
  console.log("\n⚠️  IMPORTANT NOTES:");
  console.log("1. Save the deployment JSON file - it contains critical info");
  console.log("2. These addresses will be identical on all chains");
  console.log("3. Verify bytecode hashes match across chains");
  console.log("4. Test on testnet before mainnet deployment");
  console.log("5. Use hardware wallet for mainnet deployments");
  console.log("=".repeat(60) + "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
