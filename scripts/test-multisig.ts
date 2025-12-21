import { ethers } from "hardhat";
import {
  loadMultisigDeployment,
  getMultisigInfo,
  verifySignerAccess,
  getMultisigDashboardUrl,
  displayMultisigHierarchy,
} from "./utils/multisig-manager";

/**
 * Test Multisig Deployment
 *
 * This script tests a deployed Gnosis Safe multisig:
 * - Verifies deployment
 * - Checks all signers have access
 * - Displays multisig information
 * - Provides dashboard access
 *
 * Usage:
 *   MULTISIG_LEVEL=2 npm run test:multisig
 */

async function main() {
  console.log("🧪 Testing Multisig Deployment");
  console.log("==========================================\n");

  const level = parseInt(process.env.MULTISIG_LEVEL || "2");

  // Display hierarchy
  displayMultisigHierarchy();

  // Load deployment
  const deployment = await loadMultisigDeployment(level);

  // Get current network
  const [signer] = await ethers.getSigners();
  const network = await signer.provider.getNetwork();

  console.log("\n🔍 Deployment Details:");
  console.log("==========================================");
  console.log("Level:", deployment.multisig.level);
  console.log("Name:", deployment.multisig.name);
  console.log("Network:", deployment.network);
  console.log("Deployed:", deployment.timestamp);
  console.log("==========================================\n");

  // Get multisig info
  const info = await getMultisigInfo(deployment.multisig.address);

  // Verify all signers
  console.log("✅ Verifying Signers:");
  console.log("==========================================");

  let allValid = true;
  for (let i = 0; i < deployment.multisig.signers.length; i++) {
    const signer = deployment.multisig.signers[i];
    const isValid = await verifySignerAccess(
      deployment.multisig.address,
      signer
    );

    console.log(
      `  ${i + 1}. ${signer} ${isValid ? "✅" : "❌"}`
    );

    if (!isValid) allValid = false;
  }

  console.log("==========================================\n");

  if (!allValid) {
    console.warn("⚠️  WARNING: Some signers do not have access!\n");
  }

  // Check threshold
  console.log("📊 Threshold Configuration:");
  console.log("==========================================");
  console.log("Required signatures:", info.threshold.toString());
  console.log("Total signers:", info.owners.length);
  console.log(
    "Percentage:",
    Math.round((Number(info.threshold) / info.owners.length) * 100) + "%"
  );
  console.log("==========================================\n");

  // Dashboard URL
  const dashboardUrl = getMultisigDashboardUrl(
    deployment.multisig.address,
    deployment.network
  );

  console.log("🌐 Gnosis Safe Dashboard:");
  console.log("==========================================");
  console.log(dashboardUrl);
  console.log("==========================================\n");

  // Block explorer
  console.log("🔎 Block Explorer:");
  console.log("==========================================");

  if (deployment.network === "base" || deployment.network === "baseSepolia") {
    const explorerUrl =
      deployment.network === "base"
        ? "https://basescan.org"
        : "https://sepolia.basescan.org";
    console.log(`${explorerUrl}/address/${deployment.multisig.address}`);
  } else {
    const explorerUrl =
      deployment.network === "ethereum"
        ? "https://etherscan.io"
        : "https://sepolia.etherscan.io";
    console.log(`${explorerUrl}/address/${deployment.multisig.address}`);
  }

  console.log("==========================================\n");

  // Next steps
  console.log("📝 Next Steps:");
  console.log("==========================================");
  console.log("1. All signers should access the Safe dashboard");
  console.log("2. Execute a test transaction:");
  console.log("   - Send small amount of ETH to multisig");
  console.log("   - Propose transaction to send it back");
  console.log(`   - Collect ${info.threshold} signatures`);
  console.log("   - Execute transaction");
  console.log("3. Document successful test in operations log");
  console.log("4. Proceed to transfer contract ownership (if applicable)");
  console.log("==========================================\n");

  // Test scenarios
  console.log("🎯 Recommended Test Scenarios:");
  console.log("==========================================");

  switch (level) {
    case 2: // Admin
      console.log("1. Pause contract (emergency test)");
      console.log("2. Update fee parameter");
      console.log("3. Add new supported token");
      console.log("4. Practice rejection (1 signer rejects)");
      break;

    case 3: // Treasury
      console.log("1. Small withdrawal (<$100)");
      console.log("2. Medium withdrawal (<$1000)");
      console.log("3. Check withdrawal limits");
      console.log("4. Practice with 3-of-5 threshold");
      break;

    case 4: // Emergency
      console.log("1. Emergency pause simulation");
      console.log("2. Single-signer execution test");
      console.log("3. Response time measurement");
      console.log("4. Verify cannot withdraw funds");
      break;
  }

  console.log("==========================================\n");

  console.log("✅ Multisig test complete!");

  // Return summary
  return {
    valid: allValid,
    deployment,
    info,
    dashboardUrl,
  };
}

main()
  .then((result) => {
    if (result.valid) {
      console.log("\n✨ All checks passed!");
      process.exit(0);
    } else {
      console.warn("\n⚠️  Some checks failed. Please review.");
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("\n❌ Test Failed:");
    console.error(error);
    process.exit(1);
  });
