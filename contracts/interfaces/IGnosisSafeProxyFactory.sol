// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IGnosisSafeProxyFactory
 * @notice Interface for Gnosis Safe Proxy Factory
 * @dev Used to deploy new Gnosis Safe proxy instances
 */
interface IGnosisSafeProxyFactory {
    /**
     * @notice Allows to create new proxy contact using CREATE2 and execute a message call to the new proxy within one transaction.
     * @param _singleton Address of singleton contract.
     * @param initializer Payload for message call sent to new proxy contract.
     * @param saltNonce Nonce that will be used to generate the salt to calculate the address of the new proxy contract.
     * @return proxy Address of the new proxy contract.
     */
    function createProxyWithNonce(
        address _singleton,
        bytes memory initializer,
        uint256 saltNonce
    ) external returns (address proxy);

    /**
     * @notice Allows to retrieve the creation code used for the Proxy deployment.
     * @return The creation code for the Proxy deployment.
     */
    function proxyCreationCode() external pure returns (bytes memory);

    /**
     * @notice Computes the address of a proxy that will be deployed using createProxyWithNonce.
     * @param _singleton Address of singleton contract.
     * @param initializer Payload for message call sent to new proxy contract.
     * @param saltNonce Nonce that will be used to generate the salt to calculate the address of the new proxy contract.
     * @return proxy Expected address of the new proxy contract.
     */
    function computeProxyAddressWithNonce(
        address _singleton,
        bytes memory initializer,
        uint256 saltNonce
    ) external view returns (address proxy);
}
