//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

// ----------------------------------------------------------------------------------------------------------------------------------------------
// -- Import contracts
// ----------------------------------------------------------------------------------------------------------------------------------------------
import "./StructUniversity.sol";

/**
 * @title   StructDegree
 * @author  David Gimenez Gutierrez
 *
 * This library contains structs related to the Degree definition to be used across multiple contracts.
 * This library is part of my new Degree Certification Protocole.
 */
library StructDegree {

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constant struct type Hash 
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // This encoding es from https://eips.ethereum.org/EIPS/eip-712
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

    // Degree information
    struct Degree {
        string  name;           // University Degree name.
        string  description;    // University Degree description.
        string  legalStatement; // Legal statement for the issuance of the Degree title.
        uint256 issueDate;      // Issue date of the Degree title.
        uint256 emissionDate;   // Emission date of the contract. Not included in the DegreeInformation object hash because is computed a posteriori.
    }

    // Graduate owner information
    struct Owner {
        string  name;           // Name of the graduate holder of the University Degree.
        uint256 graduateNumber; // The identification number of the graduate student at the university.
        address accountAddress; // Exteral owned account address of the holder of the Academic Degree. The graduate recipient of the Degree title.
    }

    // Digital signature of the information of the Degree contract issued
    struct Signature {
        StructUniversity.AuthorityPerson    signer;
        uint256                             signatureDate;  // Digital signature date of a degree information hash using ECDSA SECP256k1 curve.
        bytes                               signature;      // Digital signature of a degree information hash using ECDSA SECP256k1 curve.
    }

    // Information of degree, owner and university
    struct DegreeInformation {
        Degree                              degree;
        Owner                               owner;
        StructUniversity.UniversityCollege  university;
        address                             contractAddress;                    // Contract address of the University Degree title.
        bytes32                             hash_EIP712_ContractAddressSalt;    // It is the hash of all DegreeInformation object without the contract address. 
                                                                                // It is used as an identifier to generate the address of the contract;
        bytes32                             hash_EIP712_ForSigning;             // keccak256 hash of all information contained in a DegreeInformation Object following EIP-712 format, 
                                                                                // It is the hash that the authorities must sign to authenticate the Degree Title.
                                                                                // Not include emissionDate of the degree object because authorities do not 
                                                                                // have that information at the time of signing, which they do before create the smart contract.
    }

    // Degree object
    struct DegreeObject {
        DegreeInformation                       information;
        mapping(AuthorityPosition => Signature) signature;
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Enums
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    // Enum the positions of the authority person in the University that sign the Degree
    // If this list is altered, the logic in the contracts that inherit from it must be updated.
    enum AuthorityPosition {
        Manager,    // Operation chief of the Degree system. Account authorized to operate with the University contract. 
        Rector,     // Head chief of the university.
        Dean,       // Head chief of faculty.
        Director    // Chairperson. First teacher.
    }
}