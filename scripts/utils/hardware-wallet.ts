import { ethers } from "hardhat";
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import Eth from "@ledgerhq/hw-app-eth";
import TrezorConnect from "trezor-connect";

/**
 * Hardware Wallet Types
 */
export enum HardwareWalletType {
  LEDGER = "ledger",
  TREZOR = "trezor",
  SOFTWARE = "software",
}

/**
 * Hardware Wallet Configuration
 */
export interface HardwareWalletConfig {
  type: HardwareWalletType;
  derivationPath?: string;
  address?: string;
}

/**
 * Ledger Wallet Integration
 */
export class LedgerWallet {
  private transport: any;
  private eth: any;
  private derivationPath: string;

  constructor(derivationPath: string = "m/44'/60'/0'/0/0") {
    this.derivationPath = derivationPath;
  }

  /**
   * Initialize Ledger connection
   */
  async connect(): Promise<void> {
    try {
      console.log("🔌 Connecting to Ledger device...");
      this.transport = await TransportNodeHid.create();
      this.eth = new Eth(this.transport);
      console.log("✅ Ledger connected successfully");
    } catch (error) {
      console.error("❌ Failed to connect to Ledger:", error);
      throw new Error("Please ensure your Ledger is connected and unlocked, and the Ethereum app is open");
    }
  }

  /**
   * Get Ledger address
   */
  async getAddress(): Promise<string> {
    if (!this.eth) {
      await this.connect();
    }

    try {
      const result = await this.eth.getAddress(this.derivationPath, false, true);
      return result.address;
    } catch (error) {
      console.error("❌ Failed to get Ledger address:", error);
      throw error;
    }
  }

  /**
   * Sign a transaction with Ledger
   */
  async signTransaction(transaction: any): Promise<string> {
    if (!this.eth) {
      await this.connect();
    }

    try {
      console.log("📝 Please confirm transaction on your Ledger device...");

      // Serialize the transaction
      const unsignedTx = ethers.Transaction.from(transaction);
      const serialized = unsignedTx.unsignedSerialized.substring(2);

      // Sign with Ledger
      const signature = await this.eth.signTransaction(
        this.derivationPath,
        serialized
      );

      // Combine signature components
      const signedTx = ethers.Transaction.from({
        ...transaction,
        signature: {
          r: "0x" + signature.r,
          s: "0x" + signature.s,
          v: parseInt(signature.v, 16),
        },
      });

      console.log("✅ Transaction signed successfully");
      return signedTx.serialized;
    } catch (error) {
      console.error("❌ Failed to sign transaction:", error);
      throw new Error("Transaction signing failed. Please check your Ledger device.");
    }
  }

  /**
   * Close Ledger connection
   */
  async disconnect(): Promise<void> {
    if (this.transport) {
      await this.transport.close();
      console.log("🔌 Ledger disconnected");
    }
  }
}

/**
 * Trezor Wallet Integration
 */
export class TrezorWallet {
  private derivationPath: string;
  private initialized: boolean = false;

  constructor(derivationPath: string = "m/44'/60'/0'/0/0") {
    this.derivationPath = derivationPath;
  }

  /**
   * Initialize Trezor connection
   */
  async connect(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log("🔌 Initializing Trezor Connect...");

      await TrezorConnect.init({
        lazyLoad: true,
        manifest: {
          email: "dev@vln.gg",
          appUrl: "https://402.vln.gg",
        },
      });

      this.initialized = true;
      console.log("✅ Trezor initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize Trezor:", error);
      throw new Error("Trezor initialization failed");
    }
  }

  /**
   * Get Trezor address
   */
  async getAddress(): Promise<string> {
    if (!this.initialized) {
      await this.connect();
    }

    try {
      const result = await TrezorConnect.ethereumGetAddress({
        path: this.derivationPath,
        showOnTrezor: false,
      });

      if (!result.success) {
        throw new Error(result.payload.error);
      }

      return result.payload.address;
    } catch (error) {
      console.error("❌ Failed to get Trezor address:", error);
      throw error;
    }
  }

  /**
   * Sign a transaction with Trezor
   */
  async signTransaction(transaction: any): Promise<string> {
    if (!this.initialized) {
      await this.connect();
    }

    try {
      console.log("📝 Please confirm transaction on your Trezor device...");

      const result = await TrezorConnect.ethereumSignTransaction({
        path: this.derivationPath,
        transaction: {
          to: transaction.to,
          value: "0x" + BigInt(transaction.value || 0).toString(16),
          gasPrice: "0x" + BigInt(transaction.gasPrice || 0).toString(16),
          gasLimit: "0x" + BigInt(transaction.gasLimit || 0).toString(16),
          nonce: "0x" + BigInt(transaction.nonce || 0).toString(16),
          data: transaction.data || "0x",
          chainId: transaction.chainId,
        },
      });

      if (!result.success) {
        throw new Error(result.payload.error);
      }

      const { v, r, s } = result.payload;

      const signedTx = ethers.Transaction.from({
        ...transaction,
        signature: { r, s, v: parseInt(v, 16) },
      });

      console.log("✅ Transaction signed successfully");
      return signedTx.serialized;
    } catch (error) {
      console.error("❌ Failed to sign transaction:", error);
      throw new Error("Transaction signing failed. Please check your Trezor device.");
    }
  }

  /**
   * Disconnect Trezor
   */
  async disconnect(): Promise<void> {
    if (this.initialized) {
      TrezorConnect.dispose();
      console.log("🔌 Trezor disconnected");
    }
  }
}

/**
 * Verify hardware wallet address matches expected address
 */
export async function verifyHardwareWalletAddress(
  wallet: LedgerWallet | TrezorWallet,
  expectedAddress?: string
): Promise<string> {
  const address = await wallet.getAddress();

  console.log("📍 Hardware Wallet Address:", address);

  if (expectedAddress && address.toLowerCase() !== expectedAddress.toLowerCase()) {
    throw new Error(
      `Address mismatch! Expected ${expectedAddress} but got ${address}`
    );
  }

  return address;
}

/**
 * Display hardware wallet information
 */
export function displayHardwareWalletInfo(
  type: HardwareWalletType,
  address: string,
  derivationPath: string
): void {
  console.log("\n" + "=".repeat(50));
  console.log("💼 Hardware Wallet Configuration");
  console.log("=".repeat(50));
  console.log(`Type: ${type.toUpperCase()}`);
  console.log(`Address: ${address}`);
  console.log(`Derivation Path: ${derivationPath}`);
  console.log("=".repeat(50) + "\n");
}
