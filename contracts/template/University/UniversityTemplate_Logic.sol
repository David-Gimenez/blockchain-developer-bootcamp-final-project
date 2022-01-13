//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

// ----------------------------------------------------------------------------------------------------------------------------------------------
// -- Imports
// ----------------------------------------------------------------------------------------------------------------------------------------------

/// @custom:import This contract use the 'UniversityTemplate_State' contract.
import "./UniversityTemplate_State.sol";

/**
 * @title   UniversityTemplate_Logic
 * @author  David Gimenez Gutierrez
 * @notice  This contract is part of my new Degree Certification Protocole
 * @dev     This contract has the logic for the processing of Degrees for the University contract
 */
 contract UniversityTemplate_Logic is UniversityTemplate_State {

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constant
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @notice Version of the contract
    uint256 public constant VERSION = 100;   // Version of the contract

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- External Functions - Degree process
    // ----------------------------------------------------------------------------------------------------------------------------------------------  

    /// @notice Add a new Degree title object to the list of pending Degree objects to process
    /// @dev The new pending Degree title is added to 'degreePending' mapping defined in the UniversityTemplate_State contract 
    /// @param _degree [StructDegree.Degree] Degree object to be process
    /// @param _owner [StructDegree.Owner] Graduated information, owner of the Degree title to be process
    /// @param _externalID [uint256 indexed] External number assigned by the University that identifies the Degree object that will be added to be processed
    function addPendingDegree(StructDegree.Degree calldata _degree, StructDegree.Owner calldata _owner, uint256 _externalID) external {
        
        // Create new DegreeObject and add new Degree object to pending to process list
        degreePendingIndex++;
        StructDegree.DegreeObject storage newDegreeObject   = degreePending[degreePendingIndex];
        newDegreeObject.information.degree                  = _degree;
        newDegreeObject.information.owner                   = _owner;
        newDegreeObject.information.university              = universityInfo;

        // Increase the number of pending to process degree object
        degreePendingNumber++;
    }

    /// @notice Add the Salt for hash signing of the University Degree title information to a specific Degree pending object
    /// @dev The Salt is base in the standard defined in the EIP-712: https://eips.ethereum.org/EIPS/eip-712
    /// @param _degreePendingIndex [uint256] Index number that identifies a pending Degree object 
    function addContractAddressSaltToPendingDegree(uint256 _degreePendingIndex) external {

        // Get peding degree object
        StructDegree.DegreeObject storage degreeObject   = degreePending[_degreePendingIndex];

        // This hash will not contain the address of the new Degree Contract, instead it will contain the address of zero, but it does contain all the other information.
        // which makes a suitable uinque identifier for the generation of the address of the future degree contract.
        degreeObject.information.hash_EIP712_ContractAddressSalt = _getKeccak256HashFromDegreeInformation(degreePendingIndex);
    }

    /// @notice This method calculates the address of the new Degree title contract to be issued, before it is created
    /// @dev This is necessary to be able to sign the Degree title information hash including the contract address before the Degree contract is created
    /// @param _degreePendingIndex [uint256] Index number that identifies a pending Degree object 
    function predictDegreeContractAddress(uint256 _degreePendingIndex) external {

        // Get peding degree object
        StructDegree.DegreeObject storage degreeObject = degreePending[_degreePendingIndex];
        
        // Predict the futur address of the Degree contract for this new Degree object
        degreeObject.information.contractAddress        = address(0);
        degreeObject.information.hash_EIP712_ForSigning = 0;
        degreeObject.information.contractAddress        = _predictDegreeContractAddress(degreePendingIndex);
    }

    /// @notice This method calculates the hash of the information of the new degree title that will be used to be signed by the University authorities
    /// @dev This hash includes the address of the Degree contract that will be created lated
    /// @param _degreePendingIndex [uint256] Index number that identifies a pending Degree object 
    function generateEIP712HashForSigning(uint256 _degreePendingIndex) external {

        // Get peding degree object
        StructDegree.DegreeObject storage degreeObject = degreePending[_degreePendingIndex];
        
        // Generate the EIP-712 keccak256 hash of the Degree Information that will be signed by Authorities. 
        // This hash will contains the address of the future Degree contract. 
        degreeObject.information.hash_EIP712_ForSigning = _getKeccak256HashFromDegreeInformation(degreePendingIndex);
    }

    // ----------------------------------------------------------------------------------
    // -- Add Signature
    // ----------------------------------------------------------------------------------

    /// @notice This method adds a new signature to a pending Degree object. The Signature must be created and submitted by an Authority Person from the University, a signer
    /// @dev The signature is verified to ensure that the signer is an Authority Person  of the University who has not yet signed the Degree title object  
    /// @param _degreeIndex [uint256] Index number that identifies a pending Degree object
    /// @param _signature [bytes] It is a signature generated with the web3.eth.sign and web3.eth.personal.sign methods 
    function addSignatureToPendingDegree(uint256 _degreeIndex, bytes memory _signature) external {
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

    /// @notice This method publish new Degree title object creating a new contract for it
    /// @dev Each new University Degree title issued is represented by a new contract based in UniversityDegreeTemplate contract
    /// @param _degreeIndex [uint256] Index number that identifies a pending Degree object
    function publishDegree(uint256 _degreeIndex) external {
        
        // Check issue date information
        require(degreePending[_degreeIndex].information.degree.issueDate <= block.timestamp, "Invalid issue date");

        // Expected address calculated before and EIP712 Hash
        address expectedAddress = degreePending[_degreeIndex].information.contractAddress;
        bytes32 EIP712Hash      = degreePending[_degreeIndex].information.hash_EIP712_ForSigning;
        
        // Set to default values to generate the same contract address
        degreePending[_degreeIndex].information.contractAddress         = address(0);
        degreePending[_degreeIndex].information.hash_EIP712_ForSigning  = 0;

        // Emit new Degree Title by creating new DegreeTemplate contract in the address generated before
        address newDegreeContractAddress = _createContractInPrecompileAddress(_degreeIndex);

        // Check that the contract has been created in the expected address
        // It is also controled in the constructor of the new Degree contract
        require(newDegreeContractAddress == expectedAddress, "Degree address mismatch");
        
        // Check code exists in new contract by calling the VERSION method
        require(_getDegreeTemplateVersion(newDegreeContractAddress) >= 100, "Invalid Degree version");

        // Set signatures in new contract
        _setSignatures(_degreeIndex, newDegreeContractAddress);

        // Set emissionDate after contract creation to not alter the address with this information
        degreePending[_degreeIndex].information.degree.emissionDate = block.timestamp;

        // Restore original values of contract address and EIP712 hash
        degreePending[_degreeIndex].information.contractAddress         = expectedAddress;
        degreePending[_degreeIndex].information.hash_EIP712_ForSigning  = EIP712Hash;

        // Add the DegreeInformation object to the degreeIssued mapping
        _copyDegreePendingToDegreeIssued(_degreeIndex);

        // Check contract in degreeIssued
        require(keccak256(abi.encode(degreeIssued[degreeIssuedIndex].information))                                          == keccak256(abi.encode(degreePending[_degreeIndex].information))
                && keccak256(abi.encode(degreeIssued[degreeIssuedIndex].signature[StructDegree.AuthorityPosition.Rector]))  == keccak256(abi.encode(degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Rector]))
                && keccak256(abi.encode(degreeIssued[degreeIssuedIndex].signature[StructDegree.AuthorityPosition.Dean]))    == keccak256(abi.encode(degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Dean]))
                && keccak256(abi.encode(degreeIssued[degreeIssuedIndex].signature[StructDegree.AuthorityPosition.Director]))== keccak256(abi.encode(degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Director]))
                ,"Degree Issued mismatch");

        // Delete the DegreeInformation element from the degreePending mapping
        removePendingDegreeByIndex(_degreeIndex);
    }

    /// @notice This method remove a Degree title object from the list of pending Degree objects to process
    /// @dev The method delete each sub object contained into the main Degree object to free up storage space
    /// @param _degreeIndex [uint256] Index number that identifies a pending Degree object
    function removePendingDegreeByIndex(uint256 _degreeIndex) public {
        // Delete sub struct first
        delete degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Manager];
        delete degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Rector];
        delete degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Dean];
        delete degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Director];

        delete degreePending[_degreeIndex].information;
        delete degreePending[_degreeIndex];

        // Decrease the number of pending degrees to process. This is not the index of the degreePending mapping. It is the number of the degree count pending issuance. 
        degreePendingNumber--;
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Private functions
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    /// @notice Return the version of the University Degree contract
    /// @dev This method use static call to make external call over an address of a contract received by parameters. The static call ensure that the call ia a read only operation. Next use a assembly code to convert from bytes to uint256
    /// @param _degreeContractAddress [address] The address of the university Degree contract to call to check the contract version
    /// @return _degreeTemplateVersion [uint256] The value of the Version of the contract called.
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

    /// @notice Return the Authority Position of the msg.sender
    /// @dev That the message.sender is an Authority Person of the University has been ensured in the method that calls this private method
    /// @return resutl [StructDegree.AuthorityPosition] The Authority Position of the msg.sender
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

    /// @notice This method returns the hash of the DegreeInformation type structure following the guidelines of the EIPS-712
    /// @dev This method computes the hash of the nested struct object following the recommendation and sequential order dictated by https://eips.ethereum.org/EIPS/eip-712
    /// @param _degreeIndex [uint256] Index number that identifies a pending Degree object that contains the struct object type to be hashed
    /// @return [bytes32] The bytes32 value that represents the keccak256 hash of the DegreeInformation structure object
    function _getKeccak256HashFromDegreeInformation(uint256 _degreeIndex) private view returns(bytes32) {
        // Create a pointer to storage for easy access
        StructDegree.Degree                 storage _degree     = degreePending[_degreeIndex].information.degree;
        StructDegree.Owner                  storage _owner      = degreePending[_degreeIndex].information.owner;
        StructUniversity.UniversityCollege  storage _university = degreePending[_degreeIndex].information.university;

        bytes32 domainSeparatorHash = keccak256(abi.encodePacked(
                                                StructDegree.DOMAIN_SEPARATOR_HASH,
                                                keccak256(bytes("DegreeCertificationProtocole")),
                                                keccak256(abi.encode(VERSION)),
                                                block.chainid,      // ID that uniquely identifies the blockchain network where the Degree is deployed. 
                                                                    // This identification prevents the same signature from being used for other blockchain networks.
                                                address(this)       // It is the address of the contract that validate the signature, this contract.
                                                )
                                        );
        
        bytes32 degreeTypeHash = keccak256(abi.encodePacked(
                                                StructDegree.DEGREE_TYPE_HASH,
                                                keccak256(bytes(_degree.name)),
                                                keccak256(bytes(_degree.description)),
                                                keccak256(bytes(_degree.legalStatement)),
                                                _degree.issueDate
                                                )
                                        );
        
        bytes32 ownerTypeHash = keccak256(abi.encodePacked(
                                                StructDegree.OWNER_TYPE_HASH,
                                                keccak256(bytes(_owner.name)),
                                                _owner.graduateNumber,
                                                _owner.accountAddress
                                                )
                                        );
        
        bytes32 universityCollegeTypeHash = keccak256(abi.encodePacked(
                                                StructDegree.UNIVERSITY_COLLEGE_TYPE_HASH,
                                                keccak256(bytes(_university.name)),
                                                keccak256(bytes(_university.fullName)),
                                                keccak256(bytes(_university.country)),
                                                keccak256(bytes(_university.state)),
                                                _university.contractAddress
                                                )
                                        );

        // DegreeInformation object complete hash
        bytes32 degreeInformationTypeHash = keccak256(abi.encodePacked(
                                                StructDegree.DEGREE_INFORMATION_TYPE_HASH,
                                                degreeTypeHash,
                                                ownerTypeHash,
                                                universityCollegeTypeHash,
                                                degreePending[_degreeIndex].information.contractAddress
                                                )
                                            );


        
        
        // Final hash: "\x19\x01" ‖ domainSeparator ‖ hashStruct(message)
        // EIP-712 requires that the signature be produced by signing a keccak256 hash with the following prefix: 
        // At validation time:
        // For string message hash => "\x19Ethereum Signed Message\n" + len(msg) + msg (example: "\x19Ethereum Signed Message:\n32")
        // For struct message hash => "\x19\x01" + domainSeparatorHash + hashStruct(message)
        // Source: https://eips.ethereum.org/EIPS/eip-712
        // Note: We need to use `encodePacked` here instead of `encode`.
        bytes32 degreeInformationTypeHash_EIP712 = keccak256(abi.encodePacked(domainSeparatorHash,  degreeInformationTypeHash));
        
        // Return the keccak256 hash of DegreeInformation struct type object with EIP-712 codification 
        return degreeInformationTypeHash_EIP712;
    }

    /// @notice This method calculates a new contract address based on its future bytecode, constructor parameters, the address of this contract, and a salt number
    /// @dev The salt number used is the hash of the degreeInformation object, this way it is guaranteed that all addresses will be unique for each Degree
    /// @dev This code is based in this Solidity documentation: https://docs.soliditylang.org/en/v0.8.9/control-structures.html?highlight=create2#salted-contract-creations-create2
    /// @param _degreeIndex [uint256] Index number that identifies a pending Degree object that contains the struct object type to be hashed
    /// @return _expectedDegreeContractAddress [address] The new contract address calculated
    function _predictDegreeContractAddress(uint256 _degreeIndex) private view returns(address _expectedDegreeContractAddress) {
        
        // This hash will not contain the address of the new Degree Contract, instead it will contain the address of zero, but it does contain all the other information.
        // which makes a suitable unique identifier for the generation of the address of the future degree contract.
        require(degreePending[_degreeIndex].information.hash_EIP712_ContractAddressSalt.length > 0, "Salt not set");

        // Get peding degree object
        StructDegree.DegreeObject storage degreeObject = degreePending[_degreeIndex];
        
        // Call external contract
        //string memory methodToCallName  = "predictDegreeContractAddress(StructDegree.DegreeInformation,StructDegree.Signature,StructDegree.Signature,StructDegree.Signature,address,bytes32)";
        //string memory methodToCallName = "predictDegreeContractAddress(((string,string,string,uint256,uint256),(string,uint256,address),(string,string,string,string,address),address,bytes32,bytes32),((string,address),uint256,bytes),((string,address),uint256,bytes),((string,address),uint256,bytes),address,bytes32)";
        string memory methodToCallName = "predictDegreeContractAddress(((string,string,string,uint256,uint256),(string,uint256,address),(string,string,string,string,address),address,bytes32,bytes32),address,bytes32)";
        //string memory methodToCallName  = "predictDegreeContractAddress(address,bytes32)";
        bytes memory methodToCall       = abi.encodeWithSignature(methodToCallName,
                                            degreeObject.information,
        //                                    degreeObject.signature[StructDegree.AuthorityPosition.Rector],
        //                                    degreeObject.signature[StructDegree.AuthorityPosition.Dean],
        //                                    degreeObject.signature[StructDegree.AuthorityPosition.Director],
                                            universityDegreeTemplate_ContainerAddress, //degreeObject.information.university.contractAddress,
                                            degreeObject.information.hash_EIP712_ContractAddressSalt
                                            );
        (bool _success, bytes memory _returnData) = universityDegreeTemplate_ContainerAddress.staticcall(methodToCall);
        if(!_success){
            revert("Error in predictDegreeContractAddress call");
        }

        // Bytes to address
        assembly {
            _expectedDegreeContractAddress := mload(add(_returnData, 32))
        } 
        
        // Implicit return
    }

    /// @notice Create a new DegreeTempleate contract on a previously compiled address based on the hash of the corresponding DegreeInformation object
    /// @dev This method use the opCode Create2 to create a new contract base in a salt parameter, which allows to determine the address of the new contract instead of using the nonce of the calling contract
    /// @dev With create2(v, p, n, s) create new contract with code at memory p to p + n and send v wei and return the new address Where new address = first 20 bytes of keccak256(0xff + address(this) + s + keccak256(mem[p…(p+n))) and s = big-endian 256-bit value
    /// @dev This code is based in the example provided by https://solidity-by-example.org/app/create2/
    /// @param _degreeIndex [uint256] Index number that identifies a pending Degree object that contains the struct object type to be hashed
    /// @return _newDegreeContractAddress [address] The address of the new contract created
    function _createContractInPrecompileAddress(uint256 _degreeIndex) private returns(address _newDegreeContractAddress) {
        
        // Create new Degree contract with UniversityDegreeTemplate_Container
        // For this codification I use this reference
        string memory methodToCallName = "createNewUniversityDegree(((string,string,string,uint256,uint256),(string,uint256,address),(string,string,string,string,address),address,bytes32,bytes32),bytes32)";
        bytes memory methodToCall = abi.encodeWithSignature(
                                                            methodToCallName,
                                                            degreePending[_degreeIndex].information,
                                                            degreePending[_degreeIndex].information.hash_EIP712_ContractAddressSalt
                                                            );
        
        // Call the contract
        (bool _success, bytes memory _returnData) = universityDegreeTemplate_ContainerAddress.call(methodToCall);
        if(!_success){
            revert("Error on createNewUniversityDegree call");
        }

        // Bytes to address
        assembly {
            _newDegreeContractAddress := mload(add(_returnData, 32))
        } 

        // Implicit return
    }

    /// @notice Copy the information from the DegreePending object to the DegreeIssued object
    /// @dev Since DegreePending is a nested structure with mapping, the subcomponents must be copied manually
    /// @param _degreeIndex [uint256] Index number that identifies a pending Degree object to be copied
    function _copyDegreePendingToDegreeIssued(uint256 _degreeIndex) private {
        degreeIssuedIndex++;
        degreeIssued[degreeIssuedIndex].information                                          = degreePending[_degreeIndex].information;
        degreeIssued[degreeIssuedIndex].signature[StructDegree.AuthorityPosition.Rector]     = degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Rector];
        degreeIssued[degreeIssuedIndex].signature[StructDegree.AuthorityPosition.Dean]       = degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Dean];
        degreeIssued[degreeIssuedIndex].signature[StructDegree.AuthorityPosition.Director]   = degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Director];
    }

    /// @notice Set the signatures of the Authorities of the University in the new Degree contract created
    /// @param _degreeIndex [uint256] Index number that identifies a pending Degree object to be copied
    /// @param _newDegreeContractAddress [address] The address of the new Degree contract address created
    function _setSignatures(uint256 _degreeIndex, address _newDegreeContractAddress) private {
        string memory methodToCallName = "_setSignatures(((string,address),uint256,bytes),((string,address),uint256,bytes),((string,address),uint256,bytes))";
        bytes memory methodToCall = abi.encodeWithSignature(
                                                            methodToCallName,
                                                            degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Rector],
                                                            degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Dean],
                                                            degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Director]
                                                            );
        
        // Call the contract
        (bool _success, bytes memory _returnData) = _newDegreeContractAddress.call(methodToCall);
        if(!_success){
            revert("Error on _setSignatures call");
        }
    }
 }