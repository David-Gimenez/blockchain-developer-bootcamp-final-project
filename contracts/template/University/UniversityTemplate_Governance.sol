//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

// ----------------------------------------------------------------------------------------------------------------------------------------------
// -- Imports
// ----------------------------------------------------------------------------------------------------------------------------------------------

/// @custom:import This contract use the 'UniversityTemplate_State' contract.
import "./UniversityTemplate_State.sol";

/**
 * @title   UniversityTemplate_Governance
 * @author  David Gimenez Gutierrez
 * @notice  This contract is part of my new Degree Certification Protocole
 * @dev     This contract has the administration operations for the processing of Degrees for the University contract
 */
contract UniversityTemplate_Governance is UniversityTemplate_State {

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constant
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @notice Version of the contract
    uint256 public constant VERSION = 100;   // Version of the contract

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Exernal functions - Governance
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    /// @notice Set an Authority Person in the University contract. This person will be one of the University Degree signers 
    /// @dev This method use a low level call to execuit the logical code from an upgradeable contract. For this reson the parameters are underlined as are not been used here but in the contract that is been called
    /// @param _authorityPosition [StructDegree.AuthorityPosition] Authority position assigned to the authority person to be added
    /// @param _authorityPerson [StructUniversity.AuthorityPerson] Authority person to be added
    function setAuthorityPerson(StructDegree.AuthorityPosition _authorityPosition, StructUniversity.AuthorityPerson calldata _authorityPerson) external {
        // Check the name of the new Authroty Person
        require(bytes(_authorityPerson.name).length > 0, "Invalid name");

        // Set up AuthorityPerson
        authorities[_authorityPosition] = _authorityPerson;

        // Check Authority Person information
        require(keccak256(bytes(authorities[_authorityPosition].name))  == keccak256(bytes(_authorityPerson.name))
                && authorities[_authorityPosition].accountAddress       == _authorityPerson.accountAddress, "Assignation mismatch");
    }

    /// @notice Transfer an Authority Position from one Authority Person to an other. The caller must be an AUthority Person
    /// @dev The Authority Position that is transferred is the Authority Position of the caller
    /// @param _authorityPerson [StructUniversity.AuthorityPerson] Authority person that will receive the Authority Position
    function transferAuthorityPosition(StructUniversity.AuthorityPerson calldata _authorityPerson) external {
        // Get the AuthrityPosition of the msg sender account
        StructDegree.AuthorityPosition authorityPosition = _getAuthorityPersonPosition();

        // Transfer AuthorityPosition
        authorities[authorityPosition] = _authorityPerson;

        // Check Authority Person information
        require(keccak256(bytes(authorities[authorityPosition].name))  == keccak256(bytes(_authorityPerson.name))
                && authorities[authorityPosition].accountAddress       == _authorityPerson.accountAddress, "Assignation mismatch");
    }

    /// @notice Transfer an Authority Position of the manager to a new Authority Person. The caller must be the manager of the University
    /// @dev The Authority Position 'Manager' need his own transfer method because use a different method to check the caller
    /// @param _newUniversityManager [StructUniversity.AuthorityPerson] Authority person that will receive the Authority Position 'Manager'
    function changeUniversityManager(StructUniversity.AuthorityPerson calldata _newUniversityManager) external {
        // Set University manager
        authorities[StructDegree.AuthorityPosition.Manager] = _newUniversityManager;

        // Check Authority Person information
        require(keccak256(bytes(authorities[StructDegree.AuthorityPosition.Manager].name))  == keccak256(bytes(_newUniversityManager.name))
                && authorities[StructDegree.AuthorityPosition.Manager].accountAddress       == _newUniversityManager.accountAddress, "Assignation mismatch");
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Private functions
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @notice Return the Authority Position of the msg.sender
    /// @dev That the message.sender is an Authority Person of the University has been ensured in the method that calls this private method
    /// @return resutl [StructDegree.AuthorityPosition] The Authority Position of the msg.sender
    function _getAuthorityPersonPosition() private view returns(StructDegree.AuthorityPosition resutl) {
        if(msg.sender == authorities[StructDegree.AuthorityPosition.Manager].accountAddress)
            return StructDegree.AuthorityPosition.Manager;
        
        else if(msg.sender == authorities[StructDegree.AuthorityPosition.Rector].accountAddress)
            return StructDegree.AuthorityPosition.Rector;
        
        else if(msg.sender == authorities[StructDegree.AuthorityPosition.Dean].accountAddress)
            return StructDegree.AuthorityPosition.Dean;
        
        else if (msg.sender == authorities[StructDegree.AuthorityPosition.Director].accountAddress)
            return StructDegree.AuthorityPosition.Director;
    }
}