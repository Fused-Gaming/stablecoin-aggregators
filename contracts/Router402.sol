// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title Router402
 * @author VLN Security Research
 * @notice Production-grade stablecoin router with x402-style micropayments
 * @dev Integrates with Socket, LayerZero, and other bridges
 */
contract Router402 is Ownable2Step, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // ============ Constants ============
    
    uint256 public constant MAX_FEE_BPS = 100; // 1% maximum fee
    uint256 public constant BPS_DENOMINATOR = 10000;
    uint256 public constant MIN_SWAP_AMOUNT = 1e6; // $1 minimum (6 decimals)
    uint256 public constant MAX_SWAP_AMOUNT = 1_000_000e6; // $1M maximum
    
    // ============ State Variables ============
    
    /// @notice Fee in basis points (default 20 = 0.2%)
    uint256 public feeBps;
    
    /// @notice Treasury address for fee collection
    address public treasury;
    
    /// @notice Protocol paused by admin
    bool public emergencyPause;
    
    /// @notice Total fees collected per token
    mapping(address => uint256) public totalFeesCollected;
    
    /// @notice Total volume processed per token
    mapping(address => uint256) public totalVolumeProcessed;
    
    /// @notice Supported stablecoins
    mapping(address => bool) public supportedTokens;
    
    /// @notice Approved bridge contracts
    mapping(address => bool) public approvedBridges;
    
    /// @notice Per-user daily volume tracking (anti-abuse)
    mapping(address => mapping(uint256 => uint256)) public dailyVolume;
    
    /// @notice Maximum daily volume per user
    uint256 public maxDailyVolume;
    
    /// @notice Nonce for tracking swaps
    uint256 public swapNonce;
    
    // ============ Structs ============
    
    struct SwapParams {
        address token;           // Stablecoin address
        uint256 amount;          // Amount to swap
        address bridge;          // Bridge contract
        bytes bridgeData;        // Encoded bridge call data
        uint256 dstChainId;      // Destination chain ID
        address recipient;       // Recipient on destination (optional)
    }
    
    struct SwapResult {
        uint256 swapId;
        address user;
        address token;
        uint256 amountIn;
        uint256 fee;
        uint256 amountOut;
        address bridge;
        uint256 dstChainId;
        uint256 timestamp;
    }
    
    // ============ Events ============
    
    event SwapExecuted(
        uint256 indexed swapId,
        address indexed user,
        address indexed token,
        uint256 amountIn,
        uint256 fee,
        uint256 amountOut,
        address bridge,
        uint256 dstChainId,
        uint256 timestamp
    );
    
    event FeeCollected(
        address indexed token,
        uint256 amount,
        uint256 totalCollected
    );
    
    event TreasuryUpdated(
        address indexed oldTreasury,
        address indexed newTreasury
    );
    
    event FeeUpdated(uint256 oldFee, uint256 newFee);
    
    event TokenConfigured(
        address indexed token,
        bool supported
    );
    
    event BridgeConfigured(
        address indexed bridge,
        bool approved
    );
    
    event EmergencyWithdraw(
        address indexed token,
        uint256 amount,
        address indexed recipient
    );
    
    event MaxDailyVolumeUpdated(uint256 oldLimit, uint256 newLimit);
    
    // ============ Errors ============
    
    error UnsupportedToken(address token);
    error UnsupportedBridge(address bridge);
    error InvalidAmount(uint256 amount);
    error InvalidAddress(address addr);
    error FeeTooHigh(uint256 fee);
    error BridgeCallFailed(bytes returnData);
    error DailyVolumeLimitExceeded(uint256 current, uint256 limit);
    error EmergencyPauseActive();
    error InsufficientBalance(uint256 requested, uint256 available);
    
    // ============ Modifiers ============
    
    modifier notEmergencyPaused() {
        if (emergencyPause) revert EmergencyPauseActive();
        _;
    }
    
    modifier validToken(address token) {
        if (!supportedTokens[token]) revert UnsupportedToken(token);
        _;
    }
    
    modifier validBridge(address bridge) {
        if (!approvedBridges[bridge]) revert UnsupportedBridge(bridge);
        _;
    }
    
    // ============ Constructor ============
    
    constructor(
        address _treasury,
        uint256 _feeBps
    ) {
        if (_treasury == address(0)) revert InvalidAddress(_treasury);
        if (_feeBps > MAX_FEE_BPS) revert FeeTooHigh(_feeBps);
        
        treasury = _treasury;
        feeBps = _feeBps;
        maxDailyVolume = 100_000e6; // $100k default
        
        emit TreasuryUpdated(address(0), _treasury);
        emit FeeUpdated(0, _feeBps);
    }
    
    // ============ Core Swap Functions ============
    
    /**
     * @notice Execute cross-chain stablecoin swap
     * @param params Swap parameters
     * @return result Swap execution details
     */
    function swap(SwapParams calldata params)
        external
        nonReentrant
        whenNotPaused
        notEmergencyPaused
        validToken(params.token)
        validBridge(params.bridge)
        returns (SwapResult memory result)
    {
        // Validate amount
        if (params.amount < MIN_SWAP_AMOUNT || params.amount > MAX_SWAP_AMOUNT) {
            revert InvalidAmount(params.amount);
        }
        
        // Check daily volume limit
        uint256 today = block.timestamp / 1 days;
        uint256 userDailyVolume = dailyVolume[msg.sender][today] + params.amount;
        if (userDailyVolume > maxDailyVolume) {
            revert DailyVolumeLimitExceeded(userDailyVolume, maxDailyVolume);
        }
        dailyVolume[msg.sender][today] = userDailyVolume;
        
        // Calculate fee
        uint256 fee = (params.amount * feeBps) / BPS_DENOMINATOR;
        uint256 amountOut = params.amount - fee;
        
        // Transfer tokens from user
        IERC20(params.token).safeTransferFrom(
            msg.sender,
            address(this),
            params.amount
        );
        
        // Collect fee
        if (fee > 0) {
            IERC20(params.token).safeTransfer(treasury, fee);
            totalFeesCollected[params.token] += fee;
            emit FeeCollected(params.token, fee, totalFeesCollected[params.token]);
        }
        
        // Approve bridge
        IERC20(params.token).safeApprove(params.bridge, amountOut);
        
        // Execute bridge call
        (bool success, bytes memory returnData) = params.bridge.call(params.bridgeData);
        if (!success) {
            revert BridgeCallFailed(returnData);
        }
        
        // Update stats
        swapNonce++;
        totalVolumeProcessed[params.token] += params.amount;
        
        // Build result
        result = SwapResult({
            swapId: swapNonce,
            user: msg.sender,
            token: params.token,
            amountIn: params.amount,
            fee: fee,
            amountOut: amountOut,
            bridge: params.bridge,
            dstChainId: params.dstChainId,
            timestamp: block.timestamp
        });
        
        emit SwapExecuted(
            result.swapId,
            result.user,
            result.token,
            result.amountIn,
            result.fee,
            result.amountOut,
            result.bridge,
            result.dstChainId,
            result.timestamp
        );
        
        return result;
    }
    
    /**
     * @notice Simplified swap using Socket router
     * @dev Socket handles routing, we just collect fee
     */
    function swapViaSocket(
        address token,
        uint256 amount,
        address socketRouter,
        bytes calldata socketData
    )
        external
        nonReentrant
        whenNotPaused
        notEmergencyPaused
        validToken(token)
        returns (uint256 amountOut)
    {
        // Validate
        if (amount < MIN_SWAP_AMOUNT || amount > MAX_SWAP_AMOUNT) {
            revert InvalidAmount(amount);
        }
        if (!approvedBridges[socketRouter]) {
            revert UnsupportedBridge(socketRouter);
        }
        
        // Check daily limit
        uint256 today = block.timestamp / 1 days;
        uint256 userVolume = dailyVolume[msg.sender][today] + amount;
        if (userVolume > maxDailyVolume) {
            revert DailyVolumeLimitExceeded(userVolume, maxDailyVolume);
        }
        dailyVolume[msg.sender][today] = userVolume;
        
        // Calculate fee
        uint256 fee = (amount * feeBps) / BPS_DENOMINATOR;
        amountOut = amount - fee;
        
        // Transfer from user
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        
        // Send fee to treasury
        if (fee > 0) {
            IERC20(token).safeTransfer(treasury, fee);
            totalFeesCollected[token] += fee;
            emit FeeCollected(token, fee, totalFeesCollected[token]);
        }
        
        // Approve Socket
        IERC20(token).safeApprove(socketRouter, amountOut);
        
        // Execute Socket swap
        (bool success, bytes memory returnData) = socketRouter.call(socketData);
        if (!success) {
            revert BridgeCallFailed(returnData);
        }
        
        // Update stats
        swapNonce++;
        totalVolumeProcessed[token] += amount;
        
        emit SwapExecuted(
            swapNonce,
            msg.sender,
            token,
            amount,
            fee,
            amountOut,
            socketRouter,
            0, // Chain ID in socketData
            block.timestamp
        );
        
        return amountOut;
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Calculate fee for given amount
     */
    function calculateFee(uint256 amount) public view returns (uint256) {
        return (amount * feeBps) / BPS_DENOMINATOR;
    }
    
    /**
     * @notice Get user's daily volume
     */
    function getUserDailyVolume(address user) external view returns (uint256) {
        uint256 today = block.timestamp / 1 days;
        return dailyVolume[user][today];
    }
    
    /**
     * @notice Get remaining daily volume for user
     */
    function getRemainingDailyVolume(address user) external view returns (uint256) {
        uint256 today = block.timestamp / 1 days;
        uint256 used = dailyVolume[user][today];
        if (used >= maxDailyVolume) return 0;
        return maxDailyVolume - used;
    }
    
    /**
     * @notice Get total stats for token
     */
    function getTokenStats(address token) external view returns (
        uint256 feesCollected,
        uint256 volumeProcessed,
        bool isSupported
    ) {
        return (
            totalFeesCollected[token],
            totalVolumeProcessed[token],
            supportedTokens[token]
        );
    }
    
    // ============ Admin Functions ============
    
    /**
     * @notice Update treasury address
     */
    function setTreasury(address _treasury) external onlyOwner {
        if (_treasury == address(0)) revert InvalidAddress(_treasury);
        address oldTreasury = treasury;
        treasury = _treasury;
        emit TreasuryUpdated(oldTreasury, _treasury);
    }
    
    /**
     * @notice Update fee basis points
     */
    function setFee(uint256 _feeBps) external onlyOwner {
        if (_feeBps > MAX_FEE_BPS) revert FeeTooHigh(_feeBps);
        uint256 oldFee = feeBps;
        feeBps = _feeBps;
        emit FeeUpdated(oldFee, _feeBps);
    }
    
    /**
     * @notice Configure supported token
     */
    function setSupportedToken(address token, bool supported) external onlyOwner {
        if (token == address(0)) revert InvalidAddress(token);
        supportedTokens[token] = supported;
        emit TokenConfigured(token, supported);
    }
    
    /**
     * @notice Configure approved bridge
     */
    function setApprovedBridge(address bridge, bool approved) external onlyOwner {
        if (bridge == address(0)) revert InvalidAddress(bridge);
        approvedBridges[bridge] = approved;
        emit BridgeConfigured(bridge, approved);
    }
    
    /**
     * @notice Update max daily volume
     */
    function setMaxDailyVolume(uint256 _maxDailyVolume) external onlyOwner {
        uint256 oldLimit = maxDailyVolume;
        maxDailyVolume = _maxDailyVolume;
        emit MaxDailyVolumeUpdated(oldLimit, _maxDailyVolume);
    }
    
    /**
     * @notice Pause contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @notice Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @notice Emergency pause (different from normal pause)
     */
    function setEmergencyPause(bool paused) external onlyOwner {
        emergencyPause = paused;
    }
    
    /**
     * @notice Emergency withdraw stuck tokens
     */
    function emergencyWithdraw(
        address token,
        uint256 amount,
        address recipient
    ) external onlyOwner {
        if (recipient == address(0)) revert InvalidAddress(recipient);
        
        uint256 balance = IERC20(token).balanceOf(address(this));
        if (amount > balance) {
            revert InsufficientBalance(amount, balance);
        }
        
        IERC20(token).safeTransfer(recipient, amount);
        emit EmergencyWithdraw(token, amount, recipient);
    }
    
    /**
     * @notice Batch configure tokens
     */
    function batchSetSupportedTokens(
        address[] calldata tokens,
        bool[] calldata supported
    ) external onlyOwner {
        require(tokens.length == supported.length, "Length mismatch");
        for (uint256 i = 0; i < tokens.length; i++) {
            supportedTokens[tokens[i]] = supported[i];
            emit TokenConfigured(tokens[i], supported[i]);
        }
    }
    
    /**
     * @notice Batch configure bridges
     */
    function batchSetApprovedBridges(
        address[] calldata bridges,
        bool[] calldata approved
    ) external onlyOwner {
        require(bridges.length == approved.length, "Length mismatch");
        for (uint256 i = 0; i < bridges.length; i++) {
            approvedBridges[bridges[i]] = approved[i];
            emit BridgeConfigured(bridges[i], approved[i]);
        }
    }
}
