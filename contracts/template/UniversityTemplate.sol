//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

// ----------------------------------------------------------------------------------------------------------------------------------------------
// -- Import contracts
// ----------------------------------------------------------------------------------------------------------------------------------------------
import "./University/UniversityTemplate_State.sol";

/**
 * @title   UniversityTemplate
 * @author  David Gimenez Gutierrez
 *
 * Contract logic representing an University. 
 * This contract is part of my new Degree Certification Protocole.
 */
 contract UniversityTemplate is UniversityTemplate_State {

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constant
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    uint256 public constant VERSION = 100;   // Version of the contract

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- External contract variables
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    address public governanceContractAddress;
    address public logicContractAddress;

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Events
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // The external ID allows you to track a request from the frontEnd
    event NewPendingDegree(uint256 indexed _degreePendingIndex, uint256 indexed _externalID, uint256 indexed _graduatedNumber, string _degreeName);
    event NewPendingDegreeSignature(uint256 indexed _degreePendingIndex, address indexed _signatureAddress);
    event NewDegree(uint256 indexed _degreeIssuedIndex, uint256 indexed _graduatedNumber, string indexed _degreeName, string _graduatedName);

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Constructor
    // ----------------------------------------------------------------------------------------------------------------------------------------------
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
    // Pending Degree
    function getPendingDegreeInformation(uint256 _degreePendingIndex) external view returns(StructDegree.Degree memory) {
        return degreePending[_degreePendingIndex].information.degree;
    }

    function getPendingDegreeOwnerInformation(uint256 _degreePendingIndex) external view returns(StructDegree.Owner memory) {
        return degreePending[_degreePendingIndex].information.owner;
    }

    // Issue Degree
    function getDegreeInformation(uint256 _degreeIndex) external view returns(StructDegree.Degree memory) {
        return degreeIssued[_degreeIndex].information.degree;
    }

    function getDegreeOwnerInformation(uint256 _degreeIndex) external view returns(StructDegree.Owner memory) {
        return degreeIssued[_degreeIndex].information.owner;
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Set external contract address
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    
    function setGovernanceContractAddress(address _governanceContractAddress) external {
        // Validation check
        onlyUniversityManager();
        isValidAddress(_governanceContractAddress);

        governanceContractAddress = _governanceContractAddress;
    }

    function setLogicContractAddress(address _logicContractAddress) external {
        // Validation check
        onlyUniversityManager();
        isValidAddress(_logicContractAddress);

        logicContractAddress = _logicContractAddress;
    }

    function setDegreeTemplateContainerContractAddress(address _degreeTemplateContainerContractAddress) external {
        // Validation check
        onlyUniversityManager();
        isValidAddress(_degreeTemplateContainerContractAddress);

        universityDegreeTemplate_ContainerAddress = _degreeTemplateContainerContractAddress;
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Exernal functions - Governance
    // ----------------------------------------------------------------------------------------------------------------------------------------------
 
    function setAuthorityPerson(StructDegree.AuthorityPosition _authorityPosition, StructUniversity.AuthorityPerson calldata _authorityPerson) external {
        // Validation check
        onlyUniversityManager();
        isValidAddress(_authorityPerson.accountAddress);
        notAuthorityPerson(_authorityPerson.accountAddress);
        
        callExternalContract(governanceContractAddress);
    }

    function transferAuthorityPosition(StructUniversity.AuthorityPerson calldata _authorityPerson) external {
        // Validation check
        onlyUniversityAuthority();
        isValidAddress(_authorityPerson.accountAddress);
        notAuthorityPerson(_authorityPerson.accountAddress);

        callExternalContract(governanceContractAddress);
    }

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

    function addContractAddressSaltToPendingDegree(uint256 _degreePendingIndex) external {
    // Validation check
        isUniversityActive();
        onlyUniversityManager();

        // Call logical contract
        callExternalContract(logicContractAddress);
    }

    function predictDegreeContractAddress(uint256 _degreePendingIndex) external {
    // Validation check
        isUniversityActive();
        onlyUniversityManager();

        // Call logical contract
        callExternalContract(logicContractAddress);
    }

    function generateEIP712HashForSigning(uint256 _degreePendingIndex) external {
    // Validation check
        isUniversityActive();
        onlyUniversityManager();

        // Call logical contract
        callExternalContract(logicContractAddress);
    }

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

    // Delete pending degree object elements
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

    // Return the hash used to verify the signature. The hash has to have the Ethereum prefix that is added at the time of signing
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

    // Return the signature object for the pendingDegreeIndex and AuthorityPosition
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
    function onlyUniversityManager() private view {
        require(msg.sender == authorities[StructDegree.AuthorityPosition.Manager].accountAddress, "Not authorized");
    }

    function onlyUniversitySigner() private view {       // onlyAuthortyPerson
        require(msg.sender  == authorities[StructDegree.AuthorityPosition.Rector].accountAddress
            ||  msg.sender  == authorities[StructDegree.AuthorityPosition.Dean].accountAddress
            ||  msg.sender  == authorities[StructDegree.AuthorityPosition.Director].accountAddress, "Not authorized");
    }

    function onlyUniversityAuthority() private view {    //onlyUniversityPersonal
        require(msg.sender  == authorities[StructDegree.AuthorityPosition.Manager].accountAddress
            ||  msg.sender  == authorities[StructDegree.AuthorityPosition.Rector].accountAddress
            ||  msg.sender  == authorities[StructDegree.AuthorityPosition.Dean].accountAddress
            ||  msg.sender  == authorities[StructDegree.AuthorityPosition.Director].accountAddress, "Not authorized");
    }

    function notAuthorityPerson(address _authorityPersoAccountAddress) private view {
        require(_authorityPersoAccountAddress   != authorities[StructDegree.AuthorityPosition.Manager].accountAddress
            &&_authorityPersoAccountAddress     != authorities[StructDegree.AuthorityPosition.Rector].accountAddress
            && _authorityPersoAccountAddress    != authorities[StructDegree.AuthorityPosition.Dean].accountAddress
            && _authorityPersoAccountAddress    != authorities[StructDegree.AuthorityPosition.Director].accountAddress, "Duplicated address");
    }

    function isUniversityActive() private view {
        require(authorities[StructDegree.AuthorityPosition.Rector].accountAddress    != address(0)
            && authorities[StructDegree.AuthorityPosition.Dean].accountAddress      != address(0)
            && authorities[StructDegree.AuthorityPosition.Director].accountAddress  != address(0), "Not yet active");
    }

    function isValidAddress(address _addressToValidate) private pure {
        require(_addressToValidate != address(0), "Invalid address");
    }

    function isValidPendingDegreeIndex(uint256 _degreeInformationIndex) private view {
        require(_degreeInformationIndex > 0 && _degreeInformationIndex <= degreePendingIndex, "Invalid index");
    }

    // Check the pending degree in the degreeIndex position has not been removed
    function isValidPendingDegree(uint256 _degreeIndex) private view {
        require(bytes(degreePending[_degreeIndex].information.degree.name).length > 0, "Invalid index");    // Pending Degree requested has been removed.
    }

    function degreeSignatureCountAndVerification(uint256 _degreeIndex) private view {
        require(degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Rector].signature.length   > 0, "Rector's signature is missing");
        require(degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Dean].signature.length     > 0, "Dean's signature is missing");
        require(degreePending[_degreeIndex].signature[StructDegree.AuthorityPosition.Director].signature.length > 0, "Director's signature is missing");
    }
    
    /**
   * @dev isValidSignature: Recover signer address from a message by using his signature
   * @param _degreeIndex to get the hash bytes32 message, the hash is the signed message. What is recovered is the signer address.
   * @param _signature bytes signature, the signature is generated using web3.eth.sign()
   */
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