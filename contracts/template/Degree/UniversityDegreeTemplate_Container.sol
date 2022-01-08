//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

// ----------------------------------------------------------------------------------------------------------------------------------------------
// -- Imports
// ----------------------------------------------------------------------------------------------------------------------------------------------

/// @custom:import This contract use the 'UniversityDegreeTemplate' contract.
import "./UniversityDegreeTemplate.sol";

/**
 * @title   UniversityDegreeTemplate_Container
 * @author  David Gimenez Gutierrez
 * @notice  This contract is part of my new Degree Certification Protocole
 * @dev     This contract has the responsibility of return the creation code of the University Degree Template contract
 */
contract UniversityDegreeTemplate_Container {

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constant
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @notice Version of the contract
    uint256 public constant VERSION = 100;   // Version of the contract

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- External contract variables
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @notice Address of the external owned account of the university manager address
    address public universityManagerAddress;

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constructor
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @notice Set the university manager address
    /// @param _universityManagerAddress [address] It is the external owned account of the university manager address
    constructor(address _universityManagerAddress) {
        // Check valid address
        validAddress(_universityManagerAddress);

        // Set new value
        universityManagerAddress = _universityManagerAddress;
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- External Functions
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    /// @notice Create a new university Degree contract in a pre computed contract address
    /// @dev Encode the parameters along with the bytecode of the new contract and create the new university Degree contract
    /// @param _degreeInformation [StructDegree.DegreeInformation] Contains the information of the Degree Contract that will be created
    /// @param _salt [bytes32] Contains the hash Salt for the Degree contract that will be created. Diferent Salt will generate a contract in diferent address
    /// @return [address] The address of the new contract created
    function createNewUniversityDegree(StructDegree.DegreeInformation memory _degreeInformation, bytes32 _salt) external returns(address) {

        // Encode the university degree template bytecode along with the constructor parameters
        bytes memory UniversityDegreeTemplateByteCode = type(UniversityDegreeTemplate).creationCode;
        
        // ----------------------------------------------------------------------------------------------------
        // -- New contract creation
        // -- Load parameters for new DegreeTemplate contract in the address generated before
        // ----------------------------------------------------------------------------------------------------
        bytes memory bytecode = abi.encodePacked(UniversityDegreeTemplateByteCode, abi.encode(_degreeInformation));
        
        // Emit new Degree Title by creating new DegreeTemplate contract in the address generated before
        address newDegreeContractAddress = _createContractInPrecompileAddress(bytecode, _salt);

        return newDegreeContractAddress;
    }

    /// @notice This method calculates a new contract address based on its future bytecode, constructor parameters, the address of this contract, and a salt number
    /// @dev The salt number used is the hash of the degreeInformation object, this way it is guaranteed that all addresses will be unique for each Degree
    /// @dev This code is based in the Solidity documentation: https://docs.soliditylang.org/en/v0.8.9/control-structures.html?highlight=create2#salted-contract-creations-create2
    /// @param _degreeInformation [StructDegree.DegreeInformation] Contains the information of the Degree Contract to predict his address
    /// @param _universityContractAddress [address] The address of the University contract that will issue the Degree and will create the Degree contract 
    /// @param _hash_EIP712_ContractAddressSalt [bytes32] Contains the hash Salt for the Degree contract which address will be predicted. Diferent Salt will generate a diferent contract address
    /// @return [address] The predicted address of the future Degree contract that will be created
    function predictDegreeContractAddress(StructDegree.DegreeInformation memory _degreeInformation, address _universityContractAddress, bytes32 _hash_EIP712_ContractAddressSalt) 
    external pure returns(address) 
    {

        // Get degreeTemplateBytecode
        bytes memory degreeTemplateBytecode = type(UniversityDegreeTemplate).creationCode;

        // Return the future address of the new Degree contract with the saltHash calulated 
        // This site was used as a reference: https://solidity-by-example.org/app/create2/
        return address(
            uint160(
                uint(
                    keccak256(
                        abi.encodePacked(
                            bytes1(0xff),
                            _universityContractAddress,
                            _hash_EIP712_ContractAddressSalt,
                            keccak256(
                                abi.encodePacked(
                                    degreeTemplateBytecode, 
                                    abi.encode(_degreeInformation)
                                )
                            )
                        )
                    )
                )
            )
        );
    }
    
    /// @notice Return the University Degree Template contract bytecode
    /// @dev The University Degree Template contract bytecode is obtained by the command 'creationCode' from the 'UniversityDegreeTemplate' contract type
    /// @return [bytes] The bytecode of the UniversityDegreeTemplate contract
    function getUniversityDegreeTemplateBytecode() external view returns(bytes memory) {
        // Check autorization
        onlyUniversityManager();
        
        // Return bytecode
        return type(UniversityDegreeTemplate).creationCode;
    }

    /// @notice This method set the address of the University Manager
    /// @param _universityManagerAddress [address] The address of the external owned account of the designated Manager of the University
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

    /// @notice Verify that the address of the sender of the transaction is the same as that of the Manager of the University
    /// @dev It is a modifier made as a private function to reduce the size of the contract
    function onlyUniversityManager() private view {
        require(msg.sender == universityManagerAddress, "Not authorized");
    }

    /// @notice Verify that an address passed as a parameter is a valid Ethereum address
    /// @dev The verification is basic, checking if the address is different from the address of zero (address(0))
    /// @param _universityManagerAddress [address] The address to be checked
    function validAddress(address _universityManagerAddress) private pure {
        require(_universityManagerAddress != address(0), "Invalid address");
    }

    /// @notice Create a new contract in a pre computed contract address based in a bytecode and a hash Salt
    /// @dev To create the contract I use the 'create2' coomand in an assembly code
    /// @param _bytecode [bytes] The bytecode of the new contract that will be created
    /// @param _salt [bytes32] Contains the hash Salt for the Degree contract that will be created. Diferent Salt will generate a contract in diferent address
    /// @return _newDegreeContractAddress [address] The address of the new contract created
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