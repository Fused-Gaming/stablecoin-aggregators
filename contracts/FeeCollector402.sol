// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FeeCollector402
 * @notice Ultra-simple x402-style fee collection
 * @dev Pay fee to unlock quote execution off-chain
 */
contract FeeCollector402 is Ownable {
    using SafeERC20 for IERC20;
    
    // ============ State ============
    
    address public immutable feeToken;
    address public treasury;
    uint256 public baseFee;
    
    mapping(bytes32 => bool) public quotesExecuted;
    mapping(address => uint256) public userFeesPaid;
    
    // ============ Events ============
    
    event FeePaid(
        address indexed user,
        bytes32 indexed quoteId,
        uint256 amount,
        uint256 timestamp
    );
    
    event QuoteExecuted(bytes32 indexed quoteId);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    event BaseFeeUpdated(uint256 oldFee, uint256 newFee);
    
    // ============ Constructor ============
    
    constructor(
        address _treasury,
        address _feeToken,
        uint256 _baseFee
    ) Ownable(msg.sender) {
        require(_treasury != address(0), "Invalid treasury");
        require(_feeToken != address(0), "Invalid token");

        treasury = _treasury;
        feeToken = _feeToken;
        baseFee = _baseFee;
    }
    
    // ============ Core Functions ============
    
    /**
     * @notice Pay fee for quote execution
     */
    function payFee(bytes32 quoteId) external returns (bool) {
        return _payFee(quoteId, baseFee);
    }
    
    /**
     * @notice Pay custom fee (for larger swaps)
     */
    function payCustomFee(bytes32 quoteId, uint256 amount) external returns (bool) {
        require(amount >= baseFee, "Fee too low");
        return _payFee(quoteId, amount);
    }
    
    function _payFee(bytes32 quoteId, uint256 amount) internal returns (bool) {
        require(!quotesExecuted[quoteId], "Quote already executed");
        
        IERC20(feeToken).safeTransferFrom(msg.sender, treasury, amount);
        
        quotesExecuted[quoteId] = true;
        userFeesPaid[msg.sender] += amount;
        
        emit FeePaid(msg.sender, quoteId, amount, block.timestamp);
        emit QuoteExecuted(quoteId);
        
        return true;
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Check if quote has been executed
     */
    function isQuoteExecuted(bytes32 quoteId) external view returns (bool) {
        return quotesExecuted[quoteId];
    }
    
    /**
     * @notice Get total fees paid by user
     */
    function getTotalFeesPaid(address user) external view returns (uint256) {
        return userFeesPaid[user];
    }
    
    // ============ Admin ============
    
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury");
        address oldTreasury = treasury;
        treasury = _treasury;
        emit TreasuryUpdated(oldTreasury, _treasury);
    }
    
    function setBaseFee(uint256 _baseFee) external onlyOwner {
        uint256 oldFee = baseFee;
        baseFee = _baseFee;
        emit BaseFeeUpdated(oldFee, _baseFee);
    }
}
