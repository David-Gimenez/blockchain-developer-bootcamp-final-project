//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

// ----------------------------------------------------------------------------------------------------------------------------------------------
// -- Import contracts
// ----------------------------------------------------------------------------------------------------------------------------------------------
import "./UniversityDegreeTemplate.sol";

/**
 * @title   UniversityDegreeTemplate_Container
 * @author  David Gimenez Gutierrez
 *
 * This contract has the responsibility of return the creation code of the University Degree Template contract.
 * This contract is part of my new Degree Certification Protocole.
 */
contract UniversityDegreeTemplate_Container {

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constant
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    uint256 public constant VERSION = 100;   // Version of the contract

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- External contract variables
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    address public universityManagerAddress;

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constructor
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    constructor(address _universityManagerAddress) {
        // Check valid address
        validAddress(_universityManagerAddress);

        // Set new value
        universityManagerAddress = _universityManagerAddress;
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- External Functions
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    function createNewUniversityDegree(
        StructDegree.DegreeInformation   memory _degreeInformation, 
        StructDegree.Signature           memory _rectorSignature, 
        StructDegree.Signature           memory _deanSignature, 
        StructDegree.Signature           memory _directorSignature,
        bytes32                                 salt
    ) 
    external returns(address) 
    {       
        // Encode the university degree template bytecode along with the constructor parameters
        bytes memory UniversityDegreeTemplateByteCode = type(UniversityDegreeTemplate).creationCode;
        
        // ----------------------------------------------------------------------------------------------------
        // -- New contract creation
        // -- Load parameters for new DegreeTemplate contract in the address generated before
        // ----------------------------------------------------------------------------------------------------
        bytes memory bytecode   = abi.encodePacked(
                                                UniversityDegreeTemplateByteCode, 
                                                abi.encode(_degreeInformation),
                                                abi.encode(_rectorSignature),
                                                abi.encode(_deanSignature),
                                                abi.encode(_directorSignature)
                                                );
        
        // Emit new Degree Title by creating new DegreeTemplate contract in the address generated before
        address newDegreeContractAddress = _createContractInPrecompileAddress(bytecode, salt);

        return newDegreeContractAddress;
    }

    /**
     * This method calculates a new contract address based on its future bytecode, constructor parameters, the address of this contract, and a salt number
     * The salt number used is the hash of the degreeInformation object, this way it is guaranteed that all addresses will be unique for each Degree.
     * This code is based in Solidity documentation: https://docs.soliditylang.org/en/v0.8.9/control-structures.html?highlight=create2#salted-contract-creations-create2
     */
    function predictDegreeContractAddress(
        StructDegree.DegreeInformation   memory _degreeInformation, 
        StructDegree.Signature           memory _rectorSignature, 
        StructDegree.Signature           memory _deanSignature, 
        StructDegree.Signature           memory _directorSignature,
        address                                 _universityContractAddress,
        bytes32                                 _hash_EIP712_ContractAddressSalt
    ) 
    external pure returns(address) 
    {

        // Get degreeTemplateBytecode
        bytes memory degreeTemplateBytecode = type(UniversityDegreeTemplate).creationCode;

        // Return the future address of the new Degree contract with the saltHash calulated 
        return address(uint160(uint(keccak256(abi.encodePacked(
            bytes1(0xff),
            _universityContractAddress,
            _hash_EIP712_ContractAddressSalt,
            keccak256(abi.encodePacked(
                                        degreeTemplateBytecode,
                                        abi.encode(_degreeInformation),
                                        abi.encode(_rectorSignature),
                                        abi.encode(_deanSignature),
                                        abi.encode(_directorSignature)
            ))
        )))));
    }
    
    function getUniversityDegreeTemplateBytecode() external view returns(bytes memory) {
        // Check autorization
        onlyUniversityManager();
        
        // Return bytecode
        return type(UniversityDegreeTemplate).creationCode;
    }

    function setUniversityManagerAddress(address _universityManagerAddress) external {
        // Check valid address
        validAddress(_universityManagerAddress);

        // Check autorization
        onlyUniversityManager();

        // Set new value
        if (universityManagerAddress != _universityManagerAddress){
            universityManagerAddress = _universityManagerAddress;
        }
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Modifiers as private function to reduce size
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    function onlyUniversityManager() private view {
        require(msg.sender == universityManagerAddress, "Not authorized");
    }

    function validAddress(address _universityManagerAddress) private pure {
        require(_universityManagerAddress != address(0), "Invalid address");
    }

    function _createContractInPrecompileAddress(bytes memory _bytecode, bytes32 _salt) private returns(address _newDegreeContractAddress) {
        
        // Create new Degree contract with Create2 opCode
        assembly {
            _newDegreeContractAddress := create2 (
                0,                      // 0 wei sent with current call
                add(_bytecode, 0x20),   // Actual code starts after skipping the first 32 bytes
                mload(_bytecode),       // Load the size of code contained in the first 32 bytes
                _salt                   // Salt from function arguments
            )

            if iszero(extcodesize(_newDegreeContractAddress)) {
                revert(0, 0)
            }
        }

        return _newDegreeContractAddress;
    }
}