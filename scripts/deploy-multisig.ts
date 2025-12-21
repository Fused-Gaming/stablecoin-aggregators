import { ethers } from "hardhat";
import * as fs from "fs";
import { getDeploymentSigner } from "./utils/signer-factory";

/**
 * Deploy Gnosis Safe Multisig
 *
 * This script deploys a Gnosis Safe multisig wallet for managing
 * the 402.vln.gg contracts. Supports multiple multisig levels:
 * - Level 2: Admin (2-of-3)
 * - Level 3: Treasury (3-of-5)
 * - Level 4: Emergency (1-of-3)
 *
 * Configuration via environment variables:
 * - MULTISIG_LEVEL: 2, 3, or 4
 * - MULTISIG_SIGNERS: Comma-separated list of signer addresses
 * - MULTISIG_THRESHOLD: Number of required signatures
 * - MULTISIG_NAME: Human-readable name for this multisig
 */

// Gnosis Safe contract addresses (official deployments)
const GNOSIS_SAFE_ADDRESSES = {
  // Gnosis Safe Proxy Factory
  proxyFactory: {
    ethereum: "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2",
    sepolia: "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2",
    base: "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2",
    baseSepolia: "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2",
  },
  // Gnosis Safe Singleton (implementation)
  singleton: {
    ethereum: "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552",
    sepolia: "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552",
    base: "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552",
    baseSepolia: "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552",
  },
  // Compatibility Fallback Handler
  fallbackHandler: {
    ethereum: "0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4",
    sepolia: "0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4",
    base: "0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4",
    baseSepolia: "0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4",
  },
};

interface MultisigConfig {
  level: number;
  name: string;
  signers: string[];
  threshold: number;
}

async function getMultisigConfig(): Promise<MultisigConfig> {
  const level = parseInt(process.env.MULTISIG_LEVEL || "2");
  const name = process.env.MULTISIG_NAME || `Level ${level} Multisig`;

  // Parse signers from comma-separated list
  const signersEnv = process.env.MULTISIG_SIGNERS || "";
  const signers = signersEnv
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // Get threshold
  let threshold = parseInt(process.env.MULTISIG_THRESHOLD || "0");

  // Validate and set defaults based on level
  if (signers.length === 0) {
    // Use predefined configurations based on level
    switch (level) {
      case 2: // Admin (2-of-3)
        if (!process.env.LEVEL2_SIGNER1 || !process.env.LEVEL2_SIGNER2 || !process.env.LEVEL2_SIGNER3) {
          throw new Error(
            "Level 2 requires LEVEL2_SIGNER1, LEVEL2_SIGNER2, LEVEL2_SIGNER3 environment variables"
          );
        }
        signers.push(
          process.env.LEVEL2_SIGNER1,
          process.env.LEVEL2_SIGNER2,
          process.env.LEVEL2_SIGNER3
        );
        threshold = threshold || 2;
        break;

      case 3: // Treasury (3-of-5)
        if (
          !process.env.LEVEL3_SIGNER1 ||
          !process.env.LEVEL3_SIGNER2 ||
          !process.env.LEVEL3_SIGNER3 ||
          !process.env.LEVEL3_SIGNER4 ||
          !process.env.LEVEL3_SIGNER5
        ) {
          throw new Error(
            "Level 3 requires LEVEL3_SIGNER1-5 environment variables"
          );
        }
        signers.push(
          process.env.LEVEL3_SIGNER1,
          process.env.LEVEL3_SIGNER2,
          process.env.LEVEL3_SIGNER3,
          process.env.LEVEL3_SIGNER4,
          process.env.LEVEL3_SIGNER5
        );
        threshold = threshold || 3;
        break;

      case 4: // Emergency (1-of-3)
        if (!process.env.LEVEL4_SIGNER1 || !process.env.LEVEL4_SIGNER2 || !process.env.LEVEL4_SIGNER3) {
          throw new Error(
            "Level 4 requires LEVEL4_SIGNER1, LEVEL4_SIGNER2, LEVEL4_SIGNER3 environment variables"
          );
        }
        signers.push(
          process.env.LEVEL4_SIGNER1,
          process.env.LEVEL4_SIGNER2,
          process.env.LEVEL4_SIGNER3
        );
        threshold = threshold || 1;
        break;

      default:
        throw new Error(`Invalid multisig level: ${level}. Must be 2, 3, or 4`);
    }
  }

  // Validate configuration
  if (signers.length === 0) {
    throw new Error("No signers configured");
  }

  if (threshold === 0) {
    throw new Error("Threshold not configured");
  }

  if (threshold > signers.length) {
    throw new Error(
      `Threshold (${threshold}) cannot exceed number of signers (${signers.length})`
    );
  }

  // Validate all addresses
  for (const signer of signers) {
    if (!ethers.isAddress(signer)) {
      throw new Error(`Invalid signer address: ${signer}`);
    }
  }

  // Check for duplicates
  const uniqueSigners = [...new Set(signers)];
  if (uniqueSigners.length !== signers.length) {
    throw new Error("Duplicate signer addresses detected");
  }

  return {
    level,
    name,
    signers,
    threshold,
  };
}

