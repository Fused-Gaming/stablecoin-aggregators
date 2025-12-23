// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IGnosisSafe
 * @notice Interface for Gnosis Safe multisig wallet
 * @dev This interface includes only the functions needed for deployment and basic operations
 */
interface IGnosisSafe {
    /**
     * @notice Setup function sets initial storage of contract.
     * @param _owners List of Safe owners.
     * @param _threshold Number of required confirmations for a Safe transaction.
     * @param to Contract address for optional delegate call.
     * @param data Data payload for optional delegate call.
     * @param fallbackHandler Handler for fallback calls to this contract
     * @param paymentToken Token that should be used for the payment (0 is ETH)
     * @param payment Value that should be paid
     * @param paymentReceiver Address that should receive the payment (or 0 if tx.origin)
     */
    function setup(
        address[] calldata _owners,
        uint256 _threshold,
        address to,
        bytes calldata data,
        address fallbackHandler,
        address paymentToken,
        uint256 payment,
        address payable paymentReceiver
    ) external;

    /**
     * @notice Returns array of owners.
     * @return Array of Safe owners.
     */
    function getOwners() external view returns (address[] memory);

    /**
     * @notice Returns the number of required confirmations for a Safe transaction.
     * @return Threshold required to execute a Safe transaction.
     */
    function getThreshold() external view returns (uint256);

    /**
     * @notice Returns if an owner is registered.
     * @param owner Owner address.
     * @return Boolean if owner is registered.
     */
    function isOwner(address owner) external view returns (bool);

    /**
     * @notice Execute a Safe transaction.
     * @param to Destination address of Safe transaction.
     * @param value Ether value of Safe transaction.
     * @param data Data payload of Safe transaction.
     * @param operation Operation type of Safe transaction.
     * @param safeTxGas Gas that should be used for the Safe transaction.
     * @param baseGas Gas costs that are independent of the transaction execution.
     * @param gasPrice Gas price that should be used for the payment calculation.
     * @param gasToken Token address (or 0 if ETH) that is used for the payment.
     * @param refundReceiver Address of receiver of gas payment (or 0 if tx.origin).
     * @param signatures Packed signature data ({bytes32 r}{bytes32 s}{uint8 v})
     * @return success Boolean indicating transaction's success.
     */
    function execTransaction(
        address to,
        uint256 value,
        bytes calldata data,
        uint8 operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address payable refundReceiver,
        bytes memory signatures
    ) external payable returns (bool success);
}
