import { ethers } from "hardhat";
import * as fs from "fs";
import { getDeploymentSigner } from "./utils/signer-factory";

/**
 * Deploy contracts using hardware wallet (optional)
 *
 * This script supports both software wallets and hardware wallets.
 * Configure via environment variables:
 *
 * Software Wallet (default):
 *   USE_HARDWARE_WALLET=false
 *   PRIVATE_KEY=your_private_key
 *
 * Hardware Wallet (Ledger):
 *   USE_HARDWARE_WALLET=true
 *   HARDWARE_WALLET_TYPE=ledger
 *   LEDGER_ADDRESS=0x... (optional, for verification)
 *   LEDGER_DERIVATION_PATH=m/44'/60'/0'/0/0 (optional)
 *
 * Hardware Wallet (Trezor):
 *   USE_HARDWARE_WALLET=true
 *   HARDWARE_WALLET_TYPE=trezor
 *   TREZOR_DERIVATION_PATH=m/44'/60'/0'/0/0 (optional)
 */
async function main() {
  console.log("🚀 Deploying 402.vln.gg Contracts");
  console.log("==========================================\n");

  // Get signer (software or hardware wallet)
  const deployer = await getDeploymentSigner();
  const deployerAddress = await deployer.getAddress();

  // Get network info
  const network = await deployer.provider!.getNetwork();
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId);
  console.log("==========================================\n");

  // Configuration
  const config = {
    treasury: process.env.TREASURY_ADDRESS || deployerAddress,
    feeBps: 20, // 0.2%
    baseFee: ethers.parseUnits("0.01", 6), // $0.01 USDC
    tokens: {
      base: {
        USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        USDT: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
      },
      ethereum: {
        USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      },
    },
    bridges: {
      socket: "0x3a23F943181408EAC424116Af7b7790c94Cb97a5", // Base mainnet
    },
  };

  console.log("📋 Deployment Configuration:");
  console.log("Treasury:", config.treasury);
  console.log("Fee (bps):", config.feeBps);
  console.log("Base Fee:", ethers.formatUnits(config.baseFee, 6), "USDC");
  console.log("==========================================\n");

  // Deployment confirmation
  if (process.env.USE_HARDWARE_WALLET === "true") {
    console.log("⚠️  HARDWARE WALLET DEPLOYMENT");
    console.log("Please confirm each transaction on your hardware wallet.\n");

    // Give user time to read
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  // 1. Deploy Router402
  console.log("📝 Deploying Router402...");
  console.log("   Treasury:", config.treasury);
  console.log("   Fee (bps):", config.feeBps);

  const Router402 = await ethers.getContractFactory("Router402", deployer);
  const router = await Router402.deploy(config.treasury, config.feeBps);
  await router.waitForDeployment();
  const routerAddress = await router.getAddress();

  console.log("✅ Router402 deployed:", routerAddress);
  console.log("   Transaction:", router.deploymentTransaction()?.hash);

  // 2. Deploy FeeCollector402
  console.log("\n📝 Deploying FeeCollector402...");

  const tokenNetwork = network.name.includes("base") ? "base" : "ethereum";
  const usdcAddress = config.tokens[tokenNetwork as keyof typeof config.tokens].USDC;

  console.log("   Treasury:", config.treasury);
  console.log("   USDC:", usdcAddress);
  console.log("   Base Fee:", ethers.formatUnits(config.baseFee, 6), "USDC");

  const FeeCollector = await ethers.getContractFactory(
    "FeeCollector402",
    deployer
  );
  const feeCollector = await FeeCollector.deploy(
    config.treasury,
    usdcAddress,
    config.baseFee
  );
  await feeCollector.waitForDeployment();
  const feeCollectorAddress = await feeCollector.getAddress();

  console.log("✅ FeeCollector402 deployed:", feeCollectorAddress);
  console.log("   Transaction:", feeCollector.deploymentTransaction()?.hash);

  // 3. Configure Router402
  console.log("\n⚙️  Configuring Router402...");

  // Add supported tokens
  const tokenAddresses =
    network.name.includes("base") ? config.tokens.base : config.tokens.ethereum;

  for (const [symbol, address] of Object.entries(tokenAddresses)) {
    console.log(`   Adding ${symbol} support...`);

    if (process.env.USE_HARDWARE_WALLET === "true") {
      console.log("   ⚠️  Please confirm on hardware wallet...");
    }

    const tx = await router.setSupportedToken(address, true);
    await tx.wait();
    console.log(`   ✅ ${symbol} supported:`, address);
  }

  // Approve bridges
  console.log("   Approving Socket bridge...");

  if (process.env.USE_HARDWARE_WALLET === "true") {
    console.log("   ⚠️  Please confirm on hardware wallet...");
  }

  const tx = await router.setApprovedBridge(config.bridges.socket, true);
  await tx.wait();
  console.log("   ✅ Socket bridge approved:", config.bridges.socket);

  // 4. Save deployment info
  const deployment = {
    network: network.name,
    chainId: Number(network.chainId),
    timestamp: new Date().toISOString(),
    deployer: deployerAddress,
    deploymentMethod: process.env.USE_HARDWARE_WALLET === "true"
      ? `hardware-wallet-${process.env.HARDWARE_WALLET_TYPE || "ledger"}`
      : "software-wallet",
    contracts: {
      router: routerAddress,
      feeCollector: feeCollectorAddress,
    },
    config: {
      treasury: config.treasury,
      feeBps: config.feeBps,
      baseFee: ethers.formatUnits(config.baseFee, 6),
    },
    tokens: tokenAddresses,
    bridges: config.bridges,
  };

  const deploymentPath = `./deployments/${network.name}-${Date.now()}.json`;
  fs.mkdirSync("./deployments", { recursive: true });
  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));

  console.log("\n💾 Deployment info saved:", deploymentPath);

  // 5. Verification commands
  console.log("\n🔍 Verification Commands:");
  console.log("==========================================");
  console.log(
    `npx hardhat verify --network ${network.name} ${routerAddress} ${config.treasury} ${config.feeBps}`
  );
  console.log(
    `npx hardhat verify --network ${network.name} ${feeCollectorAddress} ${config.treasury} ${usdcAddress} ${config.baseFee}`
  );

  // 6. Summary
  console.log("\n✨ Deployment Complete!");
  console.log("==========================================");
  console.log("Deployment Method:", deployment.deploymentMethod);
  console.log("Deployer:", deployerAddress);
  console.log("Router402:", routerAddress);
  console.log("FeeCollector402:", feeCollectorAddress);
  console.log("Treasury:", config.treasury);
  console.log("==========================================");

  // 7. Important reminders
  if (process.env.USE_HARDWARE_WALLET === "true") {
    console.log("\n⚠️  IMPORTANT REMINDERS:");
    console.log("1. Verify all contract addresses are correct");
    console.log("2. Keep your hardware wallet secure");
    console.log("3. Document the deployment in your records");
    console.log("4. Consider transferring ownership to a multisig");
    console.log("==========================================\n");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment Failed:");
    console.error(error);
    process.exit(1);
  });
