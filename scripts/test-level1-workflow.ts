/**
 * Level 1 Developer Testing Workflow
 *
 * Purpose: Test multisig and deployment flows with a single developer wallet
 * Uses: Mock API responses, simulated signatures, testnet deployments
 * Level: 1-of-5 (all controlled by single dev wallet for testing)
 */

import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

// Mock API response structure
interface MockAPIResponse {
  success: boolean;
  signature?: string;
  timestamp: number;
  requestId: string;
  data?: any;
}

// Workflow state tracker
interface WorkflowState {
  step: number;
  contractAddress?: string;
  signatures: string[];
  transactions: string[];
  errors: string[];
}

class Level1TestingWorkflow {
  private devWallet: ethers.Wallet;
  private provider: ethers.Provider;
  private state: WorkflowState;
  private mockAPIUrl: string;

  constructor() {
    // Initialize with Level 1 developer wallet
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("PRIVATE_KEY not set in .env");
    }

    this.provider = ethers.provider;
    this.devWallet = new ethers.Wallet(privateKey, this.provider);
    this.mockAPIUrl = process.env.VLN_URL || "https://402.vln.gg";

    this.state = {
      step: 0,
      signatures: [],
      transactions: [],
      errors: []
    };

    console.log("🔧 Level 1 Testing Workflow Initialized");
    console.log(`📍 Developer Wallet: ${this.devWallet.address}`);
    console.log(`🌐 Mock API URL: ${this.mockAPIUrl}`);
  }

  /**
   * Step 1: Verify Level 1 Configuration
   */
  async verifyLevel1Config(): Promise<boolean> {
    console.log("\n📋 Step 1: Verifying Level 1 Configuration");
    this.state.step = 1;

    try {
      // Check all Level 1 signers are set to dev wallet
      const level1Signers = [
        process.env.LEVEL1_SIGNER1,
        process.env.LEVEL1_SIGNER2,
        process.env.LEVEL1_SIGNER3,
        process.env.LEVEL1_SIGNER4,
        process.env.LEVEL1_SIGNER5
      ];

      const devAddress = this.devWallet.address.toLowerCase();
      const allMatch = level1Signers.every(
        signer => signer?.toLowerCase() === devAddress
      );

      if (!allMatch) {
        console.log("⚠️  Warning: Not all LEVEL1_SIGNERx addresses match dev wallet");
        console.log(`   Expected: ${devAddress}`);
        level1Signers.forEach((signer, i) => {
          if (signer?.toLowerCase() !== devAddress) {
            console.log(`   LEVEL1_SIGNER${i + 1}: ${signer} ❌`);
          }
        });
        return false;
      }

      console.log("✅ All Level 1 signers configured correctly");
      console.log(`   Threshold: 1-of-${level1Signers.length}`);
      console.log(`   All signers: ${devAddress}`);

      // Check network
      const network = await this.provider.getNetwork();
      console.log(`✅ Network: ${network.name} (ChainID: ${network.chainId})`);

      // Check wallet balance
      const balance = await this.provider.getBalance(this.devWallet.address);
      console.log(`✅ Wallet Balance: ${ethers.formatEther(balance)} ETH`);

      if (balance === 0n) {
        console.log("⚠️  Warning: Wallet has 0 ETH. Get testnet funds first!");
        return false;
      }

      return true;
    } catch (error) {
      console.error("❌ Configuration verification failed:", error);
      this.state.errors.push(`Step 1: ${error}`);
      return false;
    }
  }

  /**
   * Step 2: Mock API - Request Deployment Authorization
   */
  async mockAPIRequestAuthorization(): Promise<MockAPIResponse> {
    console.log("\n🌐 Step 2: Mock API - Request Deployment Authorization");
    this.state.step = 2;

    try {
      // Simulate API request for deployment authorization
      const requestData = {
        level: 1,
        requestor: this.devWallet.address,
        action: "deploy_contracts",
        network: (await this.provider.getNetwork()).name,
        timestamp: Date.now()
      };

      console.log("📤 Sending authorization request to mock API...");
      console.log(`   Request: ${JSON.stringify(requestData, null, 2)}`);

      // Mock API response (in production, this would be a real HTTP request)
      const mockResponse: MockAPIResponse = {
        success: true,
        requestId: `req_${Date.now()}`,
        timestamp: Date.now(),
        data: {
          authorized: true,
          level: 1,
          signers_required: 1,
          expires_at: Date.now() + 3600000 // 1 hour
        }
      };

      console.log("📥 Mock API Response:");
      console.log(JSON.stringify(mockResponse, null, 2));
      console.log("✅ Authorization granted by mock API");

      return mockResponse;
    } catch (error) {
      console.error("❌ Mock API request failed:", error);
      this.state.errors.push(`Step 2: ${error}`);
      throw error;
    }
  }

  /**
   * Step 3: Generate Level 1 Signature
   */
  async generateLevel1Signature(message: string): Promise<string> {
    console.log("\n✍️  Step 3: Generate Level 1 Signature");
    this.state.step = 3;

    try {
      console.log(`📝 Message to sign: ${message}`);

      // Create message hash
      const messageHash = ethers.id(message);
      console.log(`🔐 Message hash: ${messageHash}`);

      // Sign with dev wallet
      const signature = await this.devWallet.signMessage(ethers.getBytes(messageHash));
      console.log(`✅ Signature generated: ${signature.slice(0, 20)}...`);

      // Verify signature
      const recoveredAddress = ethers.verifyMessage(
        ethers.getBytes(messageHash),
        signature
      );

      if (recoveredAddress.toLowerCase() !== this.devWallet.address.toLowerCase()) {
        throw new Error("Signature verification failed!");
      }

      console.log(`✅ Signature verified: ${recoveredAddress}`);
      this.state.signatures.push(signature);

      return signature;
    } catch (error) {
      console.error("❌ Signature generation failed:", error);
      this.state.errors.push(`Step 3: ${error}`);
      throw error;
    }
  }

  /**
   * Step 4: Deploy Test Contract (CREATE2Factory)
   */
  async deployTestContract(): Promise<string> {
    console.log("\n🚀 Step 4: Deploy Test Contract (CREATE2Factory)");
    this.state.step = 4;

    try {
      console.log("📦 Deploying CREATE2Factory...");

      const CREATE2Factory = await ethers.getContractFactory("CREATE2Factory");
      const factory = await CREATE2Factory.deploy();
      await factory.waitForDeployment();

      const address = await factory.getAddress();
      console.log(`✅ CREATE2Factory deployed at: ${address}`);

      this.state.contractAddress = address;

      // Get deployment transaction
      const deployTx = factory.deploymentTransaction();
      if (deployTx) {
        console.log(`📝 Deployment TX: ${deployTx.hash}`);
        this.state.transactions.push(deployTx.hash);
      }

      return address;
    } catch (error) {
      console.error("❌ Contract deployment failed:", error);
      this.state.errors.push(`Step 4: ${error}`);
      throw error;
    }
  }

  /**
   * Step 5: Mock API - Register Deployment
   */
  async mockAPIRegisterDeployment(contractAddress: string): Promise<MockAPIResponse> {
    console.log("\n🌐 Step 5: Mock API - Register Deployment");
    this.state.step = 5;

    try {
      const deploymentData = {
        contract_address: contractAddress,
        deployer: this.devWallet.address,
        network: (await this.provider.getNetwork()).name,
        contract_type: "CREATE2Factory",
        timestamp: Date.now(),
        signature: this.state.signatures[0]
      };

      console.log("📤 Registering deployment with mock API...");
      console.log(`   Data: ${JSON.stringify(deploymentData, null, 2)}`);

      // Mock API response
      const mockResponse: MockAPIResponse = {
        success: true,
        requestId: `deploy_${Date.now()}`,
        timestamp: Date.now(),
        data: {
          deployment_id: `dep_${Date.now()}`,
          verified: true,
          explorer_url: `https://sepolia.basescan.org/address/${contractAddress}`
        }
      };

      console.log("📥 Mock API Response:");
      console.log(JSON.stringify(mockResponse, null, 2));
      console.log("✅ Deployment registered successfully");

      return mockResponse;
    } catch (error) {
      console.error("❌ Deployment registration failed:", error);
      this.state.errors.push(`Step 5: ${error}`);
      throw error;
    }
  }

  /**
   * Step 6: Test Multisig Transaction Flow (Simulated)
   */
  async testMultisigFlow(): Promise<void> {
    console.log("\n🔐 Step 6: Test Multisig Transaction Flow (Simulated)");
    this.state.step = 6;

    try {
      // Simulate a multisig transaction that needs signing
      const txData = {
        to: this.state.contractAddress,
        value: 0,
        data: "0x", // Empty data for test
        operation: 0, // CALL
        nonce: 0
      };

      console.log("📝 Multisig Transaction Data:");
      console.log(JSON.stringify(txData, null, 2));

      // Generate signature for transaction
      const txHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "uint256", "bytes", "uint8", "uint256"],
          [txData.to, txData.value, txData.data, txData.operation, txData.nonce]
        )
      );

      console.log(`🔐 Transaction hash: ${txHash}`);

      // Sign with dev wallet (simulating 1-of-5 approval)
      const signature = await this.devWallet.signMessage(ethers.getBytes(txHash));
      console.log(`✅ Signature 1/1: ${signature.slice(0, 20)}...`);

      this.state.signatures.push(signature);
      console.log("✅ Multisig flow test completed");
      console.log(`   Signatures collected: ${this.state.signatures.length}`);
      console.log(`   Threshold met: 1/1 ✓`);
    } catch (error) {
      console.error("❌ Multisig flow test failed:", error);
      this.state.errors.push(`Step 6: ${error}`);
      throw error;
    }
  }

  /**
   * Step 7: Mock API - Verify Complete Workflow
   */
  async mockAPIVerifyWorkflow(): Promise<MockAPIResponse> {
    console.log("\n🌐 Step 7: Mock API - Verify Complete Workflow");
    this.state.step = 7;

    try {
      const workflowData = {
        workflow_id: `wf_${Date.now()}`,
        level: 1,
        deployer: this.devWallet.address,
        contract_address: this.state.contractAddress,
        signatures_count: this.state.signatures.length,
        transactions_count: this.state.transactions.length,
        errors_count: this.state.errors.length,
        timestamp: Date.now()
      };

      console.log("📤 Verifying workflow with mock API...");
      console.log(`   Data: ${JSON.stringify(workflowData, null, 2)}`);

      // Mock API response
      const mockResponse: MockAPIResponse = {
        success: true,
        requestId: `verify_${Date.now()}`,
        timestamp: Date.now(),
        data: {
          workflow_status: "completed",
          all_checks_passed: this.state.errors.length === 0,
          ready_for_production: false, // Level 1 is testing only
          next_step: "Deploy to Level 2 (Admin Multisig) for staging"
        }
      };

      console.log("📥 Mock API Response:");
      console.log(JSON.stringify(mockResponse, null, 2));
      console.log("✅ Workflow verification completed");

      return mockResponse;
    } catch (error) {
      console.error("❌ Workflow verification failed:", error);
      this.state.errors.push(`Step 7: ${error}`);
      throw error;
    }
  }

  /**
   * Generate Workflow Report
   */
  generateReport(): void {
    console.log("\n" + "=".repeat(60));
    console.log("📊 LEVEL 1 TESTING WORKFLOW REPORT");
    console.log("=".repeat(60));

    console.log("\n✅ Completed Steps:");
    console.log(`   Total Steps: ${this.state.step}/7`);

    console.log("\n📝 Signatures Generated:");
    this.state.signatures.forEach((sig, i) => {
      console.log(`   ${i + 1}. ${sig.slice(0, 20)}...${sig.slice(-10)}`);
    });

    console.log("\n📜 Transactions:");
    this.state.transactions.forEach((tx, i) => {
      console.log(`   ${i + 1}. ${tx}`);
    });

    if (this.state.contractAddress) {
      console.log("\n🏗️  Deployed Contract:");
      console.log(`   Address: ${this.state.contractAddress}`);
    }

    if (this.state.errors.length > 0) {
      console.log("\n❌ Errors:");
      this.state.errors.forEach((err, i) => {
        console.log(`   ${i + 1}. ${err}`);
      });
    } else {
      console.log("\n✨ No errors - All tests passed!");
    }

    console.log("\n" + "=".repeat(60));
    console.log("🎯 Next Steps:");
    console.log("   1. Review workflow output above");
    console.log("   2. Fix any errors if present");
    console.log("   3. Update to Level 2 (2-of-3) for staging");
    console.log("   4. Coordinate real signers for production");
    console.log("=".repeat(60) + "\n");
  }

  /**
   * Run Complete Workflow
   */
  async runCompleteWorkflow(): Promise<void> {
    console.log("\n" + "=".repeat(60));
    console.log("🚀 STARTING LEVEL 1 TESTING WORKFLOW");
    console.log("=".repeat(60));

    try {
      // Step 1: Verify configuration
      const configValid = await this.verifyLevel1Config();
      if (!configValid) {
        throw new Error("Configuration validation failed. Fix .env and try again.");
      }

      // Step 2: Request API authorization
      await this.mockAPIRequestAuthorization();

      // Step 3: Generate signature
      const message = `Level1 Deployment Authorization - ${Date.now()}`;
      await this.generateLevel1Signature(message);

      // Step 4: Deploy contract
      const contractAddress = await this.deployTestContract();

      // Step 5: Register deployment
      await this.mockAPIRegisterDeployment(contractAddress);

      // Step 6: Test multisig flow
      await this.testMultisigFlow();

      // Step 7: Verify complete workflow
      await this.mockAPIVerifyWorkflow();

      // Generate report
      this.generateReport();

      console.log("\n✅ LEVEL 1 TESTING WORKFLOW COMPLETED SUCCESSFULLY!\n");
    } catch (error) {
      console.error("\n❌ WORKFLOW FAILED:", error);
      this.generateReport();
      process.exit(1);
    }
  }
}

// Execute workflow if run directly
async function main() {
  const workflow = new Level1TestingWorkflow();
  await workflow.runCompleteWorkflow();
}

// Run if executed directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { Level1TestingWorkflow, MockAPIResponse, WorkflowState };
