//SPDX-License-Identifier: MIT;
pragma solidity 0.8.4;

/**
 * @title   TransferOnDestroy
 * @author  David Gimenez Gutierrez
 * @notice  This contract is part of test process of my new Degree Certification Protocole
 * @dev     This contract will only be used to test the Ethers recovery operation from a University Contract in the event of a self-destructive transfer
 */
contract TransferOnDestroy {

    /// @notice Self destruct the contract to force the transfer of balance to another contract
    /// @dev This method is used only in the test case for extract Ether from a contract
    /// @param _recipientAccountAddress [address] The address of the recipient of the transfer
    function selfDestruct(address payable _recipientAccountAddress) external {
        selfdestruct(_recipientAccountAddress);
    }

    /// @notice This method allow the contract to receive Ethers from simple transfer transactions
    receive() external payable {}
}