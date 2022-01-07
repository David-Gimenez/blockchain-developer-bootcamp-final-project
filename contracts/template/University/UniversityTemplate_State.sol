//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

// ----------------------------------------------------------------------------------------------------------------------------------------------
// -- Import contracts
// ----------------------------------------------------------------------------------------------------------------------------------------------
import "../../libraries/StructDegree.sol";

/**
 * @title   UniversityTemplate_State
 * @author  David Gimenez Gutierrez
 *
 * Contract logic representing an University. 
 * This contract is part of my new Degree Certification Protocole.
 */
 contract UniversityTemplate_State {
 
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- State variables
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    // University information variables
    StructUniversity.UniversityCollege public universityInfo;   // Issuer university information

    // University Degree Template Container address
    address public universityDegreeTemplate_ContainerAddress;
        
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Contract mapping
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    // University authority people
    mapping (StructDegree.AuthorityPosition => StructUniversity.AuthorityPerson) public authorities;
    
    // University degreee information
    uint256 public degreePendingIndex;                                      // Total number of Degree that has been added to be issued
    uint256 public degreePendingNumber;                                     // Number of Degree to be issued that are pending processing

    uint256 public degreeIssuedIndex;                                       // Number of University Degree issued
    mapping(uint256 => StructDegree.DegreeObject) public degreeIssued;      // UniversityDegreeNumber   => DegreeInformation
    mapping(uint256 => StructDegree.DegreeObject) public degreePending;     // degreePendingNumber      => DegreeInformation
 }