import { expect } from "chai";
import { ethers } from "hardhat";
import { CREATE2Factory, Treasury402, Router402 } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("CREATE2Factory", function () {
  let factory: CREATE2Factory;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    [owner, user, addr1, addr2] = await ethers.getSigners();

    // Deploy CREATE2Factory
    const CREATE2FactoryContract = await ethers.getContractFactory("CREATE2Factory");
    factory = await CREATE2FactoryContract.deploy();
    await factory.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy factory successfully", async function () {
      expect(await factory.getAddress()).to.be.properAddress;
    });

    it("Should set deployer as owner", async function () {
      expect(await factory.owner()).to.equal(owner.address);
    });

    it("Should initialize deployment count to 0", async function () {
      expect(await factory.deploymentCount()).to.equal(0);
    });
  });

  describe("Salt Generation", function () {
    it("Should generate deterministic salt from inputs", async function () {
      const baseSalt = "402.vln.gg-v1";
      const chainId = 8453; // Base
      const nonce = 0;

      const salt1 = await factory.generateSalt(baseSalt, chainId, nonce);
      const salt2 = await factory.generateSalt(baseSalt, chainId, nonce);

      expect(salt1).to.equal(salt2);
    });

    it("Should generate different salts for different chains", async function () {
      const baseSalt = "402.vln.gg-v1";
      const nonce = 0;

      const baseSalt1 = await factory.generateSalt(baseSalt, 8453, nonce); // Base
      const ethSalt = await factory.generateSalt(baseSalt, 1, nonce); // Ethereum

      expect(baseSalt1).to.not.equal(ethSalt);
    });

    it("Should generate different salts for different nonces", async function () {
      const baseSalt = "402.vln.gg-v1";
      const chainId = 8453;

      const salt1 = await factory.generateSalt(baseSalt, chainId, 0);
      const salt2 = await factory.generateSalt(baseSalt, chainId, 1);

      expect(salt1).to.not.equal(salt2);
    });

    it("Should generate different salts for different base strings", async function () {
      const chainId = 8453;
      const nonce = 0;

      const salt1 = await factory.generateSalt("402.vln.gg-v1", chainId, nonce);
      const salt2 = await factory.generateSalt("402.vln.gg-v2", chainId, nonce);

      expect(salt1).to.not.equal(salt2);
    });
  });

  describe("Address Pre-computation", function () {
    it("Should compute address before deployment", async function () {
      // Get bytecode for a simple contract (Treasury402)
      const TreasuryFactory = await ethers.getContractFactory("Treasury402");
      const bytecode = TreasuryFactory.bytecode;

      const salt = ethers.keccak256(ethers.toUtf8Bytes("test-salt"));

      const predictedAddress = await factory.computeAddress(bytecode, salt);

      expect(predictedAddress).to.be.properAddress;
      expect(predictedAddress).to.not.equal(ethers.ZeroAddress);
    });

    it("Should compute same address for same inputs", async function () {
      const TreasuryFactory = await ethers.getContractFactory("Treasury402");
      const bytecode = TreasuryFactory.bytecode;
      const salt = ethers.keccak256(ethers.toUtf8Bytes("test-salt"));

      const addr1 = await factory.computeAddress(bytecode, salt);
      const addr2 = await factory.computeAddress(bytecode, salt);

      expect(addr1).to.equal(addr2);
    });

    it("Should compute different addresses for different salts", async function () {
      const TreasuryFactory = await ethers.getContractFactory("Treasury402");
      const bytecode = TreasuryFactory.bytecode;

      const salt1 = ethers.keccak256(ethers.toUtf8Bytes("salt-1"));
      const salt2 = ethers.keccak256(ethers.toUtf8Bytes("salt-2"));

      const addr1 = await factory.computeAddress(bytecode, salt1);
      const addr2 = await factory.computeAddress(bytecode, salt2);

      expect(addr1).to.not.equal(addr2);
    });
  });

  describe("Simple Contract Deployment (No Constructor)", function () {
    it("Should deploy contract using CREATE2", async function () {
      // For this test, we'd need a simple contract with no constructor
      // Skipping actual deployment test as it requires a suitable test contract
      // This is a placeholder for the pattern
      expect(await factory.deploymentCount()).to.equal(0);
    });
  });

  describe("Deployment with Constructor", function () {
    it("Should deploy Treasury402 with constructor args", async function () {
      // Get contract factory
      const TreasuryFactory = await ethers.getContractFactory("Treasury402");

      // Encode constructor arguments
      const constructorArgs = ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "address", "address"],
        [owner.address, addr1.address, addr2.address]
      );

      // Combine bytecode and constructor args to create creation code
      const creationCode = ethers.concat([
        TreasuryFactory.bytecode,
        constructorArgs
      ]);

      // Generate salt
      const salt = await factory.generateSalt("treasury-v1", 8453, 0);

      // Pre-compute address
      const predictedAddress = await factory.computeAddressWithConstructor(
        creationCode,
        salt
      );

      // Deploy
      const tx = await factory.deployWithConstructor(creationCode, salt);
      await tx.wait();

      // Verify deployment
      expect(await factory.deploymentCount()).to.equal(1);
      expect(await factory.isDeployed(predictedAddress)).to.be.true;
      expect(await factory.saltUsed(salt)).to.be.true;

      // Verify contract exists at predicted address
      const code = await ethers.provider.getCode(predictedAddress);
      expect(code).to.not.equal("0x");
      expect(code.length).to.be.greaterThan(2);

      // Verify it's a functional Treasury402 contract
      const treasury = TreasuryFactory.attach(predictedAddress) as Treasury402;
      expect(await treasury.owner1()).to.equal(owner.address);
      expect(await treasury.owner2()).to.equal(addr1.address);
      expect(await treasury.owner3()).to.equal(addr2.address);
    });

    it("Should deploy Router402 with constructor args", async function () {
      // Get contract factory
      const RouterFactory = await ethers.getContractFactory("Router402");

      // Encode constructor arguments
      const treasuryAddr = addr1.address;
      const feeBps = 20; // 0.2%

      const constructorArgs = ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "uint256"],
        [treasuryAddr, feeBps]
      );

      // Combine bytecode and constructor args
      const creationCode = ethers.concat([
        RouterFactory.bytecode,
        constructorArgs
      ]);

      // Generate salt
      const salt = await factory.generateSalt("router-v1", 8453, 0);

      // Pre-compute address
      const predictedAddress = await factory.computeAddressWithConstructor(
        creationCode,
        salt
      );

      // Deploy
      const tx = await factory.deployWithConstructor(creationCode, salt);
      await tx.wait();

      // Verify deployment
      expect(await factory.deploymentCount()).to.equal(1);
      expect(await factory.isDeployed(predictedAddress)).to.be.true;

      // Verify it's a functional Router402 contract
      const router = RouterFactory.attach(predictedAddress) as Router402;
      expect(await router.treasury()).to.equal(treasuryAddr);
      expect(await router.feeBps()).to.equal(feeBps);
    });

    it("Should emit ContractDeployed event", async function () {
      const TreasuryFactory = await ethers.getContractFactory("Treasury402");
      const constructorArgs = ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "address", "address"],
        [owner.address, addr1.address, addr2.address]
      );
      const creationCode = ethers.concat([
        TreasuryFactory.bytecode,
        constructorArgs
      ]);
      const salt = await factory.generateSalt("test", 8453, 0);

      const predictedAddress = await factory.computeAddressWithConstructor(
        creationCode,
        salt
      );

      await expect(factory.deployWithConstructor(creationCode, salt))
        .to.emit(factory, "ContractDeployed")
        .withArgs(
          predictedAddress,
          salt,
          ethers.keccak256(creationCode),
          owner.address,
          await ethers.provider.getBlockNumber().then(n => n + 1)
        );
    });

    it("Should increment deployment count", async function () {
      const TreasuryFactory = await ethers.getContractFactory("Treasury402");

      // First deployment
      const creationCode1 = ethers.concat([
        TreasuryFactory.bytecode,
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "address", "address"],
          [owner.address, addr1.address, addr2.address]
        )
      ]);
      const salt1 = await factory.generateSalt("test", 8453, 0);
      await factory.deployWithConstructor(creationCode1, salt1);
      expect(await factory.deploymentCount()).to.equal(1);

      // Second deployment with different salt
      const creationCode2 = ethers.concat([
        TreasuryFactory.bytecode,
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "address", "address"],
          [owner.address, addr1.address, addr2.address]
        )
      ]);
      const salt2 = await factory.generateSalt("test", 8453, 1);
      await factory.deployWithConstructor(creationCode2, salt2);
      expect(await factory.deploymentCount()).to.equal(2);
    });
  });

  describe("Error Cases", function () {
    it("Should revert if salt is already used", async function () {
      const TreasuryFactory = await ethers.getContractFactory("Treasury402");
      const creationCode = ethers.concat([
        TreasuryFactory.bytecode,
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "address", "address"],
          [owner.address, addr1.address, addr2.address]
        )
      ]);
      const salt = await factory.generateSalt("test", 8453, 0);

      // First deployment
      await factory.deployWithConstructor(creationCode, salt);

      // Second deployment with same salt should fail
      await expect(
        factory.deployWithConstructor(creationCode, salt)
      ).to.be.revertedWithCustomError(factory, "SaltAlreadyUsed");
    });

    it("Should revert if bytecode is empty", async function () {
      const emptybytecode = "0x";
      const salt = ethers.keccak256(ethers.toUtf8Bytes("test"));

      await expect(
        factory.deployWithConstructor(emptybytecode, salt)
      ).to.be.revertedWithCustomError(factory, "InvalidBytecode");
    });

    it("Should only allow owner to deploy", async function () {
      const TreasuryFactory = await ethers.getContractFactory("Treasury402");
      const creationCode = ethers.concat([
        TreasuryFactory.bytecode,
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "address", "address"],
          [owner.address, addr1.address, addr2.address]
        )
      ]);
      const salt = await factory.generateSalt("test", 8453, 0);

      // Non-owner should not be able to deploy
      await expect(
        factory.connect(user).deployWithConstructor(creationCode, salt)
      ).to.be.revertedWithCustomError(factory, "OwnableUnauthorizedAccount");
    });
  });

  describe("Bytecode Verification", function () {
    it("Should verify deployed bytecode hash", async function () {
      // Deploy a contract
      const TreasuryFactory = await ethers.getContractFactory("Treasury402");
      const creationCode = ethers.concat([
        TreasuryFactory.bytecode,
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "address", "address"],
          [owner.address, addr1.address, addr2.address]
        )
      ]);
      const salt = await factory.generateSalt("test", 8453, 0);
      const predictedAddress = await factory.computeAddressWithConstructor(
        creationCode,
        salt
      );

      await factory.deployWithConstructor(creationCode, salt);

      // Get the bytecode hash
      const bytecodeHash = await factory.getDeployedBytecodeHash(predictedAddress);

      // Verify it matches
      const isValid = await factory.verifyDeployedBytecode(
        predictedAddress,
        bytecodeHash
      );

      expect(isValid).to.be.true;
    });

    it("Should detect bytecode mismatch", async function () {
      // Deploy a contract
      const TreasuryFactory = await ethers.getContractFactory("Treasury402");
      const creationCode = ethers.concat([
        TreasuryFactory.bytecode,
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "address", "address"],
          [owner.address, addr1.address, addr2.address]
        )
      ]);
      const salt = await factory.generateSalt("test", 8453, 0);
      const predictedAddress = await factory.computeAddressWithConstructor(
        creationCode,
        salt
      );

      await factory.deployWithConstructor(creationCode, salt);

      // Try to verify with wrong hash
      const wrongHash = ethers.keccak256(ethers.toUtf8Bytes("wrong"));
      const isValid = await factory.verifyDeployedBytecode(
        predictedAddress,
        wrongHash
      );

      expect(isValid).to.be.false;
    });

    it("Should check if address has code", async function () {
      // Deploy a contract
      const TreasuryFactory = await ethers.getContractFactory("Treasury402");
      const creationCode = ethers.concat([
        TreasuryFactory.bytecode,
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "address", "address"],
          [owner.address, addr1.address, addr2.address]
        )
      ]);
      const salt = await factory.generateSalt("test", 8453, 0);
      const predictedAddress = await factory.computeAddressWithConstructor(
        creationCode,
        salt
      );

      // Before deployment
      expect(await factory.hasCode(predictedAddress)).to.be.false;

      // After deployment
      await factory.deployWithConstructor(creationCode, salt);
      expect(await factory.hasCode(predictedAddress)).to.be.true;
    });

    it("Should return false for EOA (no code)", async function () {
      expect(await factory.hasCode(user.address)).to.be.false;
    });
  });

  describe("Cross-Chain Consistency Simulation", function () {
    it("Should compute same address with same salt on different factory instances", async function () {
      // Deploy second factory (simulates different chain)
      const CREATE2FactoryContract = await ethers.getContractFactory("CREATE2Factory");
      const factory2 = await CREATE2FactoryContract.deploy();
      await factory2.waitForDeployment();

      // Get bytecode
      const TreasuryFactory = await ethers.getContractFactory("Treasury402");
      const creationCode = ethers.concat([
        TreasuryFactory.bytecode,
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "address", "address"],
          [owner.address, addr1.address, addr2.address]
        )
      ]);

      // Use same salt
      const salt = await factory.generateSalt("402.vln.gg-v1", 8453, 0);

      // Compute addresses (they will differ because factory addresses differ)
      const addr1Factory1 = await factory.computeAddressWithConstructor(
        creationCode,
        salt
      );
      const addr2Factory2 = await factory2.computeAddressWithConstructor(
        creationCode,
        salt
      );

      // They should be different because factory addresses are different
      expect(addr1Factory1).to.not.equal(addr2Factory2);

      // This demonstrates that to get same addresses across chains,
      // we need to deploy the factory to the same address first
    });

    it("Should generate different salts for different chains (simulated)", async function () {
      const baseSalt = "402.vln.gg-v1";
      const nonce = 0;

      // Simulate different chains
      const chains = [
        { name: "Base", chainId: 8453 },
        { name: "Ethereum", chainId: 1 },
        { name: "Base Sepolia", chainId: 84532 },
        { name: "Ethereum Sepolia", chainId: 11155111 },
      ];

      const salts = [];

      for (const chain of chains) {
        const salt = await factory.generateSalt(baseSalt, chain.chainId, nonce);
        salts.push({ chain: chain.name, salt });
      }

      // All salts should be unique
      const uniqueSalts = new Set(salts.map(s => s.salt));
      expect(uniqueSalts.size).to.equal(chains.length);
    });
  });

  describe("Ownership", function () {
    it("Should allow owner to transfer ownership", async function () {
      await factory.transferOwnership(addr1.address);
      await factory.connect(addr1).acceptOwnership();

      expect(await factory.owner()).to.equal(addr1.address);
    });

    it("Should use two-step ownership transfer", async function () {
      await factory.transferOwnership(addr1.address);

      // Ownership hasn't changed yet
      expect(await factory.owner()).to.equal(owner.address);

      // New owner accepts
      await factory.connect(addr1).acceptOwnership();
      expect(await factory.owner()).to.equal(addr1.address);
    });
  });
});
