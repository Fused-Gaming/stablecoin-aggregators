// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Treasury402
 * @notice Simple multisig treasury for fee collection
 * @dev Requires 2/3 signatures for withdrawals
 */
contract Treasury402 {
    using SafeERC20 for IERC20;
    
    // ============ State ============
    
    address public owner1;
    address public owner2;
    address public owner3;
    
    mapping(bytes32 => uint256) public approvals;
    mapping(bytes32 => mapping(address => bool)) public hasApproved;
    mapping(bytes32 => bool) public executed;
    
    // ============ Events ============
    
    event Deposit(address indexed token, uint256 amount, address indexed from);
    event WithdrawalProposed(bytes32 indexed txId, address token, uint256 amount, address to);
    event WithdrawalApproved(bytes32 indexed txId, address indexed approver);
    event WithdrawalExecuted(bytes32 indexed txId, address token, uint256 amount, address to);
    
    // ============ Constructor ============
    
    constructor(address _owner1, address _owner2, address _owner3) {
        require(_owner1 != address(0) && _owner2 != address(0) && _owner3 != address(0), "Invalid owners");
        require(_owner1 != _owner2 && _owner1 != _owner3 && _owner2 != _owner3, "Owners must be unique");
        
        owner1 = _owner1;
        owner2 = _owner2;
        owner3 = _owner3;
    }
    
    // ============ Modifiers ============
    
    modifier onlyOwner() {
        require(
            msg.sender == owner1 || msg.sender == owner2 || msg.sender == owner3,
            "Not owner"
        );
        _;
    }
    
    // ============ Functions ============
    
    /**
     * @notice Propose and approve withdrawal
     */
    function approveWithdrawal(
        address token,
        uint256 amount,
        address to,
        uint256 nonce
    ) external onlyOwner {
        bytes32 txId = keccak256(abi.encodePacked(token, amount, to, nonce));
        require(!executed[txId], "Already executed");
        require(!hasApproved[txId][msg.sender], "Already approved");
        
        hasApproved[txId][msg.sender] = true;
        approvals[txId]++;
        
        emit WithdrawalApproved(txId, msg.sender);
        
        // Execute if 2/3 approvals
        if (approvals[txId] >= 2) {
            IERC20(token).safeTransfer(to, amount);
            executed[txId] = true;
            emit WithdrawalExecuted(txId, token, amount, to);
        } else {
            emit WithdrawalProposed(txId, token, amount, to);
        }
    }
    
    /**
     * @notice Check approval status
     */
    function getApprovalCount(bytes32 txId) external view returns (uint256) {
        return approvals[txId];
    }
    
    /**
     * @notice Check if address has approved
     */
    function hasOwnerApproved(bytes32 txId, address owner) external view returns (bool) {
        return hasApproved[txId][owner];
    }
    
    /**
     * @notice Receive tokens
     */
    receive() external payable {
        emit Deposit(address(0), msg.value, msg.sender);
    }
}
