//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

// ----------------------------------------------------------------------------------------------------------------------------------------------
// -- Imports
// ----------------------------------------------------------------------------------------------------------------------------------------------

/// @custom:import This contract use 'StructDegree' library.
import "../../libraries/StructDegree.sol";

/**
 * @title   UniversityTemplate_State
 * @author  David Gimenez Gutierrez
 * @notice  This contract is part of my new Degree Certification Protocole
 * @dev     Contract representing the University's state variables
 */
 contract UniversityTemplate_State {
 
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- State variables
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @notice Total number of Degree that has been added to be issued
    uint256 public degreePendingIndex;
    /// @notice Number of Degree to be issued that are pending processing
    uint256 public degreePendingNumber;
    /// @notice Number of University Degree issued
    uint256 public degreeIssuedIndex;

    /// @notice University Degree Template Container address
    address public universityDegreeTemplate_ContainerAddress;

    /// @notice Issuer university information
    StructUniversity.UniversityCollege public universityInfo;

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Contract mapping
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    /// @notice University authority people mapping
    /// @dev Maps an StructDegree.AuthorityPosition value to an StructUniversity.AuthorityPerson object
    mapping (StructDegree.AuthorityPosition => StructUniversity.AuthorityPerson) public authorities;

    /// @notice Degree objects that have been issued mapping
    /// @dev Maps an uint256 value to an StructDegree.DegreeObject object. UniversityDegreeNumber => DegreeInformation
    mapping(uint256 => StructDegree.DegreeObject) public degreeIssued;

    /// @notice Degree objects that is pending process mapping
    /// @dev Maps an uint256 value to an StructDegree.DegreeObject object. DegreePendingNumber => DegreeInformation
    mapping(uint256 => StructDegree.DegreeObject) public degreePending;
 }