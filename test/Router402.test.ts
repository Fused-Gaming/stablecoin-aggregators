import { expect } from "chai";
import { ethers } from "hardhat";
import { Router402, FeeCollector402 } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Router402", function () {
  let router: Router402;
  let feeCollector: FeeCollector402;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let treasury: SignerWithAddress;

  const INITIAL_FEE_BPS = 20; // 0.2%
  const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
  const SOCKET_ROUTER = "0x3a23F943181408EAC424116Af7b7790c94Cb97a5";

  beforeEach(async function () {
    [owner, user, treasury] = await ethers.getSigners();

    // Deploy router
    const Router = await ethers.getContractFactory("Router402");
    router = await Router.deploy(treasury.address, INITIAL_FEE_BPS);
    await router.waitForDeployment();

    // Deploy fee collector
    const FeeCollector = await ethers.getContractFactory("FeeCollector402");
    feeCollector = await FeeCollector.deploy(
      treasury.address,
      USDC_BASE,
      ethers.parseUnits("0.01", 6)
    );
    await feeCollector.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set correct treasury", async function () {
      expect(await router.treasury()).to.equal(treasury.address);
    });

    it("Should set correct fee", async function () {
      expect(await router.feeBps()).to.equal(INITIAL_FEE_BPS);
    });

    it("Should set correct owner", async function () {
      expect(await router.owner()).to.equal(owner.address);
    });
  });

  describe("Configuration", function () {
    it("Should add supported token", async function () {
      await router.setSupportedToken(USDC_BASE, true);
      expect(await router.supportedTokens(USDC_BASE)).to.be.true;
    });

    it("Should add approved bridge", async function () {
      await router.setApprovedBridge(SOCKET_ROUTER, true);
      expect(await router.approvedBridges(SOCKET_ROUTER)).to.be.true;
    });

    it("Should update treasury", async function () {
      const newTreasury = user.address;
      await router.setTreasury(newTreasury);
      expect(await router.treasury()).to.equal(newTreasury);
    });

    it("Should update fee", async function () {
      const newFee = 30;
      await router.setFee(newFee);
      expect(await router.feeBps()).to.equal(newFee);
    });

    it("Should reject fee > 1%", async function () {
      await expect(
        router.setFee(101)
      ).to.be.revertedWithCustomError(router, "FeeTooHigh");
    });
  });

  describe("Fee Calculation", function () {
    it("Should calculate 0.2% fee correctly", async function () {
      const amount = ethers.parseUnits("100", 6);
      const fee = await router.calculateFee(amount);
      const expectedFee = (amount * BigInt(20)) / BigInt(10000);
      expect(fee).to.equal(expectedFee);
    });

    it("Should calculate fees for various amounts", async function () {
      const testCases = [
        { amount: "10", expectedFee: "0.02" },
        { amount: "100", expectedFee: "0.2" },
        { amount: "1000", expectedFee: "2" },
        { amount: "10000", expectedFee: "20" },
      ];

      for (const { amount, expectedFee } of testCases) {
        const amountWei = ethers.parseUnits(amount, 6);
        const feeWei = await router.calculateFee(amountWei);
        expect(feeWei).to.equal(ethers.parseUnits(expectedFee, 6));
      }
    });
  });

  describe("Pause Functionality", function () {
    it("Should pause and unpause", async function () {
      await router.pause();
      expect(await router.paused()).to.be.true;

      await router.unpause();
      expect(await router.paused()).to.be.false;
    });

    it("Should have separate emergency pause", async function () {
      await router.setEmergencyPause(true);
      expect(await router.emergencyPause()).to.be.true;

      await router.setEmergencyPause(false);
      expect(await router.emergencyPause()).to.be.false;
    });
  });

  describe("FeeCollector402", function () {
    it("Should deploy with correct parameters", async function () {
      expect(await feeCollector.treasury()).to.equal(treasury.address);
      expect(await feeCollector.feeToken()).to.equal(USDC_BASE);
      expect(await feeCollector.baseFee()).to.equal(ethers.parseUnits("0.01", 6));
    });

    it("Should update base fee", async function () {
      const newFee = ethers.parseUnits("0.02", 6);
      await feeCollector.setBaseFee(newFee);
      expect(await feeCollector.baseFee()).to.equal(newFee);
    });
  });
});
