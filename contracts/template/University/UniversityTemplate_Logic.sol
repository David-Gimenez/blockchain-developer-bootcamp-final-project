//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

// ----------------------------------------------------------------------------------------------------------------------------------------------
// -- Import contracts
// ----------------------------------------------------------------------------------------------------------------------------------------------
import "./UniversityTemplate_State.sol";
import "../../libraries/SignatureVerification.sol";

/**
 * @title   UniversityTemplate_Logic
 * @author  David Gimenez Gutierrez
 *
 * Contract logic representing an University. 
 * This contract is part of my new Degree Certification Protocole.
 */
 contract UniversityTemplate_Logic is UniversityTemplate_State {

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constant
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    uint256 public constant VERSION = 100;   // Version of the contract
    
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Proxy contract variables
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    address public universityManagerAddress;

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constructor
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    constructor(address _universityManagerAddress) {
        require(_universityManagerAddress != address(0), "Invalid address");
        
        // Set state
        universityManagerAddress = _universityManagerAddress;
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- External Functions - Degree process
    // ----------------------------------------------------------------------------------------------------------------------------------------------  

    function addPendingDegree(StructDegree.Degree calldata _degree, StructDegree.Owner calldata _owner) external {
        // Validate caller
        onlyUniversityManager();
        
        // Create new DegreeObject and add new Degree object to pending to process list
        degreePendingIndex++;
        StructDegree.DegreeObject storage newDegreeObject   = degreePending[degreePendingIndex];
        newDegreeObject.information.degree                  = _degree;
        newDegreeObject.information.owner                   = _owner;
        newDegreeObject.information.university              = universityInfo;

        // This hash will not contain the address of the new Degree Contract, instead it will contain the address of zero, but it does contain all the other information.
        // which makes a suitable uinque identifier for the generation of the address of the future degree contract.
        newDegreeObject.information.hash_EIP712_ContractAddressSalt = _getKeccak256HashFromDegreeInformation(degreePendingIndex);
        
        // Predict the futur address of the Degree contract for this new Degree object 
        newDegreeObject.information.contractAddress = _predictDegreeContractAddress(degreePendingIndex);
        
        // Generate the EIP-712 keccak256 hash of the Degree Information that will be signed by Authorities. This hash will contains the address of the future Degree contract. 
        newDegreeObject.information.hash_EIP712_ForSigning = _getKeccak256HashFromDegreeInformation(degreePendingIndex);

        // Increase the number of pending to process degree object
        degreePendingNumber++;

        // Check result
        require(keccak256(abi.encode(newDegreeObject.information.degree))           == keccak256(abi.encode(_degree))
                && keccak256(abi.encode(newDegreeObject.information.owner))         == keccak256(abi.encode(_owner))
                && keccak256(abi.encode(newDegreeObject.information.university))    == keccak256(abi.encode(universityInfo))
                && newDegreeObject.information.contractAddress                      != address(0)
                && newDegreeObject.information.hash_EIP712_ForSigning.length        > 0, "Assignation mismatch");
    }

    function addSignatureToPendingDegree(uint256 _degreeIndex, bytes memory _signature) external {
        // Validate caller
        onlyUniversityManager();

        // ----------------------------------------------------------------------------------
        // -- Signature validation
        // ----------------------------------------------------------------------------------
        // Check signature length
        require(_signature.length == 65, "Invalid sig. length");

        // Verify signature
        require(SignatureVerification.verifySignature(degreePending[_degreeIndex].information.hash_EIP712_ForSigning, _signature), "Invalid signature");
        
        // ----------------------------------------------------------------------------------
        // -- Add Signature
        // ----------------------------------------------------------------------------------
        // Get the AuthrityPosition of the msg sender account
        StructDegree.AuthorityPosition authorityPosition = _getAuthorityPersonPosition();

        // Create Signature object
        StructDegree.Signature memory authoritySignature = StructDegree.Signature({
            signer          : authorities[authorityPosition],
            signatureDate   : block.timestamp,
            signature       : _signature
        });
        
        // Add signature
        degreePending[_degreeIndex].signature[authorityPosition] = authoritySignature;

        // Check result
        require(degreePending[_degreeIndex].signature[authorityPosition].signature.length > 0, "Assignation mismatch");
    }

    function publishDegree(uint256 _degreeIndex) external {
        // Validate caller
        onlyUniversityManager();
        
        // Check issue date information
        require(degreePending[_degreeIndex].information.degree.issueDate <= block.timestamp, "Invalid issue date");

        // Load parameters for new DegreeTemplate contract in the address generated before
        bytes memory bytecode   = abi.encodePacked(
                                                degreeTemplateBytecode, 
                                                abi.encode(degreePending[_degreeIndex].information),
                                                abi.encode(degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Rector]),
                                                abi.encode(degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Dean]),
                                                abi.encode(degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Director])
                                                );
        
        bytes32 salt            = degreePending[_degreeIndex].information.hash_EIP712_ContractAddressSalt;
        address expectedAddress = degreePending[_degreeIndex].information.contractAddress;
        
        // Emit new Degree Title by creating new DegreeTemplate contract in the address generated before
        address newDegreeContractAddress = _createContractInPrecompileAddress(bytecode, salt);

        // Set emissionDate after contract creation to not alter the address with this information
        degreePending[_degreeIndex].information.degree.emissionDate = block.timestamp;

        // Check that the contract has been created in the expected address
        // It is also controled in the constructor of the new Degree contract
        require(newDegreeContractAddress == expectedAddress, "Degree address mismatch");
        
        // Check code exists in new contract by calling the VERSION method
        require(_getDegreeTemplateVersion(newDegreeContractAddress) >= 100, "Invalid Degree version");

        // Add the DegreeInformation object to the degreeIssued mapping
        _copyDegreePendingToDegreeIssued(_degreeIndex);

        // Check contract in degreeIssued
        require(keccak256(abi.encode(degreeIssued[degreeIssuedIndex].information))                                          == keccak256(abi.encode(degreePending[_degreeIndex].information))
                && keccak256(abi.encode(degreeIssued[degreeIssuedIndex].signature[StructDegree.AuthorityPosition.Rector]))  == keccak256(abi.encode(degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Rector]))
                && keccak256(abi.encode(degreeIssued[degreeIssuedIndex].signature[StructDegree.AuthorityPosition.Dean]))    == keccak256(abi.encode(degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Dean]))
                && keccak256(abi.encode(degreeIssued[degreeIssuedIndex].signature[StructDegree.AuthorityPosition.Director]))== keccak256(abi.encode(degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Director]))
                ,"Degree Issued mismatch");

        // Delete the DegreeInformation element from the degreePending mapping
        delete degreePending[_degreeIndex];

        // Decrease the number of pending degrees to process. This is not the index of the degreePending mapping. It is the number of the degree count pending issuance. 
        degreePendingNumber--;
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Private functions
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    /**
     * Makes a static external call to the address of the contract received by parameters
     * @param _degreeContractAddress the address of the Degree contract to call to check the contract version
     * @dev This method use static call to make a read only operation over an external contract. Next use a assembly code to convert from bytes to uint256.
     * @return _degreeTemplateVersion The uint256 value of the getVersion method of the contract called
     */
    function _getDegreeTemplateVersion(address _degreeContractAddress) private view returns(uint256 _degreeTemplateVersion) {
        
        bytes memory methodToCall = abi.encodeWithSignature("VERSION()");
        (bool _success, bytes memory _returnData) = _degreeContractAddress.staticcall(methodToCall);
        if(!_success){
            revert();
        }
        
        // Bytes to uint256
        assembly {
          _degreeTemplateVersion := mload(add(_returnData, 0x20))
        }

        return _degreeTemplateVersion;
    }

    function _getAuthorityPersonPosition() private view returns(StructDegree.AuthorityPosition resutl) {
        if(msg.sender == authorities[StructDegree.AuthorityPosition.Manager].accountAddress)
            return StructDegree.AuthorityPosition.Manager;
        
        else if(msg.sender == authorities[StructDegree.AuthorityPosition.Rector].accountAddress)
            return StructDegree.AuthorityPosition.Rector;
        
        else if(msg.sender == authorities[StructDegree.AuthorityPosition.Dean].accountAddress)
            return StructDegree.AuthorityPosition.Dean;
        
        else if (msg.sender == authorities[StructDegree.AuthorityPosition.Director].accountAddress)
            return StructDegree.AuthorityPosition.Director;
    }

    /**
     * This method computes the hash of the DegreeInformation type structure following the guidelines of https://eips.ethereum.org/EIPS/eip-712
     * @param _degreeIndex the index of the DegreeInformation element that contains de struct object type to be hashed.
     * @dev This method computes the hash of the nested struct object following the recommendation and sequential order dictated by https://eips.ethereum.org/EIPS/eip-712
     * @return A value of bytes32 that represents the keccak256 hash of the DegreeInformation structure object. 
     */
    function _getKeccak256HashFromDegreeInformation(uint256 _degreeIndex) private view returns(bytes32) {
        // Create a pointer to storage for easy access
        StructDegree.Degree                 storage _degree     = degreePending[_degreeIndex].information.degree;
        StructDegree.Owner                  storage _owner      = degreePending[_degreeIndex].information.owner;
        StructUniversity.UniversityCollege  storage _university = degreePending[_degreeIndex].information.university;

        bytes32 domainSeparatorHash = keccak256(abi.encode(
                                                StructDegree.DOMAIN_SEPARATOR_HASH,
                                                keccak256(bytes("DegreeCertificationProtocole")),
                                                keccak256(abi.encode(VERSION)),
                                                block.chainid,      // ID that uniquely identifies the blockchain network where the Degree is deployed. 
                                                                    // This identification prevents the same signature from being used for other blockchain networks.
                                                address(this)       // It is the address of the contract that validate the signature, this contract.
                                                )
                                        );
        
        bytes32 degreeTypeHash = keccak256(abi.encode(
                                                StructDegree.DEGREE_TYPE_HASH,
                                                keccak256(bytes(_degree.name)),
                                                keccak256(bytes(_degree.description)),
                                                keccak256(bytes(_degree.legalStatement)),
                                                _degree.issueDate
                                                )
                                        );
        
        bytes32 ownerTypeHash = keccak256(abi.encode(
                                                StructDegree.OWNER_TYPE_HASH,
                                                keccak256(bytes(_owner.name)),
                                                _owner.graduateNumber,
                                                _owner.accountAddress
                                                )
                                        );
        
        bytes32 universityCollegeTypeHash = keccak256(abi.encode(
                                                StructDegree.UNIVERSITY_COLLEGE_TYPE_HASH,
                                                keccak256(bytes(_university.name)),
                                                keccak256(bytes(_university.fullName)),
                                                keccak256(bytes(_university.country)),
                                                keccak256(bytes(_university.state)),
                                                _university.contractAddress
                                                )
                                        );

        // DegreeInformation object complete hash
        bytes32 degreeInformationTypeHash = keccak256(abi.encode(
                                                StructDegree.DEGREE_INFORMATION_TYPE_HASH,
                                                degreeTypeHash,
                                                ownerTypeHash,
                                                universityCollegeTypeHash,
                                                degreePending[_degreeIndex].information.contractAddress
                                                )
                                            );
        
        // Final hash: "\x19\x01" ‖ domainSeparator ‖ hashStruct(message)
        // EIP-712 requires that the signature be produced by signing a keccak256 hash with the following prefix: 
        // For string message hash => "\x19Ethereum Signed Message\n" + len(msg) + msg (example: "\x19Ethereum Signed Message:\n32")
        // For struct message hash => "\x19\x01" + domainSeparatorHash + hashStruct(message)
        // Source: https://eips.ethereum.org/EIPS/eip-712
        // Note: We need to use `encodePacked` here instead of `encode`.
        bytes32 degreeInformationTypeHash_EIP712 = keccak256(abi.encodePacked("\x19\x01", domainSeparatorHash,  degreeInformationTypeHash));
        
        // Return the keccak256 hash of DegreeInformation struct type object with EIP-712 codification 
        return degreeInformationTypeHash_EIP712;
    }

    /**
     * This method calculates a new contract address based on its future bytecode, constructor parameters, the address of this contract, and a salt number
     * The salt number used is the hash of the degreeInformation object, this way it is guaranteed that all addresses will be unique for each Degree.
     * This code is based in Solidity documentation: https://docs.soliditylang.org/en/v0.8.9/control-structures.html?highlight=create2#salted-contract-creations-create2
     */
    function _predictDegreeContractAddress(uint256 _degreeIndex) private view returns(address) {
        
        // This hash will not contain the address of the new Degree Contract, instead it will contain the address of zero, but it does contain all the other information.
        // which makes a suitable uinque identifier for the generation of the address of the future degree contract.
        require(degreePending[_degreeIndex].information.hash_EIP712_ContractAddressSalt.length == 0, "Salt not set");

        // Return the future address of the new Degree contract with the saltHash calulated 
        return address(uint160(uint(keccak256(abi.encodePacked(
            bytes1(0xff),
            address(this),
            degreePending[_degreeIndex].information.hash_EIP712_ContractAddressSalt,
            keccak256(abi.encodePacked(
                                        degreeTemplateBytecode,
                                        abi.encode(degreePending[_degreeIndex].information),
                                        abi.encode(degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Rector]),
                                        abi.encode(degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Dean]),
                                        abi.encode(degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Director])
            ))
        )))));
    }

    /**
     * Create a new DegreeTempleate contract on a previously compiled address based on the hash of the corresponding DegreeInformation object
     * @dev This method use the opCode Create2 to create a new contract base in a salt parameter, which allows to determine the address of the new contract
     * instead of using the nonce of the calling contract.
     * With create2(v, p, n, s) create new contract with code at memory p to p + n and send v wei and return the new address
     * Where new address = first 20 bytes of keccak256(0xff + address(this) + s + keccak256(mem[p…(p+n))) and s = big-endian 256-bit value
     * This code is based in the example provided by https://solidity-by-example.org/app/create2/
     */
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

    /**
     * Copy the information from the DegreePending object to the DegreeIssued object. Since DegreePending is a nested structure with mapping, the subcomponents must be copied manually.
     */
    function _copyDegreePendingToDegreeIssued(uint256 _degreeIndex) private {
        degreeIssuedIndex++;
        degreeIssued[degreeIssuedIndex].information                                          = degreePending[_degreeIndex].information;
        degreeIssued[degreeIssuedIndex].signature[StructDegree.AuthorityPosition.Rector]     = degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Rector];
        degreeIssued[degreeIssuedIndex].signature[StructDegree.AuthorityPosition.Dean]       = degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Dean];
        degreeIssued[degreeIssuedIndex].signature[StructDegree.AuthorityPosition.Director]   = degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Director];
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Modifiers as private function to reduce size
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    function onlyUniversityManager() private view {
        require(msg.sender == universityManagerAddress, "Not authorized.");
    }
 }