//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./UniversityTemplate_State.sol";

/**
 * @title   UniversityTemplate_Governance
 * @author  David Gimenez Gutierrez
 *
 * This library contains the logic to manage the univesity contract.
 * This library is part of my new Degree Certification Protocole.
 */
contract UniversityTemplate_Governance is UniversityTemplate_State {

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constant
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    uint256 public constant VERSION = 100;   // Version of the contract

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Exernal functions - Governance
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    function setAuthorityPerson(StructDegree.AuthorityPosition _authorityPosition, StructUniversity.AuthorityPerson calldata _authorityPerson) external {
        // Check the name of the new Authroty Person
        require(bytes(_authorityPerson.name).length > 0, "Invalid name");

        // Set up AuthorityPerson
        authorities[_authorityPosition] = _authorityPerson;

        // Check Authority Person information
        require(keccak256(bytes(authorities[_authorityPosition].name))  == keccak256(bytes(_authorityPerson.name))
                && authorities[_authorityPosition].accountAddress       == _authorityPerson.accountAddress, "Assignation mismatch");
    }

    function transferAuthorityPosition(StructUniversity.AuthorityPerson calldata _authorityPerson) external {
        // Get the AuthrityPosition of the msg sender account
        StructDegree.AuthorityPosition authorityPosition = _getAuthorityPersonPosition();

        // Transfer AuthorityPosition
        authorities[authorityPosition] = _authorityPerson;

        // Check Authority Person information
        require(keccak256(bytes(authorities[authorityPosition].name))  == keccak256(bytes(_authorityPerson.name))
                && authorities[authorityPosition].accountAddress       == _authorityPerson.accountAddress, "Assignation mismatch");
    }

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