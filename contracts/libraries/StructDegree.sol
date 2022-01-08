//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

// ----------------------------------------------------------------------------------------------------------------------------------------------
// -- Imports
// ----------------------------------------------------------------------------------------------------------------------------------------------

/// @custom:import This library use the 'StructUniversity' library.
import "./StructUniversity.sol";

/**
 * @title   StructDegree
 * @author  David Gimenez Gutierrez
 * @notice  This library is part of my new Degree Certification Protocole
 * @dev     This library contains structs related to the Degree definition to be used across multiple contracts
 */
library StructDegree {

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constants struct type Hash 
    // -- To be able to sign the struct object defined below it is required to have the hash of the fields structure with the EIP-712 codification
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    /// @dev This encoding es from https://eips.ethereum.org/EIPS/eip-712
    bytes32 internal constant DOMAIN_SEPARATOR_HASH          = keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
    bytes32 internal constant DEGREE_INFORMATION_TYPE_HASH   = keccak256(
                                                                        "DegreeInformation(Degree degree,Owner owner,UniversityCollege university,address contractAddress)"
                                                                        "Degree(string name,string description,string legalStatement,uint256 issueDate)"
                                                                        "Owner(string name,uint256 graduateNumber,address accountAddress)"
                                                                        "UniversityCollege(string name,string fullName,string country,string state,address accountAddress)"
                                                                        );
    bytes32 internal constant DEGREE_TYPE_HASH               = keccak256("Degree(string name,string description,string legalStatement,uint256 issueDate)");
    bytes32 internal constant OWNER_TYPE_HASH                = keccak256("Owner(string name,uint256 graduateNumber,address accountAddress)");
    bytes32 internal constant UNIVERSITY_COLLEGE_TYPE_HASH   = keccak256("UniversityCollege(string name,string fullName,string country,string state,address accountAddress)"); 
       
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Structs
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @dev Contains the University Degree information
    /// @param name [string] Name of the University Degree title
    /// @param description [string] Description of the University Degree title
    /// @param legalStatement [string] Legal statement for the issuance of the University Degree title
    /// @param issueDate [uint256] Issue date of the University Degree title in Unix format
    /// @param emissionDate [uint256] Emission date of the Degree contract in Unix format. Not included in the DegreeInformation object hash because is computed a posteriori
    struct Degree {
        string  name;
        string  description;
        string  legalStatement;
        uint256 issueDate;
        uint256 emissionDate;
    }

    /// @dev Contains the information of the graduate, owner of the University Degree title contract
    /// @param name [string] Name of the graduate holder of the University Degree
    /// @param graduateNumber [uint256] The identification number of the graduate student at the university
    /// @param accountAddress [address] Externally owned account address of the holder of the University Degree. The graduate recipient of the Degree title
    struct Owner {
        string  name;
        uint256 graduateNumber;
        address accountAddress;
    }

    /// @dev Contains the information of the Digital signature of the information of the Degree contract issued
    /// @param signer [StructUniversity.AuthorityPerson] Authority person of the University who signs the University Degree title
    /// @param signatureDate [uint256] Digital signature date of a degree information hash using ECDSA SECP256k1 curve
    /// @param signature [bytes] Digital signature of a degree information hash using ECDSA SECP256k1 curve
    struct Signature {
        StructUniversity.AuthorityPerson    signer;
        uint256                             signatureDate;
        bytes                               signature;
    }

    /// @dev This structure is a container for Degree, Owner and University information
    /// @param degree [StructDegree.Degree] Degree object with Degree information
    /// @param owner [StructDegree.Owner] Owner object with Owner (graduated) information
    /// @param university [StructUniversity.UniversityCollege] University object with University information
    /// @param contractAddress [address] Contract address of the University Degree title
    /// @param hash_EIP712_ContractAddressSalt [bytes32] It is the hash of all DegreeInformation object without the contract address. It is used as an identifier to generate the address of the contract
    /// @param hash_EIP712_ForSigning [bytes32] keccak256 hash of all information contained in a DegreeInformation Object following EIP-712 format. It is the hash that the authorities must sign to authenticate the Degree Title. Not include emissionDate of the degree object because authorities do not have that information at the time of signing, which they do at the time of create the smart contract
    struct DegreeInformation {
        Degree                              degree;
        Owner                               owner;
        StructUniversity.UniversityCollege  university;
        address                             contractAddress;
        bytes32                             hash_EIP712_ContractAddressSalt;
        bytes32                             hash_EIP712_ForSigning;
    }
 
    /// @dev This structure is a container for a Degree object and his signatures
    /// @param information [StructDegree.DegreeInformation] DegreeInformation object
    /// @param signature [mapping(AuthorityPosition => Signature)] Signature object mapping
    struct DegreeObject {
        DegreeInformation                       information;
        mapping(AuthorityPosition => Signature) signature;
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Enums
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @dev Enum the positions of the authority person in the University that sign the Degree. If this list is altered, the logic in the contracts that inherit from it must be updated
    /// @custom:value_Manager Operation chief of the Degree system. Account authorized to operate with the University contract
    /// @custom:value_Rector Head chief of the university. One of the signer
    /// @custom:value_Dean Head chief of faculty. One of the signer
    /// @custom:value_Director Chairperson. First teacher. One of the signer
    enum AuthorityPosition {
        Manager,
        Rector,
        Dean,
        Director
    }
}