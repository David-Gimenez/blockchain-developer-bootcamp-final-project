//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
pragma experimental ABIEncoderV2;

// ----------------------------------------------------------------------------------------------------------------------------------------------
// -- Import contracts
// ----------------------------------------------------------------------------------------------------------------------------------------------
import "../libraries/StructUniversity.sol";
import "../template/UniversityTemplate_Container.sol";

/**
 * @title   UniversityBuilder
 * @author  David Gimenez Gutierrez
 *
 * This contract creates new University contracts from template contract.
 * This contract is part of my new Degree Certification Protocole.
 */
contract UniversityBuilder {

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constant
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    uint256 public constant VERSION = 100;   // Version of the contract

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- State variables
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    address public owner;
    uint256 public universityTemplateVersion;

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Contracts variables
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    UniversityTemplate_Container public universityTemplateContainer;

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- State mappings
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    uint256 public universitiesNumber;                                          // Number of University contracts created
    mapping(uint256 => StructUniversity.UniversityCollege) public universities; // universitiesNumber => UniveristyCollege

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constructor
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    constructor(){
        owner               = msg.sender;
        universitiesNumber  = 0;
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- External functions
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /**
     * Set the bytecode of the university contract template.
     * @param _universityTemplateVersion unit256 representing the bytecode version of the compiled UniversityTemplate contract code.
     */
    function setUniversityTemplate(address _universityTemplateContainerAddress, uint256 _universityTemplateVersion) external {
        // Check owner call
        onlyOwner();
        // Require valid version number
        require(_universityTemplateVersion > 0
                &&
                _universityTemplateContainerAddress != address(0), "Invalid version.");

        // Set state variables
        universityTemplateContainer  = UniversityTemplate_Container(_universityTemplateContainerAddress);
        universityTemplateVersion   = _universityTemplateVersion;
    }

    /**
     * Create a new university contract, add it to the university mapping and return the struct UniversityCollege object that represents it.
     * @param _universityCollege contains the information fields for new university contrcat (short name, full name, country and state)
     * @param _universityManager contains the name and address of the account of the manager of the new University
     * @dev Encode the parameters along with the bytecode of the new contract, create the new university contract and then add it to the universities mapping,
     * then check assignation process result.
     */
    function createUniversity(StructUniversity.UniversityCollege calldata _universityCollege, StructUniversity.AuthorityPerson calldata _universityManager) external {
        // Check owner call
        onlyOwner();
        
        // Require valid university manager address
        require(//universityTemplateAddress                   != address(0)
            bytes(_universityCollege.name).length          > 0 
            && bytes(_universityCollege.fullName).length   > 0 
            && bytes(_universityCollege.country).length    > 0 
            && bytes(_universityCollege.state).length      > 0
            && _universityManager.accountAddress           != address(0), "Empty bytecode, parameters or invalid address for manager.");
        
        // Create new University contract
        address newContractAddress;
        
        // Encode the university template bytecode along with the constructor parameters
        //bytes memory UniversityTemplateByteCode = type(UniversityTemplate).creationCode;
        bytes memory UniversityTemplateByteCode = universityTemplateContainer.getUniversityTemplateBytecode();
        bytes memory newContractBytecode = abi.encodePacked(UniversityTemplateByteCode, abi.encode(_universityCollege, _universityManager));
        
        // --------------------------------------------------
        // -- New contract creation
        // -- Assembly code is used to construct the new university contract from the bytecode
        // --------------------------------------------------
        assembly {
            newContractAddress := create(0,add(newContractBytecode,0x20), mload(newContractBytecode))
        }

        // Add new University to univiesities maping
        universitiesNumber++;
        universities[universitiesNumber] = _universityCollege;

        // Set new university contract address to the university object
        universities[universitiesNumber].contractAddress = newContractAddress;
    }

     /**
      * This function allows the owner to extract ethers that may have fallen into the contract by mistake by selfDestruct operation.
      */
    function extractEthers() external {
        // Check owner call
        onlyOwner();
        require(address(this).balance > 0,"No funds to extract");
        
        //uint256 ownerBalanceBeforeTransfer  = owner.balance;
        uint256 contractBalanceToTransfer   = address(this).balance;
        
        payable(owner).transfer(contractBalanceToTransfer);
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Private functions
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    /**
     * Makes a static external call to the address of the contract received by parameters
     * @param _universityContractAddress the address of the university contract to call to check the contract version
     * @dev This method use static call to make a read only operation over an external contract. Next use a assembly code to convert from bytes to uint256.
     * @return _universityTemplateVersion The uint256 value of the getVersion method of the contract called
     */
    function _getUniversityTemplateVersion(address _universityContractAddress) private view returns(uint256 _universityTemplateVersion) {
        require(_universityContractAddress != address(0), "Not a valid address");
        bytes memory methodToCall = abi.encodeWithSignature("VERSION()");
        (bool _success, bytes memory _returnData) = _universityContractAddress.staticcall(methodToCall);
        if(!_success){
            revert();
        }
        
        // Bytes to uint256
        assembly {
          _universityTemplateVersion := mload(add(_returnData, 0x20))
        }
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Modifiers as private function to reduce size
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    function onlyOwner() private view {
        require(msg.sender == owner, "Not authorized.");
    }
}