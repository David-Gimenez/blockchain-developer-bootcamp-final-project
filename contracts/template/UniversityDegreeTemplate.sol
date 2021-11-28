//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

// ----------------------------------------------------------------------------------------------------------------------------------------------
// -- State variables
// ----------------------------------------------------------------------------------------------------------------------------------------------
import "../libraries/StructUniversity.sol";
import "../libraries/StructDegree.sol";
//import "../utils/Hash_EIP712_CalculationFormula.sol";

/**
 * @title   UniversityDegreeTemplate
 * @author  David Gimenez Gutierrez
 *
 * Contract logic representing a University Degree issued by a University. 
 * This contract is part of my new Degree Certification Protocole.
 */
contract UniversityDegreeTemplate {

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constant
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    uint256 public constant VERSION = 100;   // Version of the contract 1.0.0
    
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- State variables
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    // Degree Title information
    StructDegree.Degree                 public degreeInformation;       // Contains the information of the Degree Title
    StructDegree.Owner                  public ownerInformation;        // Contains the information of the Owner of the Degree Title
    StructUniversity.UniversityCollege  public universityInformation;   // Contains the information of the University that issue the Degree Titule

    // Authority signatures
    StructDegree.Signature   public rectorSignature;         // Contains de signatur information of the University Rector
    StructDegree.Signature   public deanSignature;           // Contains de signatur information of the University Dean
    StructDegree.Signature   public directorSignature;       // Contains de signatur information of the University Director

    // Audit information
    bytes32 public hash_EIP712_ContractAddressSalt; // It is the hash of all DegreeInformation object without the contract address. 
                                                    // It is used as an identifier to generate the address of the contract;
    bytes32 public signed_EIP712_Hash;              // Correspond to the hash_EIP712_ForSigning in UNiversity contract
                                                    // keccak256 hash of all information contained in a DegreeInformation Object following EIP-712 format, 
                                                    // It is the hash that the authorities sign to authenticate the Degree Title.
                                                    // Not include emissionDate of the degree object because authorities do not 
                                                    // have that information at the time of signing, which they do before create the smart contract.

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Events
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    event DegreeCreation(address    indexed _university_ContractAddress, 
                        string              _university_Name, 
                        address     indexed _owner_Address, 
                        string              _owner_Name,
                        string      indexed _degreeName);

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constructor
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    constructor(
        StructDegree.DegreeInformation   memory _degreeInformation, 
        StructDegree.Signature           memory _rectorSignature, 
        StructDegree.Signature           memory _deanSignature, 
        StructDegree.Signature           memory _directorSignature) 
    {
        // Check the correctnes of the information
        require(_degreeInformation.contractAddress == address(this), "Degree contract: Incorrect address information");

        // --------------------------------------------------
        // -- Set Degree information
        // --------------------------------------------------
        degreeInformation               = _degreeInformation.degree;
        degreeInformation.emissionDate  = block.timestamp;

        // --------------------------------------------------
        // -- Set graduate owner information
        // --------------------------------------------------
        ownerInformation = _degreeInformation.owner;

        // --------------------------------------------------
        // -- Set issuer university information
        // --------------------------------------------------
        universityInformation = _degreeInformation.university;

        // --------------------------------------------------
        // -- set Authorities signatures
        // --------------------------------------------------
        rectorSignature     = _rectorSignature;
        deanSignature       = _deanSignature;
        directorSignature   = _directorSignature;

        // --------------------------------------------------
        // -- set audit information
        // --------------------------------------------------
        signed_EIP712_Hash              = _degreeInformation.hash_EIP712_ForSigning;
        hash_EIP712_ContractAddressSalt = _degreeInformation.hash_EIP712_ContractAddressSalt;

        // --------------------------------------------------
        // -- State verification
        // --------------------------------------------------

        // Check Degree, Owner and University information
        require(keccak256(abi.encode(degreeInformation))        == keccak256(abi.encode(_degreeInformation.degree))
                && keccak256(abi.encode(ownerInformation))      == keccak256(abi.encode(_degreeInformation.owner))
                && keccak256(abi.encode(universityInformation)) == keccak256(abi.encode(_degreeInformation.university))

                && keccak256(abi.encode(rectorSignature))       == keccak256(abi.encode(_rectorSignature))
                && keccak256(abi.encode(deanSignature))         == keccak256(abi.encode(_deanSignature))
                && keccak256(abi.encode(directorSignature))     == keccak256(abi.encode(_directorSignature)),"Degree information mismatch.");

        // Check UniversityDegree contract hash
        require(signed_EIP712_Hash              == _degreeInformation.hash_EIP712_ForSigning
                &&
                hash_EIP712_ContractAddressSalt == _degreeInformation.hash_EIP712_ContractAddressSalt, "Audit hashes mismatch");

        // --------------------------------------------------
        // Emit event DegreeCreation
        // --------------------------------------------------
        emit DegreeCreation(universityInformation.contractAddress, universityInformation.name, ownerInformation.accountAddress, ownerInformation.name, degreeInformation.name);
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- External function
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    /**
     * This function allows to the Degree owner to extract ethers that may have fallen into the contract by mistake by self Destruct
     */
    function extractEthers() external {
        require(msg.sender == ownerInformation.accountAddress   ,"Not authorized.");
        require(address(this).balance > 0                       ,"No funds to extract");
        
        uint256 ownerBalanceBeforeTransfer  = ownerInformation.accountAddress.balance;
        uint256 contractBalanceToTransfer   = address(this).balance;
        
        payable(ownerInformation.accountAddress).transfer(contractBalanceToTransfer);

        // State verificacion
        require(ownerInformation.accountAddress.balance > ownerBalanceBeforeTransfer 
                && 
                ownerInformation.accountAddress.balance <= ownerBalanceBeforeTransfer + contractBalanceToTransfer
                &&
                address(this).balance == 0, "Transfer balance mismatch.");
    }

    /**
     * Return the Chain ID where the Degree contract is deployed.
     * This information is needed for signature validation.
     */
    function getChainID() external view returns(uint256) {
        return block.chainid;
    }
}