async function main() {
  console.log("🔐 Deploying Gnosis Safe Multisig");
  console.log("==========================================\n");

  // Get deployer signer
  const deployer = await getDeploymentSigner();
  const deployerAddress = await deployer.getAddress();

  // Get network
  const network = await deployer.provider!.getNetwork();
  const networkName = network.name as keyof typeof GNOSIS_SAFE_ADDRESSES.singleton;

  console.log("Network:", networkName);
  console.log("Chain ID:", network.chainId);
  console.log("==========================================\n");

  // Get multisig configuration
  const config = await getMultisigConfig();

  console.log("📋 Multisig Configuration:");
  console.log("Level:", config.level);
  console.log("Name:", config.name);
  console.log("Threshold:", config.threshold, "of", config.signers.length);
  console.log("Signers:");
  config.signers.forEach((signer, idx) => {
    console.log(`  ${idx + 1}. ${signer}`);
  });
  console.log("==========================================\n");

  // Get Gnosis Safe addresses for this network
  const proxyFactoryAddress = GNOSIS_SAFE_ADDRESSES.proxyFactory[networkName];
  const singletonAddress = GNOSIS_SAFE_ADDRESSES.singleton[networkName];
  const fallbackHandlerAddress = GNOSIS_SAFE_ADDRESSES.fallbackHandler[networkName];

  if (!proxyFactoryAddress || !singletonAddress || !fallbackHandlerAddress) {
    throw new Error(`Gnosis Safe not deployed on ${networkName}`);
  }

  console.log("📍 Gnosis Safe Addresses:");
  console.log("Proxy Factory:", proxyFactoryAddress);
  console.log("Singleton:", singletonAddress);
  console.log("Fallback Handler:", fallbackHandlerAddress);
  console.log("==========================================\n");

  // Create Safe setup data
  const SafeL2 = await ethers.getContractAt(
    "IGnosisSafe",
    singletonAddress,
    deployer
  );

  // Setup parameters
  const setupData = SafeL2.interface.encodeFunctionData("setup", [
    config.signers, // owners
    config.threshold, // threshold
    ethers.ZeroAddress, // to (for module setup)
    "0x", // data (for module setup)
    fallbackHandlerAddress, // fallback handler
    ethers.ZeroAddress, // payment token
    0, // payment
    ethers.ZeroAddress, // payment receiver
  ]);

  console.log("🔨 Creating Gnosis Safe proxy...");
  console.log("   Setup data prepared");

  // Deploy via Proxy Factory
  const ProxyFactory = await ethers.getContractAt(
    "IGnosisSafeProxyFactory",
    proxyFactoryAddress,
    deployer
  );

  // Create a salt for deterministic deployment (optional)
  const saltNonce = ethers.id(config.name + Date.now().toString());

  console.log("   Salt nonce:", saltNonce);
  console.log("\n⚠️  Please confirm transaction on your wallet...\n");

  const tx = await ProxyFactory.createProxyWithNonce(
    singletonAddress,
    setupData,
    saltNonce
  );

  console.log("   Transaction hash:", tx.hash);
  console.log("   Waiting for confirmation...\n");

  const receipt = await tx.wait();

  // Extract Safe address from event
  const safeAddress = await ProxyFactory.computeProxyAddressWithNonce(
    singletonAddress,
    setupData,
    saltNonce
  );

  console.log("✅ Gnosis Safe deployed!");
  console.log("==========================================");
  console.log("Safe Address:", safeAddress);
  console.log("Transaction:", receipt?.hash);
  console.log("Block:", receipt?.blockNumber);
  console.log("==========================================\n");

  // Verify deployment
  console.log("🔍 Verifying deployment...");

  const safe = await ethers.getContractAt("IGnosisSafe", safeAddress, deployer);

  const owners = await safe.getOwners();
  const threshold = await safe.getThreshold();

  console.log("Owners:", owners.length);
  owners.forEach((owner, idx) => {
    const match = config.signers.includes(owner);
    console.log(`  ${idx + 1}. ${owner} ${match ? "✅" : "❌"}`);
  });

  console.log("Threshold:", threshold.toString(), "/", owners.length);
  console.log("==========================================\n");

  // Save deployment info
  const deployment = {
    network: networkName,
    chainId: Number(network.chainId),
    timestamp: new Date().toISOString(),
    deployer: deployerAddress,
    multisig: {
      level: config.level,
      name: config.name,
      address: safeAddress,
      threshold: config.threshold,
      signers: config.signers,
      owners: owners,
    },
    gnosisSafe: {
      proxyFactory: proxyFactoryAddress,
      singleton: singletonAddress,
      fallbackHandler: fallbackHandlerAddress,
    },
    transaction: {
      hash: receipt?.hash,
      blockNumber: receipt?.blockNumber,
    },
  };

  const deploymentPath = `./deployments/multisig-level${config.level}-${networkName}-${Date.now()}.json`;
  fs.mkdirSync("./deployments", { recursive: true });
  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));

  console.log("💾 Deployment info saved:", deploymentPath);

  // Next steps
  console.log("\n📝 Next Steps:");
  console.log("==========================================");
  console.log("1. Verify Safe on block explorer:");

  if (networkName === "base" || networkName === "baseSepolia") {
    const explorerUrl =
      networkName === "base"
        ? "https://basescan.org"
        : "https://sepolia.basescan.org";
    console.log(`   ${explorerUrl}/address/${safeAddress}`);
  } else {
    const explorerUrl =
      networkName === "ethereum"
        ? "https://etherscan.io"
        : "https://sepolia.etherscan.io";
    console.log(`   ${explorerUrl}/address/${safeAddress}`);
  }

  console.log("\n2. Access Safe on Gnosis Safe UI:");
  console.log(`   https://app.safe.global/${networkName === "baseSepolia" ? "sep" : networkName.substring(0, 3)}:${safeAddress}`);

  console.log("\n3. Test multisig functionality:");
  console.log("   - Each signer should confirm they can access the Safe");
  console.log("   - Execute a test transaction");
  console.log("   - Verify threshold requirements");

  console.log("\n4. Transfer contract ownership (if applicable):");
  console.log("   - Run ownership transfer script");
  console.log("   - Point contracts to this multisig address");

  console.log("==========================================\n");

  console.log("✨ Multisig deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment Failed:");
    console.error(error);
    process.exit(1);
  });
