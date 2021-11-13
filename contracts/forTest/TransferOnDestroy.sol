//SPDX-License-Identifier: MIT;
pragma solidity 0.8.4;

contract TransferOnDestroy {

    function selfDestruct(address payable _recipientAccountAddress) external {
        selfdestruct(_recipientAccountAddress);
    }
    receive() external payable {}
}