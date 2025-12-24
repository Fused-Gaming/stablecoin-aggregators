// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable2Step.sol";

/**
 * @title CREATE2Factory
 * @author VLN Security Research
 * @notice Deterministic contract deployment factory using CREATE2
 * @dev Enables same contract addresses across different chains
 *
 * Security Features:
 * - Deterministic address generation
 * - Pre-deployment address verification
 * - Post-deployment bytecode verification
 * - Salt generation with chain-specific entropy
 * - Deployment authorization controls
 */
contract CREATE2Factory is Ownable2Step {

    // ============ State Variables ============

    /// @notice Mapping to track deployed contracts
    mapping(address => bool) public isDeployed;

    /// @notice Mapping to track deployment salts used
    mapping(bytes32 => bool) public saltUsed;

    /// @notice Counter for total deployments
    uint256 public deploymentCount;

    // ============ Events ============

    event ContractDeployed(
        address indexed contractAddress,
        bytes32 indexed salt,
        bytes32 bytecodeHash,
        address indexed deployer,
        uint256 timestamp
    );

    event DeploymentFailed(
        bytes32 indexed salt,
        address indexed deployer,
        string reason
    );

    // ============ Errors ============

    error Create2DeploymentFailed();
    error SaltAlreadyUsed(bytes32 salt);
    error InvalidBytecode();
    error AddressMismatch(address expected, address actual);

    // ============ Constructor ============

    constructor() Ownable(msg.sender) {}

    // ============ Core Functions ============

    /**
     * @notice Deploy a contract using CREATE2
     * @param bytecode The contract bytecode to deploy
     * @param salt The salt for deterministic address generation
     * @return deployedAddress The address of the deployed contract
     *
     * @dev Salt should include chain-specific entropy to prevent cross-chain issues
     */
    function deploy(
        bytes memory bytecode,
        bytes32 salt
    ) external onlyOwner returns (address deployedAddress) {
        // Check if salt has been used
        if (saltUsed[salt]) {
            revert SaltAlreadyUsed(salt);
        }

        // Validate bytecode
        if (bytecode.length == 0) {
            revert InvalidBytecode();
        }

        // Pre-compute expected address
        address expectedAddress = computeAddress(bytecode, salt);

        // Deploy using CREATE2
        assembly {
            deployedAddress := create2(
                0,                          // no value
                add(bytecode, 0x20),       // bytecode starts after length
                mload(bytecode),            // bytecode length
                salt                        // salt for deterministic address
            )
        }

        // Check deployment success
        if (deployedAddress == address(0)) {
            revert Create2DeploymentFailed();
        }

        // Verify address matches expected
        if (deployedAddress != expectedAddress) {
            revert AddressMismatch(expectedAddress, deployedAddress);
        }

        // Mark salt as used and contract as deployed
        saltUsed[salt] = true;
        isDeployed[deployedAddress] = true;
        deploymentCount++;

        // Emit event
        emit ContractDeployed(
            deployedAddress,
            salt,
            keccak256(bytecode),
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @notice Deploy a contract with constructor arguments using CREATE2
     * @param creationCode The contract creation code (bytecode + encoded constructor args)
     * @param salt The salt for deterministic address generation
     * @return deployedAddress The address of the deployed contract
     *
     * @dev Creation code = bytecode + abi.encode(constructor args)
     */
    function deployWithConstructor(
        bytes memory creationCode,
        bytes32 salt
    ) external onlyOwner returns (address deployedAddress) {
        // Check if salt has been used
        if (saltUsed[salt]) {
            revert SaltAlreadyUsed(salt);
        }

        // Validate creation code
        if (creationCode.length == 0) {
            revert InvalidBytecode();
        }

        // Deploy using CREATE2
        assembly {
            deployedAddress := create2(
                0,                              // no value
                add(creationCode, 0x20),       // creation code starts after length
                mload(creationCode),            // creation code length
                salt                            // salt for deterministic address
            )
        }

        // Check deployment success
        if (deployedAddress == address(0)) {
            revert Create2DeploymentFailed();
        }

        // Mark salt as used and contract as deployed
        saltUsed[salt] = true;
        isDeployed[deployedAddress] = true;
        deploymentCount++;

        // Emit event
        emit ContractDeployed(
            deployedAddress,
            salt,
            keccak256(creationCode),
            msg.sender,
            block.timestamp
        );
    }

    // ============ View Functions ============

    /**
     * @notice Compute the address of a contract before deployment
     * @param bytecode The contract bytecode
     * @param salt The salt for deterministic address generation
     * @return predicted The predicted contract address
     *
     * @dev Uses the CREATE2 address formula:
     *      address = keccak256(0xff ++ factory_address ++ salt ++ keccak256(bytecode))[12:]
     */
    function computeAddress(
        bytes memory bytecode,
        bytes32 salt
    ) public view returns (address predicted) {
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                salt,
                keccak256(bytecode)
            )
        );

        // Convert hash to address (take last 20 bytes)
        predicted = address(uint160(uint256(hash)));
    }

    /**
     * @notice Compute the address for deployment with constructor
     * @param creationCode The contract creation code (bytecode + constructor args)
     * @param salt The salt for deterministic address generation
     * @return predicted The predicted contract address
     */
    function computeAddressWithConstructor(
        bytes memory creationCode,
        bytes32 salt
    ) public view returns (address predicted) {
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                salt,
                keccak256(creationCode)
            )
        );

        predicted = address(uint160(uint256(hash)));
    }

    /**
     * @notice Generate a salt from a base string and chain ID
     * @param baseSalt A base string for salt generation (e.g., "402.vln.gg-v1")
     * @param chainId The chain ID for chain-specific entropy
     * @param nonce Additional nonce for uniqueness
     * @return salt The generated salt
     *
     * @dev This ensures different salts for different chains
     */
    function generateSalt(
        string memory baseSalt,
        uint256 chainId,
        uint256 nonce
    ) public pure returns (bytes32 salt) {
        salt = keccak256(abi.encodePacked(baseSalt, chainId, nonce));
    }

    /**
     * @notice Verify that a deployed contract matches expected bytecode
     * @param contractAddress The address of the deployed contract
     * @param expectedBytecodeHash The expected keccak256 hash of the runtime bytecode
     * @return isValid True if bytecode matches
     *
     * @dev Compares runtime bytecode (not creation code) hash
     */
    function verifyDeployedBytecode(
        address contractAddress,
        bytes32 expectedBytecodeHash
    ) public view returns (bool isValid) {
        bytes32 actualHash;

        assembly {
            // Get size of code at address
            let size := extcodesize(contractAddress)

            // Allocate memory for code
            let code := mload(0x40)

            // Copy code to memory
            extcodecopy(contractAddress, code, 0, size)

            // Hash the code
            actualHash := keccak256(code, size)
        }

        isValid = (actualHash == expectedBytecodeHash);
    }

    /**
     * @notice Get the runtime bytecode hash of a deployed contract
     * @param contractAddress The address of the contract
     * @return bytecodeHash The keccak256 hash of the runtime bytecode
     */
    function getDeployedBytecodeHash(
        address contractAddress
    ) public view returns (bytes32 bytecodeHash) {
        assembly {
            // Get size of code at address
            let size := extcodesize(contractAddress)

            // Allocate memory for code
            let code := mload(0x40)

            // Copy code to memory
            extcodecopy(contractAddress, code, 0, size)

            // Hash the code
            bytecodeHash := keccak256(code, size)
        }
    }

    /**
     * @notice Check if a contract has been deployed at an address
     * @param contractAddress The address to check
     * @return hasCode True if contract exists at address
     */
    function hasCode(address contractAddress) public view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(contractAddress)
        }
        return size > 0;
    }
}
