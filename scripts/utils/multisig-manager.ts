import { ethers } from "hardhat";
import * as fs from "fs";

/**
 * Multisig Manager Utility
 *
 * Helper functions for managing Gnosis Safe multisigs:
 * - Load multisig deployments
 * - Verify signer access
 * - Test multisig functionality
 * - Transfer contract ownership
 */

export interface MultisigDeployment {
  network: string;
  chainId: number;
  timestamp: string;
  deployer: string;
  multisig: {
    level: number;
    name: string;
    address: string;
    threshold: number;
    signers: string[];
    owners: string[];
  };
  gnosisSafe: {
    proxyFactory: string;
    singleton: string;
    fallbackHandler: string;
  };
  transaction: {
    hash?: string;
    blockNumber?: number;
  };
}

/**
 * Load multisig deployment from file
 */
export async function loadMultisigDeployment(
  level: number,
  network?: string
): Promise<MultisigDeployment> {
  const deploymentsDir = "./deployments";

  if (!fs.existsSync(deploymentsDir)) {
    throw new Error("No deployments directory found");
  }

  // Find most recent deployment for this level and network
  const files = fs.readdirSync(deploymentsDir);
  const multisigFiles = files
    .filter(
      (f) =>
        f.startsWith(`multisig-level${level}`) &&
        f.endsWith(".json") &&
        (!network || f.includes(network))
    )
    .sort()
    .reverse();

  if (multisigFiles.length === 0) {
    throw new Error(
      `No multisig deployment found for level ${level}${
        network ? ` on ${network}` : ""
      }`
    );
  }

  const deploymentPath = `${deploymentsDir}/${multisigFiles[0]}`;
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));

  console.log("📂 Loaded multisig deployment:");
  console.log("   File:", deploymentPath);
  console.log("   Network:", deployment.network);
  console.log("   Address:", deployment.multisig.address);

  return deployment;
}

/**
 * Verify signer has access to multisig
 */
export async function verifySignerAccess(
  multisigAddress: string,
  signerAddress: string
): Promise<boolean> {
  const safe = await ethers.getContractAt("IGnosisSafe", multisigAddress);
  const isOwner = await safe.isOwner(signerAddress);

  console.log(
    `✅ Signer ${signerAddress} ${isOwner ? "has" : "does not have"} access to multisig`
  );

  return isOwner;
}

/**
 * Get multisig information
 */
export async function getMultisigInfo(
  multisigAddress: string
): Promise<{
  owners: string[];
  threshold: bigint;
}> {
  const safe = await ethers.getContractAt("IGnosisSafe", multisigAddress);

  const owners = await safe.getOwners();
  const threshold = await safe.getThreshold();

  console.log("\n📋 Multisig Information:");
  console.log("==========================================");
  console.log("Address:", multisigAddress);
  console.log("Owners:", owners.length);
  owners.forEach((owner, idx) => {
    console.log(`  ${idx + 1}. ${owner}`);
  });
  console.log("Threshold:", threshold.toString(), "/", owners.length);
  console.log("==========================================\n");

  return { owners, threshold };
}

/**
 * Display multisig dashboard URL
 */
export function getMultisigDashboardUrl(
  multisigAddress: string,
  network: string
): string {
  let prefix = "";

  switch (network.toLowerCase()) {
    case "ethereum":
    case "mainnet":
      prefix = "eth";
      break;
    case "sepolia":
      prefix = "sep";
      break;
    case "base":
      prefix = "base";
      break;
    case "basesepolia":
      prefix = "base-sep";
      break;
    default:
      prefix = network;
  }

  return `https://app.safe.global/${prefix}:${multisigAddress}`;
}

/**
 * Generate ownership transfer transaction data
 */
export async function generateOwnershipTransferData(
  contractAddress: string,
  newOwner: string,
  contractInterface: "Router402" | "FeeCollector402" | "Treasury402"
): Promise<{
  to: string;
  data: string;
  value: string;
}> {
  const contract = await ethers.getContractAt(contractInterface, contractAddress);

  // Ownable2Step requires two-step transfer
  const data = contract.interface.encodeFunctionData("transferOwnership", [
    newOwner,
  ]);

  return {
    to: contractAddress,
    data: data,
    value: "0",
  };
}

/**
 * Validate multisig configuration
 */
export function validateMultisigConfig(
  level: number,
  signers: string[],
  threshold: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate level
  if (![2, 3, 4].includes(level)) {
    errors.push(`Invalid level: ${level}. Must be 2, 3, or 4`);
  }

  // Validate signers
  if (signers.length === 0) {
    errors.push("No signers provided");
  }

  for (const signer of signers) {
    if (!ethers.isAddress(signer)) {
      errors.push(`Invalid signer address: ${signer}`);
    }
  }

  // Check for duplicates
  const uniqueSigners = [...new Set(signers)];
  if (uniqueSigners.length !== signers.length) {
    errors.push("Duplicate signer addresses detected");
  }

  // Validate threshold
  if (threshold <= 0) {
    errors.push("Threshold must be greater than 0");
  }

  if (threshold > signers.length) {
    errors.push(
      `Threshold (${threshold}) cannot exceed number of signers (${signers.length})`
    );
  }

  // Level-specific validation
  switch (level) {
    case 2: // Admin (2-of-3)
      if (signers.length !== 3) {
        errors.push(`Level 2 requires exactly 3 signers, got ${signers.length}`);
      }
      if (threshold !== 2) {
        errors.push(`Level 2 requires threshold of 2, got ${threshold}`);
      }
      break;

    case 3: // Treasury (3-of-5)
      if (signers.length !== 5) {
        errors.push(`Level 3 requires exactly 5 signers, got ${signers.length}`);
      }
      if (threshold !== 3) {
        errors.push(`Level 3 requires threshold of 3, got ${threshold}`);
      }
      break;

    case 4: // Emergency (1-of-3)
      if (signers.length !== 3) {
        errors.push(`Level 4 requires exactly 3 signers, got ${signers.length}`);
      }
      if (threshold !== 1) {
        errors.push(`Level 4 requires threshold of 1, got ${threshold}`);
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Display multisig hierarchy
 */
export function displayMultisigHierarchy(): void {
  console.log("\n📊 Multisig Hierarchy:");
  console.log("==========================================");

  console.log("\n🔐 Level 2: Admin Multisig (2-of-3)");
  console.log("Purpose: Contract configuration, pause controls");
  console.log("Permissions:");
  console.log("  - Pause/unpause contracts");
  console.log("  - Add/remove supported tokens");
  console.log("  - Approve/revoke bridges");
  console.log("  - Update fee parameters");
  console.log("Rotation: Quarterly or on-demand");

  console.log("\n💰 Level 3: Treasury Multisig (3-of-5)");
  console.log("Purpose: Fund withdrawals, treasury management");
  console.log("Permissions:");
  console.log("  - Withdraw collected fees");
  console.log("  - Manage treasury funds");
  console.log("  - Approve large transactions");
  console.log("Limits: Daily/monthly withdrawal caps");
  console.log("Rotation: Semi-annually");

  console.log("\n🚨 Level 4: Emergency Response (1-of-3)");
  console.log("Purpose: Emergency pause, critical incident response");
  console.log("Permissions:");
  console.log("  - Emergency pause only");
  console.log("  - Cannot withdraw funds");
  console.log("Authority: Fast response team");
  console.log("Activation: Immediate on security incident");

  console.log("==========================================\n");
}
