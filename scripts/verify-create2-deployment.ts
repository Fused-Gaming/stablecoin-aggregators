import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * Verify CREATE2 deployments across chains
 *
 * This script:
 * 1. Loads deployment info from multiple chains
 * 2. Verifies addresses match across chains
 * 3. Verifies bytecode hashes match
 * 4. Reports any inconsistencies
 */

interface DeploymentInfo {
  network: string;
  chainId: number;
  create2: {
    factory: string;
    baseSalt: string;
    nonce: number;
  };
  contracts: {
    treasury: {
      address: string;
      bytecodeHash: string;
    };
    router: {
      address: string;
      bytecodeHash: string;
    };
    feeCollector: {
      address: string;
      bytecodeHash: string;
    };
  };
}

async function main() {
  console.log("🔍 Verifying CREATE2 Deployments Across Chains");
  console.log("=".repeat(60) + "\n");

  // ============ Load Deployment Files ============

  const deploymentsDir = "./deployments";
  const deploymentFiles = fs
    .readdirSync(deploymentsDir)
    .filter((file) => file.startsWith("create2-") && file.endsWith(".json"))
    .sort(); // Sort by filename for consistent ordering

  if (deploymentFiles.length === 0) {
    console.log("❌ No CREATE2 deployment files found in ./deployments/");
    console.log("   Run deploy-create2.ts first on at least one chain");
    return;
  }

  console.log(`📁 Found ${deploymentFiles.length} deployment file(s):\n`);

  const deployments: DeploymentInfo[] = [];

  for (const file of deploymentFiles) {
    const filePath = path.join(deploymentsDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const deployment = JSON.parse(content) as DeploymentInfo;
    deployments.push(deployment);

    console.log(`   - ${file}`);
    console.log(`     Chain: ${deployment.network} (ID: ${deployment.chainId})`);
  }

  console.log("");

  if (deployments.length === 1) {
    console.log("⚠️  Only one deployment found. Deploy to multiple chains to verify consistency.");
    console.log("");
    await verifySingleDeployment(deployments[0]);
    return;
  }

  // ============ Verify Address Consistency ============

  console.log("📝 Verifying Address Consistency...\n");

  const referenceDeployment = deployments[0];

  let addressMatches = true;

  console.log("Reference Chain:", referenceDeployment.network);
  console.log("   - Treasury402:", referenceDeployment.contracts.treasury.address);
  console.log("   - Router402:", referenceDeployment.contracts.router.address);
  console.log("   - FeeCollector402:", referenceDeployment.contracts.feeCollector.address);
  console.log("");

  for (let i = 1; i < deployments.length; i++) {
    const deployment = deployments[i];

    console.log(`Comparing with: ${deployment.network}`);

    // Check Treasury402
    if (deployment.contracts.treasury.address !== referenceDeployment.contracts.treasury.address) {
      console.log(`   ❌ Treasury402 address mismatch!`);
      console.log(`      Expected: ${referenceDeployment.contracts.treasury.address}`);
      console.log(`      Got:      ${deployment.contracts.treasury.address}`);
      addressMatches = false;
    } else {
      console.log(`   ✅ Treasury402 address matches`);
    }

    // Check Router402
    if (deployment.contracts.router.address !== referenceDeployment.contracts.router.address) {
      console.log(`   ❌ Router402 address mismatch!`);
      console.log(`      Expected: ${referenceDeployment.contracts.router.address}`);
      console.log(`      Got:      ${deployment.contracts.router.address}`);
      addressMatches = false;
    } else {
      console.log(`   ✅ Router402 address matches`);
    }

    // Check FeeCollector402
    if (deployment.contracts.feeCollector.address !== referenceDeployment.contracts.feeCollector.address) {
      console.log(`   ❌ FeeCollector402 address mismatch!`);
      console.log(`      Expected: ${referenceDeployment.contracts.feeCollector.address}`);
      console.log(`      Got:      ${deployment.contracts.feeCollector.address}`);
      addressMatches = false;
    } else {
      console.log(`   ✅ FeeCollector402 address matches`);
    }

    console.log("");
  }

  if (addressMatches) {
    console.log("✅ All contract addresses match across chains!\n");
  } else {
    console.log("❌ Address mismatches detected!\n");
    console.log("⚠️  Possible reasons:");
    console.log("   1. Different CREATE2Factory addresses on different chains");
    console.log("   2. Different salts used");
    console.log("   3. Different constructor arguments");
    console.log("");
  }

  // ============ Verify Bytecode Consistency ============

  console.log("📝 Verifying Bytecode Hash Consistency...\n");

  let bytecodeMatches = true;

  console.log("Reference Chain:", referenceDeployment.network);
  console.log("   - Treasury402:", referenceDeployment.contracts.treasury.bytecodeHash);
  console.log("   - Router402:", referenceDeployment.contracts.router.bytecodeHash);
  console.log("   - FeeCollector402:", referenceDeployment.contracts.feeCollector.bytecodeHash);
  console.log("");

  for (let i = 1; i < deployments.length; i++) {
    const deployment = deployments[i];

    console.log(`Comparing with: ${deployment.network}`);

    // Check Treasury402 bytecode
    if (deployment.contracts.treasury.bytecodeHash !== referenceDeployment.contracts.treasury.bytecodeHash) {
      console.log(`   ❌ Treasury402 bytecode mismatch!`);
      console.log(`      Expected: ${referenceDeployment.contracts.treasury.bytecodeHash}`);
      console.log(`      Got:      ${deployment.contracts.treasury.bytecodeHash}`);
      bytecodeMatches = false;
    } else {
      console.log(`   ✅ Treasury402 bytecode matches`);
    }

    // Check Router402 bytecode
    if (deployment.contracts.router.bytecodeHash !== referenceDeployment.contracts.router.bytecodeHash) {
      console.log(`   ❌ Router402 bytecode mismatch!`);
      console.log(`      Expected: ${referenceDeployment.contracts.router.bytecodeHash}`);
      console.log(`      Got:      ${deployment.contracts.router.bytecodeHash}`);
      bytecodeMatches = false;
    } else {
      console.log(`   ✅ Router402 bytecode matches`);
    }

    // Check FeeCollector402 bytecode
    if (deployment.contracts.feeCollector.bytecodeHash !== referenceDeployment.contracts.feeCollector.bytecodeHash) {
      console.log(`   ❌ FeeCollector402 bytecode mismatch!`);
      console.log(`      Expected: ${referenceDeployment.contracts.feeCollector.bytecodeHash}`);
      console.log(`      Got:      ${deployment.contracts.feeCollector.bytecodeHash}`);
      bytecodeMatches = false;
    } else {
      console.log(`   ✅ FeeCollector402 bytecode matches`);
    }

    console.log("");
  }

  if (bytecodeMatches) {
    console.log("✅ All bytecode hashes match across chains!\n");
  } else {
    console.log("❌ Bytecode mismatches detected!\n");
    console.log("⚠️  This indicates different contract code was deployed");
    console.log("   This should NEVER happen and indicates a serious issue");
    console.log("");
  }

  // ============ Summary ============

  console.log("=".repeat(60));
  console.log("VERIFICATION SUMMARY");
  console.log("=".repeat(60));
  console.log("");
  console.log("Chains Verified:", deployments.length);
  console.log("Address Consistency:", addressMatches ? "✅ PASS" : "❌ FAIL");
  console.log("Bytecode Consistency:", bytecodeMatches ? "✅ PASS" : "❌ FAIL");
  console.log("");

  if (addressMatches && bytecodeMatches) {
    console.log("🎉 All verifications passed!");
    console.log("   Your contracts are consistently deployed across all chains");
  } else {
    console.log("⚠️  Verification failed!");
    console.log("   Review the issues above before proceeding");
  }

  console.log("=".repeat(60) + "\n");
}

async function verifySingleDeployment(deployment: DeploymentInfo) {
  console.log("📝 Verifying Single Deployment...\n");

  // Connect to the network
  const provider = ethers.provider;
  const network = await provider.getNetwork();

  console.log("Network:", deployment.network);
  console.log("Chain ID:", deployment.chainId);
  console.log("");

  // Verify each contract exists
  console.log("Verifying contracts exist on-chain...\n");

  const treasuryCode = await provider.getCode(deployment.contracts.treasury.address);
  const routerCode = await provider.getCode(deployment.contracts.router.address);
  const feeCollectorCode = await provider.getCode(deployment.contracts.feeCollector.address);

  const treasuryExists = treasuryCode !== "0x";
  const routerExists = routerCode !== "0x";
  const feeCollectorExists = feeCollectorCode !== "0x";

  console.log("Treasury402:", deployment.contracts.treasury.address);
  console.log("  Status:", treasuryExists ? "✅ Deployed" : "❌ Not found");

  console.log("\nRouter402:", deployment.contracts.router.address);
  console.log("  Status:", routerExists ? "✅ Deployed" : "❌ Not found");

  console.log("\nFeeCollector402:", deployment.contracts.feeCollector.address);
  console.log("  Status:", feeCollectorExists ? "✅ Deployed" : "❌ Not found");
  console.log("");

  if (treasuryExists && routerExists && feeCollectorExists) {
    console.log("✅ All contracts found on-chain!");

    // Verify bytecode hashes
    console.log("\nVerifying bytecode hashes...\n");

    const treasuryHash = ethers.keccak256(treasuryCode);
    const routerHash = ethers.keccak256(routerCode);
    const feeCollectorHash = ethers.keccak256(feeCollectorCode);

    console.log("Treasury402:");
    console.log("  Expected:", deployment.contracts.treasury.bytecodeHash);
    console.log("  Actual:  ", treasuryHash);
    console.log("  Match:   ", treasuryHash === deployment.contracts.treasury.bytecodeHash ? "✅" : "❌");

    console.log("\nRouter402:");
    console.log("  Expected:", deployment.contracts.router.bytecodeHash);
    console.log("  Actual:  ", routerHash);
    console.log("  Match:   ", routerHash === deployment.contracts.router.bytecodeHash ? "✅" : "❌");

    console.log("\nFeeCollector402:");
    console.log("  Expected:", deployment.contracts.feeCollector.bytecodeHash);
    console.log("  Actual:  ", feeCollectorHash);
    console.log("  Match:   ", feeCollectorHash === deployment.contracts.feeCollector.bytecodeHash ? "✅" : "❌");
    console.log("");
  } else {
    console.log("❌ Some contracts are missing!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
