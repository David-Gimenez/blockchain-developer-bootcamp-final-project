//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

// ----------------------------------------------------------------------------------------------------------------------------------------------
// -- Imports
// ----------------------------------------------------------------------------------------------------------------------------------------------

/// @custom:import This contract use the 'UniversityTemplate_State' contract.
import "./University/UniversityTemplate_State.sol";

/**
 * @title   UniversityTemplate
 * @author  David Gimenez Gutierrez
 * @notice  This contract is part of my new Degree Certification Protocole
 * @dev     Contract logic representing an University
 */
 contract UniversityTemplate is UniversityTemplate_State {

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constant
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    /// @notice Version of the contract
    uint256 public constant VERSION = 100;

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- External contract variables
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    /// @notice Address of the external contract that contains the governance and administration logic for the University
    address public governanceContractAddress;
    /// @notice Address of the external contract that contains the operation logic for the University
    address public logicContractAddress;

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Events
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    /// @notice Log when a new Degree title is uploaded to the list of titles pending to be processed by the University
    /// @dev This log is emitted in the 'addPendingDegree' method
    /// @param _degreePendingIndex [uint256 indexed] Index number that identifies the Degree object that is pending
    /// @param _externalID [uint256 indexed] External number assigned by the University that identifies the Degree object that is pending
    /// @param _graduatedNumber [uint256 indexed] Graduated enrollment number at the University
    /// @param _degreeName [string] Name of the University Degree title to be issued
    event NewPendingDegree(uint256 indexed _degreePendingIndex, uint256 indexed _externalID, uint256 indexed _graduatedNumber, string _degreeName);

    /// @notice Log when a new Degree title is signed by an authority's person of the University that issue the Degree title
    /// @dev This log is emitted in the 'addSignatureToPendingDegree' method
    /// @param _degreePendingIndex [uint256 indexed] Index number that identifies the Degree object that was signed
    /// @param _signatureAddress [address indexed] External owned account address of the signer
    event NewPendingDegreeSignature(uint256 indexed _degreePendingIndex, address indexed _signatureAddress);

    /// @notice Log when a new Degree title is issued by the University
    /// @dev This log is emitted in the 'publishDegree' method
    /// @param _degreeIssuedIndex [uint256 indexed] Index number that identifies the University Degree object that has been issued
    /// @param _graduatedNumber [uint256 indexed] Graduated enrollment number at the University
    /// @param _degreeName [string indexed] Name of the University Degree title to be issued
    /// @param _graduatedName [string] Name of the graduated student that receive the University Degree title that has been issued
    event NewDegree(uint256 indexed _degreeIssuedIndex, uint256 indexed _graduatedNumber, string indexed _degreeName, string _graduatedName);

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constructor
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    /// @notice Set the university information
    /// @param _universityInfo [StructUniversity.UniversityCollege] University College object that contains the University information
    /// @param _universityManager [StructUniversity.AuthorityPerson] AuthorityPerson object that contains the information of the manager of the University
    constructor(StructUniversity.UniversityCollege memory _universityInfo, StructUniversity.AuthorityPerson memory _universityManager) {
        // Check
        isValidAddress(_universityManager.accountAddress);

        // Set university objects
        universityInfo                                      = _universityInfo;
        universityInfo.contractAddress                      = address(this);
        authorities[StructDegree.AuthorityPosition.Manager] = _universityManager;
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Get functions
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    /// @notice Return a StructDegree.Degree object that contains the University Degree title information 
    /// @param _degreePendingIndex [uint256] Index number that identifies a pending Degree object 
    /// @return [StructDegree.Degree] The StructDegree.Degree object that contains the University Degree object identified by the degreePendingIndex received as a parameter
    function getPendingDegreeInformation(uint256 _degreePendingIndex) external view returns(StructDegree.Degree memory) {
        return degreePending[_degreePendingIndex].information.degree;
    }

    /// @notice Return a StructDegree.Owner object that contains the information of the graduated student that will receive the University Degree
    /// @param _degreePendingIndex [uint256] Index number that identifies a pending Degree object 
    /// @return [StructDegree.Owner] The StructDegree.Owner object that contains the information of the graduated student that will receive the University Degree
    function getPendingDegreeOwnerInformation(uint256 _degreePendingIndex) external view returns(StructDegree.Owner memory) {
        return degreePending[_degreePendingIndex].information.owner;
    }

    /// @notice Return a StructDegree.degree object that contains the information of the University Degree that has been issued
    /// @param _degreeIndex [uint256] Index number that identifies a issued Degree object 
    /// @return [StructDegree.degree] The StructDegree.degree object that contains the information of the University Degree that has been issued
    function getDegreeInformation(uint256 _degreeIndex) external view returns(StructDegree.Degree memory) {
        return degreeIssued[_degreeIndex].information.degree;
    }

    /// @notice Return a StructDegree.Owner object that contains the information of the graduated student owner of the University Degree
    /// @param _degreeIndex [uint256] Index number that identifies a issued Degree object 
    /// @return [StructDegree.Owner] The StructDegree.Owner object that contains the information of the graduated student that has received the University Degree
    function getDegreeOwnerInformation(uint256 _degreeIndex) external view returns(StructDegree.Owner memory) {
        return degreeIssued[_degreeIndex].information.owner;
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Set external contract address
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    /// @notice Set the address of the Governance contract 
    /// @param _governanceContractAddress [address] Address of the governance contract 
    function setGovernanceContractAddress(address _governanceContractAddress) external {
        // Validation check
        onlyUniversityManager();
        isValidAddress(_governanceContractAddress);

        governanceContractAddress = _governanceContractAddress;
    }

    /// @notice Set the address of the Logic contract 
    /// @param _logicContractAddress [address] Address of the Logic contract
    function setLogicContractAddress(address _logicContractAddress) external {
        // Validation check
        onlyUniversityManager();
        isValidAddress(_logicContractAddress);

        logicContractAddress = _logicContractAddress;
    }

    /// @notice Set the address of the Degree Template Container contract 
    /// @param _degreeTemplateContainerContractAddress [address] Address of the Degree Template Container contract
    function setDegreeTemplateContainerContractAddress(address _degreeTemplateContainerContractAddress) external {
        // Validation check
        onlyUniversityManager();
        isValidAddress(_degreeTemplateContainerContractAddress);

        universityDegreeTemplate_ContainerAddress = _degreeTemplateContainerContractAddress;
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Exernal functions - Governance
    // ----------------------------------------------------------------------------------------------------------------------------------------------
 
    /// @notice Set an Authority Person in the University contract. This person will be one of the University Degree signers 
    /// @dev This method use a low level call to execuit the logical code from an upgradeable contract. For this reson the parameters are underlined as are not been used here but in the contract that is been called
    /// @param _authorityPosition [StructDegree.AuthorityPosition] Authority position assigned to the authority person to be added
    /// @param _authorityPerson [StructUniversity.AuthorityPerson] Authority person to be added
    function setAuthorityPerson(StructDegree.AuthorityPosition _authorityPosition, StructUniversity.AuthorityPerson calldata _authorityPerson) external {
        // Validation check
        onlyUniversityManager();
        isValidAddress(_authorityPerson.accountAddress);
        notAuthorityPerson(_authorityPerson.accountAddress);
        
        callExternalContract(governanceContractAddress);
    }

    /// @notice Transfer an Authority Position from one Authority Person to an other. The caller must be an AUthority Person
    /// @dev The Authority Position that is transferred is the Authority Position of the caller
    /// @param _authorityPerson [StructUniversity.AuthorityPerson] Authority person that will receive the Authority Position
    function transferAuthorityPosition(StructUniversity.AuthorityPerson calldata _authorityPerson) external {
        // Validation check
        onlyUniversityAuthority();
        isValidAddress(_authorityPerson.accountAddress);
        notAuthorityPerson(_authorityPerson.accountAddress);

        callExternalContract(governanceContractAddress);
    }

    /// @notice Transfer an Authority Position of the manager to a new Authority Person. The caller must be the manager of the University
    /// @dev The Authority Position 'Manager' need his own transfer method because use a different method to check the caller
    /// @param _newUniversityManager [StructUniversity.AuthorityPerson] Authority person that will receive the Authority Position 'Manager'
    function changeUniversityManager(StructUniversity.AuthorityPerson calldata _newUniversityManager) external {
        // Validation check
        onlyUniversitySigner();
        isValidAddress(_newUniversityManager.accountAddress);
        notAuthorityPerson(_newUniversityManager.accountAddress);

        callExternalContract(governanceContractAddress);
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Logic Contract Functions - Degree process
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @notice Add a new Degree title object to the list of pending Degree objects to process
    /// @dev The new pending Degree title is added to 'degreePending' mapping defined in the UniversityTemplate_State contract 
    /// @param _degree [StructDegree.Degree] Degree object to be process
    /// @param _owner [StructDegree.Owner] Graduated information, owner of the Degree title to be process
    /// @param _externalID [uint256 indexed] External number assigned by the University that identifies the Degree object that will be added to be processed
    function addPendingDegree(StructDegree.Degree calldata _degree, StructDegree.Owner calldata _owner, uint256 _externalID) external {
        // Validation check
        isUniversityActive();
        onlyUniversityManager();

        // Emite the event for the new pending Degree
        uint256 newDegreePendingIndex = degreePendingIndex + 1;
        emit NewPendingDegree(newDegreePendingIndex, _externalID, _owner.graduateNumber, _degree.name);

        // Call logical contract
        callExternalContract(logicContractAddress);
    }

    /// @notice Add the Salt for hash signing of the University Degree title information to a specific Degree pending object
    /// @dev The Salt is base in the standard defined in the EIP-712: https://eips.ethereum.org/EIPS/eip-712
    /// @param _degreePendingIndex [uint256] Index number that identifies a pending Degree object 
    function addContractAddressSaltToPendingDegree(uint256 _degreePendingIndex) external {
        // Validation check
        isUniversityActive();
        onlyUniversityManager();

        // Call logical contract
        callExternalContract(logicContractAddress);
    }

    /// @notice This method calculates the address of the new Degree title contract to be issued, before it is created
    /// @dev This is necessary to be able to sign the Degree title information hash including the contract address before the Degree contract is created
    /// @param _degreePendingIndex [uint256] Index number that identifies a pending Degree object 
    function predictDegreeContractAddress(uint256 _degreePendingIndex) external {
    // Validation check
        isUniversityActive();
        onlyUniversityManager();

        // Call logical contract
        callExternalContract(logicContractAddress);
    }

    /// @notice This method calculates the hash of the information of the new degree title that will be used to be signed by the University authorities
    /// @dev This hash includes the address of the Degree contract that will be created lated
    /// @param _degreePendingIndex [uint256] Index number that identifies a pending Degree object 
    function generateEIP712HashForSigning(uint256 _degreePendingIndex) external {
    // Validation check
        isUniversityActive();
        onlyUniversityManager();

        // Call logical contract
        callExternalContract(logicContractAddress);
    }

    /// @notice This method adds a new signature to a pending Degree object. The Signature must be created and submitted by an Authority Person from the University, a signer
    /// @dev The signature is verified to ensure that the signer is an Authority Person  of the University who has not yet signed the Degree title object  
    /// @param _degreeIndex [uint256] Index number that identifies a pending Degree object
    /// @param _signature [bytes] It is a signature generated with the web3.eth.sign and web3.eth.personal.sign methods 
    function addSignatureToPendingDegree(uint256 _degreeIndex, bytes memory _signature) external {
        // Validation check
        isUniversityActive();
        onlyUniversitySigner();
        isValidPendingDegreeIndex(_degreeIndex);
        isValidPendingDegree(_degreeIndex);
        isValidSignature(_degreeIndex, _signature);
        
        // Emite the event for the new pending Degree
        emit NewPendingDegreeSignature(_degreeIndex, msg.sender);
        
        // Call UniversityTemplate_Logic contract for execution
        callExternalContract(logicContractAddress);
    }

    /// @notice This method publish new Degree title object creating a new contract for it
    /// @dev Each new University Degree title issued is represented by a new contract based in UniversityDegreeTemplate contract
    /// @param _degreeIndex [uint256] Index number that identifies a pending Degree object
    function publishDegree(uint256 _degreeIndex) external {
        // Validation check
        isUniversityActive();
        onlyUniversityManager();
        isValidPendingDegreeIndex(_degreeIndex);
        isValidPendingDegree(_degreeIndex);
        degreeSignatureCountAndVerification(_degreeIndex);

        // Emite the event for the new pending Degree
        uint256 newDegreeIssuedIndex    = degreeIssuedIndex + 1;
        uint256 graduateNumber          = degreePending[_degreeIndex].information.owner.graduateNumber;
        string memory graduatedName     = degreePending[_degreeIndex].information.owner.name;
        string memory degreeName        = degreePending[_degreeIndex].information.degree.name;
        
        emit NewDegree(newDegreeIssuedIndex, graduateNumber, degreeName, graduatedName);

        // Call UniversityTemplate_Logic contract for execution
        callExternalContract(logicContractAddress);
    }

    /// @notice This method remove a Degree title object from the list of pending Degree objects to process
    /// @dev The method delete each sub object contained into the main Degree object to free up storage space
    /// @param _degreeIndex [uint256] Index number that identifies a pending Degree object
    function removePendingDegreeByIndex(uint256 _degreeIndex) public {
        // Validation check
        isUniversityActive();
        onlyUniversityAuthority();
        isValidPendingDegreeIndex(_degreeIndex);

        // Call UniversityTemplate_Logic contract for execution
        callExternalContract(logicContractAddress);
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- External Functions - Degree process
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @notice Return the hash used to verify the signature
    /// @dev The hash has to have the Ethereum prefix that is added at the time of signing
    /// @param _degreeIndex [uint256] Index number that identifies a pending Degree object
    /// @return [bytes32] Returns the hash for signing of the Degree information with the EIP-712 specification
    function getEthSignedMessageHash(uint256 _degreeIndex) external view returns(bytes32) {
        // Validation check
        isUniversityActive();
        onlyUniversitySigner();
        isValidPendingDegreeIndex(_degreeIndex);
        isValidPendingDegree(_degreeIndex);

        // Return the EthSignedMessageHash to validate signatures
        //return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", degreePending[_degreeIndex].information.hash_EIP712_ForSigning));
        return degreePending[_degreeIndex].information.hash_EIP712_ForSigning;
    }

    /// @notice Return the signature object for the pendingDegreeIndex and AuthorityPosition
    /// @param _degreeIndex [uint256] Index number that identifies a pending Degree object
    /// @param _authorityPosition [StructDegree.AuthorityPosition] An Authority Position value
    /// @return [StructDegree.Signature] Returns the signature object
    function getPendingDegreeSignature(uint256 _degreeIndex, StructDegree.AuthorityPosition _authorityPosition) external view returns(StructDegree.Signature memory) {
        // Validation check
        isUniversityActive();
        onlyUniversitySigner();
        isValidPendingDegreeIndex(_degreeIndex);
        isValidPendingDegree(_degreeIndex);

        // Return the signature object for the pendingDegreeIndex and AuthorityPosition
        return degreePending[_degreeIndex].signature[_authorityPosition];
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Private functions
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Call external contract functions
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @notice Execute a low level call to a external contract
    /// @dev The low level call is performed with delegatecall command in assembly code
    /// @param _contractToCall [address] The address of the contract that will be called. The state variables of the contract are used as parameter value
    function callExternalContract(address _contractToCall) private {
        onlyUniversityAuthority();

        assembly {
            let ptr := mload(0x40)

            // (1) copy incoming call data
            calldatacopy(ptr, 0, calldatasize())

            // (2) forward call to logic contract
            let result := delegatecall(gas(), _contractToCall, ptr, calldatasize(), 0, 0)
            let size := returndatasize()

            // (3) retrieve return data
            returndatacopy(ptr, 0, size)

            // (4) forward return data back to caller
            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Modifiers as private function to reduce size
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    /// @notice Verify that the address of the sender of the transaction is the same as that of the 'Manager' of the University
    /// @dev It is a modifier made as a private function to reduce the size of the contract
    function onlyUniversityManager() private view {
        require(msg.sender == authorities[StructDegree.AuthorityPosition.Manager].accountAddress, "Not authorized");
    }

    /// @notice Verify that the address of the sender of the transaction is the same as one of the address of signers of the University (Rector, Dean, Director)
    /// @dev It is a modifier made as a private function to reduce the size of the contract
    function onlyUniversitySigner() private view {       // onlyAuthortyPerson
        require(msg.sender  == authorities[StructDegree.AuthorityPosition.Rector].accountAddress
            ||  msg.sender  == authorities[StructDegree.AuthorityPosition.Dean].accountAddress
            ||  msg.sender  == authorities[StructDegree.AuthorityPosition.Director].accountAddress, "Not authorized");
    }

    /// @notice Verify that the address of the sender of the transaction is the same as one of the Authority Person of the University (Manager, Rector, Dean, Director)
    /// @dev It is a modifier made as a private function to reduce the size of the contract
    function onlyUniversityAuthority() private view {    //onlyUniversityPersonal
        require(msg.sender  == authorities[StructDegree.AuthorityPosition.Manager].accountAddress
            ||  msg.sender  == authorities[StructDegree.AuthorityPosition.Rector].accountAddress
            ||  msg.sender  == authorities[StructDegree.AuthorityPosition.Dean].accountAddress
            ||  msg.sender  == authorities[StructDegree.AuthorityPosition.Director].accountAddress, "Not authorized");
    }

    /// @notice Verify that the address passed as a parameter is NOT the same as any of the Authority Person of the University (Manager, Rector, Dean, Director)
    /// @dev It is a modifier made as a private function to reduce the size of the contract
    /// @param _authorityPersoAccountAddress [address] The address to be checked
    function notAuthorityPerson(address _authorityPersoAccountAddress) private view {
        require(_authorityPersoAccountAddress   != authorities[StructDegree.AuthorityPosition.Manager].accountAddress
            &&_authorityPersoAccountAddress     != authorities[StructDegree.AuthorityPosition.Rector].accountAddress
            && _authorityPersoAccountAddress    != authorities[StructDegree.AuthorityPosition.Dean].accountAddress
            && _authorityPersoAccountAddress    != authorities[StructDegree.AuthorityPosition.Director].accountAddress, "Duplicated address");
    }

    /// @notice Verify that the University contract is in active status 
    /// @dev For a University contract to be in active status all Authority Position must to be loaded (Manager, Rector, Dean, Director)
    function isUniversityActive() private view {
        require(authorities[StructDegree.AuthorityPosition.Rector].accountAddress    != address(0)
            && authorities[StructDegree.AuthorityPosition.Dean].accountAddress      != address(0)
            && authorities[StructDegree.AuthorityPosition.Director].accountAddress  != address(0), "Not yet active");
    }

    /// @notice Verify that an address passed as a parameter is a valid Ethereum address
    /// @dev The verification is basic, checking if the address is different from the address of zero (address(0))
    /// @param _addressToValidate [address] The address to be checked
    function isValidAddress(address _addressToValidate) private pure {
        require(_addressToValidate != address(0), "Invalid address");
    }

    /// @notice Verify that a degree index number passed as parameters es a valid value
    /// @dev The verification is made checking that the degree index number passed as parameters is greater than zero and less or equals to the degreePendingIndex state variable value
    /// @param _degreeInformationIndex [uint256] The degree index number to be checked
    function isValidPendingDegreeIndex(uint256 _degreeInformationIndex) private view {
        require(_degreeInformationIndex > 0 && _degreeInformationIndex <= degreePendingIndex, "Invalid index");
    }

    /// @notice Verify that the pending degree in the _degreeIndex position has not been removed
    /// @dev The verification is made checking that the name of the Degree title loaded in the indicated position has a length greater than zero
    /// @param _degreeIndex [uint256] The degree index number of the Degree title to be checked
    function isValidPendingDegree(uint256 _degreeIndex) private view {
        require(bytes(degreePending[_degreeIndex].information.degree.name).length > 0, "Invalid index");    // Pending Degree requested has been removed.
    }

    /// @notice Verify that the signatures of the pending degree in the _degreeIndex position are all set
    /// @dev The verification is made checking that the length of each signature of the Degree title loaded in the indicated position has a length greater than zero
    /// @param _degreeIndex [uint256] The degree index number of the Degree title whose signatures will be verified
    function degreeSignatureCountAndVerification(uint256 _degreeIndex) private view {
        require(degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Rector].signature.length   > 0, "Rector's signature is missing");
        require(degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Dean].signature.length     > 0, "Dean's signature is missing");
        require(degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Director].signature.length > 0, "Director's signature is missing");
    }
    
    /// @notice Verify that the address of the account that creates a signature is the same address of the account that submits the signature.
    /// @dev The verification process extracts the address of the signature received as a parameter and compares it with the address of the sender of the transaction
    /// @param _degreeIndex [uint256] The degree index number of the Degree title object whose signature will be verified
    /// @param _signature [bytes] The signature to be verified. This signature was generated using web3.eth.sign or web3.eth.personal.sign methods
    function isValidSignature(uint256 _degreeIndex, bytes memory _signature) private view {
        // Check signature length
        require(_signature.length == 65, "Invalid signature length");

        // Variables to retrieve the signature information
        bytes32 r;
        bytes32 s;
        uint8 v;

        // Divide the signature in r, s and v variables
        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }

        // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
        if (v < 27) {
            v += 27;
        }

        // CHeck version
        require(v == 27 || v == 28, "Incorrect version of the signature");

        // web3.eth.sign when signing a hash adds the Ethereum prefix. This prefix must be added at the time of validation
        bytes32 signedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", degreePending[_degreeIndex].information.hash_EIP712_ForSigning));

        // Retrieve the address of the signer of the signature
        address retrievedSigner = ecrecover(signedHash, v, r, s);

        // Validate signer. The signer must be the message sender
        require(msg.sender == retrievedSigner, "Invalid signer of the signature");
    }
 }