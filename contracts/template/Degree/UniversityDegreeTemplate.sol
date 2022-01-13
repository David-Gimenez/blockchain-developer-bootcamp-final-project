//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

// ----------------------------------------------------------------------------------------------------------------------------------------------
// -- Imports
// ----------------------------------------------------------------------------------------------------------------------------------------------

/// @custom:import This library use the 'StructUniversity' library.
//import "../../libraries/StructUniversity.sol";
/// @custom:import This library use the 'StructDegree' library.
import "../../libraries/StructDegree.sol";

/**
 * @title   UniversityDegreeTemplate
 * @author  David Gimenez Gutierrez
 * @notice  This contract is part of my new Degree Certification Protocole
 * @dev     This contract represents a University Degree issued by a University
 */
contract UniversityDegreeTemplate {

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constant
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @notice Version of the contract
    uint256 public constant VERSION = 100;
    
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- State variables
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    // Degree Title information

    /// @notice Contains the information of the Degree Title
    StructDegree.Degree                 public degreeInformation;
    /// @notice Contains the information of the Owner of the Degree Title
    StructDegree.Owner                  public ownerInformation;
    /// @notice Contains the information of the University that issue the Degree Titule
    StructUniversity.UniversityCollege  public universityInformation;

    // Authority signatures

    /// @notice Contains de signatur information of the University Rector
    StructDegree.Signature   public rectorSignature;
    /// @notice Contains de signatur information of the University Dean
    StructDegree.Signature   public deanSignature;
    /// @notice Contains de signatur information of the University Director
    StructDegree.Signature   public directorSignature;

    // Audit information

    /// @notice It is the hash of all DegreeInformation object without the contract address
    /// @dev It is used as an identifier to generate the address of the contract;
    bytes32 public hash_EIP712_ContractAddressSalt;
    
    /// @notice Correspond to the hash_EIP712_ForSigning in University contract keccak256 hash of all information contained in a DegreeInformation Object
    /// @dev The hash is generated following EIP-712 format
    /// @dev It is the hash that the authorities sign to authenticate the Degree Title
    /// @dev Not include emissionDate of the degree object because authorities do not have that information at the time of signing, which they do before create the smart contract
    bytes32 public signed_EIP712_Hash;

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Events
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @notice Log when this Degree title contract is created
    /// @dev This log is emitted in the constructor method
    /// @param _university_ContractAddress [address indexed] The address of the University contract that issue the Degree title and create this Degree contract
    /// @param _university_Name [string] The name of the University that issue the Degree title and create this Degree contract
    /// @param _owner_Address [address indexed] The address of the external owned account of the graduated student that receive the Degree title. The owner of the Degree contract
    /// @param _owner_Name [string] The Name of the graduated student that receive the University Degree title that has been issued
    /// @param _degreeName [string indexed] The Name of the Degree title that has been issued
    /// @param _contractAddress [address] The contract address of the Degree title that has been issued
    /// @param _contractSalt [bytes32] The hash Salt of the Degree title that has been issued
    /// @param _remittent [address] The address of the remittent of the Degree title that has been issued
    event DegreeCreation(address    indexed _university_ContractAddress, 
                        string              _university_Name, 
                        address     indexed _owner_Address, 
                        string              _owner_Name,
                        string      indexed _degreeName,
                        address             _contractAddress,
                        bytes32             _contractSalt,
                        address             _remittent);

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constructor
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @notice Set the Degree information object and state variables of the Degree contract
    /// @param _degreeInformation [StructDegree.DegreeInformation] It is the DegreeInformation object that contains the information of the issued Degree
    constructor(StructDegree.DegreeInformation   memory _degreeInformation) {
        // --------------------------------------------------
        // -- Set Degree information
        // --------------------------------------------------
        degreeInformation                   = _degreeInformation.degree;
        degreeInformation.emissionDate      = block.timestamp;
        
        // --------------------------------------------------
        // -- Set graduate owner information
        // --------------------------------------------------
        ownerInformation = _degreeInformation.owner;

        // --------------------------------------------------
        // -- Set issuer university information
        // --------------------------------------------------
        universityInformation = _degreeInformation.university;

        // --------------------------------------------------
        // -- set audit information
        // --------------------------------------------------
        signed_EIP712_Hash              = _degreeInformation.hash_EIP712_ForSigning;
        hash_EIP712_ContractAddressSalt = _degreeInformation.hash_EIP712_ContractAddressSalt;

        // --------------------------------------------------
        // Emit event DegreeCreation
        // --------------------------------------------------
        emit DegreeCreation(universityInformation.contractAddress, 
                            universityInformation.name, 
                            ownerInformation.accountAddress, 
                            ownerInformation.name, 
                            degreeInformation.name,
                            address(this),
                            hash_EIP712_ContractAddressSalt,
                            msg.sender);
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- External function
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    /// @notice This method allows the owner to extract ethers that may have fallen into the contract by mistake by selfDestruct operation
    function extractEthers() external {
        require(msg.sender == ownerInformation.accountAddress   ,"Not authorized");
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

    /// @notice Return the Chain ID where the Degree contract is deployed
    /// @dev This information is needed for signature validation
    /// @return [uint256] The Chain ID where the Degree contract is deployed
    function getChainID() external view returns(uint256) {
        return block.chainid;
    }

    // --------------------------------------------------
    // -- set Authorities signatures
    // --------------------------------------------------

    /// @notice Set the signature information in the Degree Contract
    /// @param _rectorSignature [StructDegree.Signature] The StructDegree.Signature object that contains the Rector signature information 
    /// @param _deanSignature [StructDegree.Signature] The StructDegree.Signature object that contains the Dean signature information
    /// @param _directorSignature [StructDegree.Signature] The StructDegree.Signature object that contains the Director signature information
    function _setSignatures(StructDegree.Signature memory _rectorSignature, StructDegree.Signature memory _deanSignature, StructDegree.Signature memory _directorSignature) external {
        // Access control
        require(msg.sender == universityInformation.contractAddress, "Not authorized");
        require(rectorSignature.signature.length == 0, "All signatures already uploaded");
                                
        rectorSignature     = _rectorSignature;
        deanSignature       = _deanSignature;
        directorSignature   = _directorSignature;
    }
}