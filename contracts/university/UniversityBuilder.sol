//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
pragma experimental ABIEncoderV2;

// ----------------------------------------------------------------------------------------------------------------------------------------------
// -- Imports
// ----------------------------------------------------------------------------------------------------------------------------------------------

/// @custom:import This contract use 'Struct University' library.
import "../libraries/StructUniversity.sol";
/// @custom:import This contract use 'UniversityTemplate_Container' contract.
import "../template/UniversityTemplate_Container.sol";

/**
 * @title   UniversityBuilder
 * @author  David Gimenez Gutierrez
 * @notice  This contract is part of my new Degree Certification Protocole
 * @dev     This contract has the responsibility of create new University contracts from template contract
 */
contract UniversityBuilder {

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constant
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    /// @notice Version of the contract
    uint256 public constant VERSION = 100;

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Contract owner variable
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @notice Contract owner address
    /// @dev It is a external owned account address of the person that administer this protocol 
    address public owner;

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Contracts variables
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @notice Address of the external contract that is managed from this contract. The contract that this contract owns 
    UniversityTemplate_Container public universityTemplateContainer;

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- State mappings
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @notice Number of University contracts created by this contract
    uint256 public universitiesNumber;

    /// @notice University college objects mapping
    /// @dev Maps an universityNumber value to an UniveristyCollege object
    mapping(uint256 => StructUniversity.UniversityCollege) public universities;

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constructor
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @notice Set the state variables owner and universitiesNumber
    constructor(){
        owner               = msg.sender;
        universitiesNumber  = 0;
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- External functions
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @notice Set the address of the University template container contract
    /// @dev  The University template container contract will be used to extract the bytecode of the University Template contract.
    /// @param _universityTemplateContainerAddress The address of the UniversityTemplateContainer contract
    function setUniversityTemplate(address _universityTemplateContainerAddress) external {
        // Check owner call
        onlyOwner();
        // Require valid version number
        require(_universityTemplateContainerAddress != address(0), "Invalid version");

        // Set state variables
        universityTemplateContainer  = UniversityTemplate_Container(_universityTemplateContainerAddress);
    }

    /// @notice Create a new university contract and add it to the university mapping
    /// @dev Encode the parameters along with the bytecode of the new contract, create the new university contract and then add it to the universities mapping
    /// @param _universityCollege [StructUniversity.UniversityCollege] contains the information fields for new university contrcat (short name, full name, country and state)
    /// @param _universityManager [StructUniversity.AuthorityPerson] contains the name and address of the account of the manager of the new University
    function createUniversity(StructUniversity.UniversityCollege calldata _universityCollege, StructUniversity.AuthorityPerson calldata _universityManager) external {
        // Check owner call
        onlyOwner();
        
        // Require valid university manager address
        require(//universityTemplateAddress                   != address(0)
            bytes(_universityCollege.name).length           > 0 
            && bytes(_universityCollege.fullName).length    > 0 
            && bytes(_universityCollege.country).length     > 0 
            && bytes(_universityCollege.state).length       > 0
            
            && bytes(_universityManager.name).length        > 0
            && _universityManager.accountAddress            != address(0), "Empty bytecode, parameters or invalid address for manager.");
        
        // Create new University contract
        address newContractAddress;
        
        // Encode the university template bytecode along with the constructor parameters
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

    /// @notice This method allows the owner to extract ethers that may have fallen into the contract by mistake by selfDestruct operation
    function extractEthers() external {
        // Check owner call
        onlyOwner();
        require(address(this).balance > 0,"No funds to extract");
        
        uint256 contractBalanceToTransfer   = address(this).balance;
        
        payable(owner).transfer(contractBalanceToTransfer);
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Private functions
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @notice Return the version of the University contract
    /// @dev This method use static call to make external call over an address of a contract received by parameters. The static call ensure that the call ia a read only operation. Next use a assembly code to convert from bytes to uint256
    /// @param _universityContractAddress [address] The address of the university contract to call to check the contract version
    /// @return _universityTemplateVersion [uint256] The value of the Version of the contract called.
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

    /// @notice Verify that the address of the sender of the transaction is the same as that of the owner of the contract
    /// @dev It is a modifier made as a private function to reduce the size of the contract
    function onlyOwner() private view {
        require(msg.sender == owner, "Not authorized");
    }
}