//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

// ----------------------------------------------------------------------------------------------------------------------------------------------
// -- Imports
// ----------------------------------------------------------------------------------------------------------------------------------------------

/// @custom:import This contract use the 'UniversityTemplate' contract.
import "./UniversityTemplate.sol";

/**
 * @title   UniversityTemplate_Container
 * @author  David Gimenez Gutierrez
 * @notice  This contract is part of my new Degree Certification Protocole
 * @dev     This contract has the responsibility of return the creation code of the University Template contract
 */
contract UniversityTemplate_Container {

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constant
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    /// @notice Version of the contract
    uint256 public constant VERSION = 100;

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- External contract variables
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @notice Address of the external contract that administrate this contract. The Owner of the contract. 
    address public universityBuilderContractAddress;

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constructor
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @notice Set the universityBuilderContractAddress state variable
    /// @param _universityBuilderContractAddress [address] University Builder Contract address
    constructor(address _universityBuilderContractAddress) {
        // Check
        require(_universityBuilderContractAddress != address(0), "Invalid address");

        // Set new value
        universityBuilderContractAddress = _universityBuilderContractAddress;
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- External Functions
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    /// @notice Return the University Template contract bytecode
    /// @dev The University Template contract bytecode is obtained by the command 'creationCode' from the 'UniversityTemplate' contract type
    /// @return [bytes] The bytecode of the UniversityTemplate contract
    function getUniversityTemplateBytecode() external view returns(bytes memory) {
        require(msg.sender == universityBuilderContractAddress, "Not authorized");
        return type(UniversityTemplate).creationCode;
    }
}