//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

// ----------------------------------------------------------------------------------------------------------------------------------------------
// -- Import contracts
// ----------------------------------------------------------------------------------------------------------------------------------------------
import "./UniversityTemplate.sol";

/**
 * @title   UniversityTemplate_Container
 * @author  David Gimenez Gutierrez
 *
 * This contract has the responsibility of return the creation code of the University Template contract.
 * This contract is part of my new Degree Certification Protocole.
 */
contract UniversityTemplate_Container {

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constant
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    uint256 public constant VERSION = 100;   // Version of the contract

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- External contract variables
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    address public universityBuilderContractAddress;

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constructor
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    constructor(address _universityBuilderContractAddress) {
        // Check
        require(_universityBuilderContractAddress != address(0), "Invalid address");

        // Set new value
        universityBuilderContractAddress = _universityBuilderContractAddress;
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- External Functions
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    function getUniversityTemplateBytecode() external view returns(bytes memory) {
        require(msg.sender == universityBuilderContractAddress, "Not authorized");
        return type(UniversityTemplate).creationCode;
    }
}