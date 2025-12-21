import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("🚀 Deploying 402.vln.gg Contracts");
  console.log("==========================================");
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");
  console.log("Network:", (await deployer.provider.getNetwork()).name);
  console.log("==========================================\n");
  
  // Configuration
  const config = {
    treasury: process.env.TREASURY_ADDRESS || deployer.address,
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
  
  // 1. Deploy Router402
  console.log("📝 Deploying Router402...");
  const Router402 = await ethers.getContractFactory("Router402");
  const router = await Router402.deploy(config.treasury, config.feeBps);
  await router.waitForDeployment();
  const routerAddress = await router.getAddress();
  console.log("✅ Router402:", routerAddress);
  
  // 2. Deploy FeeCollector402
  console.log("\n📝 Deploying FeeCollector402...");
  const FeeCollector = await ethers.getContractFactory("FeeCollector402");
  const feeCollector = await FeeCollector.deploy(
    config.treasury,
    config.tokens.base.USDC,
    config.baseFee
  );
  await feeCollector.waitForDeployment();
  const feeCollectorAddress = await feeCollector.getAddress();
  console.log("✅ FeeCollector402:", feeCollectorAddress);
  
  // 3. Configure Router402
  console.log("\n⚙️  Configuring Router402...");
  
  // Add supported tokens
  const network = (await deployer.provider.getNetwork()).name;
  const tokenAddresses = network.includes("base") 
    ? config.tokens.base 
    : config.tokens.ethereum;
  
  for (const [symbol, address] of Object.entries(tokenAddresses)) {
    const tx = await router.setSupportedToken(address, true);
    await tx.wait();
    console.log(`✅ ${symbol} supported:`, address);
  }
  
  // Approve bridges
  const tx = await router.setApprovedBridge(config.bridges.socket, true);
  await tx.wait();
  console.log("✅ Socket bridge approved:", config.bridges.socket);
  
  // 4. Save deployment info
  const deployment = {
    network: network,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
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
  
  const deploymentPath = `./deployments/${network}-${Date.now()}.json`;
  fs.mkdirSync("./deployments", { recursive: true });
  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
  
  console.log("\n💾 Deployment info saved:", deploymentPath);
  
  // 5. Verification commands
  console.log("\n🔍 Verification Commands:");
  console.log("==========================================");
  console.log(`npx hardhat verify --network ${network} ${routerAddress} ${config.treasury} ${config.feeBps}`);
  console.log(`npx hardhat verify --network ${network} ${feeCollectorAddress} ${config.treasury} ${config.tokens.base.USDC} ${config.baseFee}`);
  
  console.log("\n✨ Deployment Complete!");
  console.log("==========================================");
  console.log("Router402:", routerAddress);
  console.log("FeeCollector402:", feeCollectorAddress);
  console.log("Treasury:", config.treasury);
  console.log("==========================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
