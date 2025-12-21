import { ethers } from "hardhat";
import { Signer } from "ethers";
import {
  HardwareWalletType,
  HardwareWalletConfig,
  LedgerWallet,
  TrezorWallet,
  verifyHardwareWalletAddress,
  displayHardwareWalletInfo,
} from "./hardware-wallet";

/**
 * Signer Configuration
 */
export interface SignerConfig {
  useHardwareWallet: boolean;
  hardwareWalletType?: HardwareWalletType;
  derivationPath?: string;
  expectedAddress?: string;
}

/**
 * Hardware Wallet Signer Wrapper
 * Wraps hardware wallet functionality to work with ethers.js deployments
 */
export class HardwareWalletSigner extends Signer {
  private wallet: LedgerWallet | TrezorWallet;
  private walletAddress: string;
  provider: any;

  constructor(
    wallet: LedgerWallet | TrezorWallet,
    address: string,
    provider: any
  ) {
    super();
    this.wallet = wallet;
    this.walletAddress = address;
    this.provider = provider;
  }

  async getAddress(): Promise<string> {
    return this.walletAddress;
  }

  async signTransaction(transaction: any): Promise<string> {
    // Populate transaction fields
    const tx = await this.populateTransaction(transaction);

    // Get nonce if not provided
    if (tx.nonce === undefined) {
      tx.nonce = await this.provider.getTransactionCount(this.walletAddress);
    }

    // Get gas price if not provided
    if (tx.gasPrice === undefined && tx.maxFeePerGas === undefined) {
      const feeData = await this.provider.getFeeData();
      tx.gasPrice = feeData.gasPrice;
    }

    // Get chain ID
    if (tx.chainId === undefined) {
      const network = await this.provider.getNetwork();
      tx.chainId = Number(network.chainId);
    }

    // Sign with hardware wallet
    return await this.wallet.signTransaction(tx);
  }

  async signMessage(message: string | Uint8Array): Promise<string> {
    throw new Error(
      "Message signing not implemented for hardware wallets in this version"
    );
  }

  async signTypedData(
    domain: any,
    types: any,
    value: any
  ): Promise<string> {
    throw new Error(
      "Typed data signing not implemented for hardware wallets in this version"
    );
  }

  connect(provider: any): Signer {
    return new HardwareWalletSigner(this.wallet, this.walletAddress, provider);
  }
}

/**
 * Signer Factory
 * Creates either a software wallet signer or hardware wallet signer based on configuration
 */
export class SignerFactory {
  /**
   * Get signer based on configuration
   */
  static async getSigner(config: SignerConfig): Promise<Signer> {
    if (!config.useHardwareWallet) {
      return await SignerFactory.getSoftwareWalletSigner();
    }

    return await SignerFactory.getHardwareWalletSigner(
      config.hardwareWalletType || HardwareWalletType.LEDGER,
      config.derivationPath,
      config.expectedAddress
    );
  }

  /**
   * Get software wallet signer (from private key)
   */
  private static async getSoftwareWalletSigner(): Promise<Signer> {
    console.log("🔑 Using software wallet (private key)");

    const [signer] = await ethers.getSigners();

    if (!signer) {
      throw new Error(
        "No signer available. Please set PRIVATE_KEY in your .env file"
      );
    }

    const address = await signer.getAddress();
    const balance = await signer.provider.getBalance(address);

    console.log("📍 Deployer Address:", address);
    console.log("💰 Balance:", ethers.formatEther(balance), "ETH");

    return signer;
  }

  /**
   * Get hardware wallet signer
   */
  private static async getHardwareWalletSigner(
    type: HardwareWalletType,
    derivationPath?: string,
    expectedAddress?: string
  ): Promise<Signer> {
    console.log(`🔐 Using ${type.toUpperCase()} hardware wallet`);

    const path =
      derivationPath ||
      process.env[`${type.toUpperCase()}_DERIVATION_PATH`] ||
      "m/44'/60'/0'/0/0";

    let wallet: LedgerWallet | TrezorWallet;

    // Create hardware wallet instance
    if (type === HardwareWalletType.LEDGER) {
      wallet = new LedgerWallet(path);
    } else if (type === HardwareWalletType.TREZOR) {
      wallet = new TrezorWallet(path);
    } else {
      throw new Error(`Unsupported hardware wallet type: ${type}`);
    }

    // Connect to wallet
    await wallet.connect();

    // Verify address
    const address = await verifyHardwareWalletAddress(wallet, expectedAddress);

    // Display info
    displayHardwareWalletInfo(type, address, path);

    // Get provider
    const provider = ethers.provider;

    // Check balance
    const balance = await provider.getBalance(address);
    console.log("💰 Balance:", ethers.formatEther(balance), "ETH\n");

    if (balance === 0n) {
      console.warn(
        "⚠️  WARNING: Hardware wallet has zero balance! Please fund it before deploying.\n"
      );
    }

    // Create and return hardware wallet signer
    return new HardwareWalletSigner(wallet, address, provider);
  }

  /**
   * Get signer configuration from environment variables
   */
  static getConfigFromEnv(): SignerConfig {
    const useHardwareWallet = process.env.USE_HARDWARE_WALLET === "true";

    if (!useHardwareWallet) {
      return { useHardwareWallet: false };
    }

    // Determine hardware wallet type
    // Priority: explicitly set type, then check for Ledger address, default to Ledger
    let hardwareWalletType = HardwareWalletType.LEDGER;

    if (process.env.HARDWARE_WALLET_TYPE) {
      hardwareWalletType = process.env
        .HARDWARE_WALLET_TYPE as HardwareWalletType;
    }

    return {
      useHardwareWallet: true,
      hardwareWalletType,
      derivationPath:
        process.env[
          `${hardwareWalletType.toUpperCase()}_DERIVATION_PATH`
        ] || "m/44'/60'/0'/0/0",
      expectedAddress: process.env.LEDGER_ADDRESS,
    };
  }

  /**
   * Display signer information
   */
  static async displaySignerInfo(signer: Signer): Promise<void> {
    const address = await signer.getAddress();
    const balance = await signer.provider!.getBalance(address);
    const network = await signer.provider!.getNetwork();

    console.log("\n" + "=".repeat(50));
    console.log("🔐 Signer Information");
    console.log("=".repeat(50));
    console.log(`Address: ${address}`);
    console.log(`Balance: ${ethers.formatEther(balance)} ETH`);
    console.log(`Network: ${network.name} (Chain ID: ${network.chainId})`);
    console.log("=".repeat(50) + "\n");
  }
}

/**
 * Helper function to get a signer for deployment scripts
 */
export async function getDeploymentSigner(
  configOverride?: Partial<SignerConfig>
): Promise<Signer> {
  const config = {
    ...SignerFactory.getConfigFromEnv(),
    ...configOverride,
  };

  console.log("🚀 Initializing deployment signer...\n");

  const signer = await SignerFactory.getSigner(config);

  await SignerFactory.displaySignerInfo(signer);

  return signer;
}
