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

    /**
     * Set the bytecode of the university contract template.
     * @param _degreeTemplateBytecode the bytecode of the compiled DegreeTemplate contract.
     * @param _degreeTemplateVersion unit256 representing the bytecode version of the compiled DegreeTemplate contract code.
     */
    function setDegreeTemplate(bytes calldata _degreeTemplateBytecode, uint256 _degreeTemplateVersion) external {
        // Validation check
        onlyUniversityManager();

        callExternalContract(governanceContractAddress);
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Logic Contract Functions - Degree process
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    function addPendingDegree(StructDegree.Degree calldata _degree, StructDegree.Owner calldata _owner) external {
        // Validation check
        isUniversityActive();
        onlyUniversityManager();

        callExternalContract(logicContractAddress);
    }

    function addSignatureToPendingDegree(uint256 _degreeIndex, bytes memory _signature) external {
        // Validation check
        isUniversityActive();
        onlyUniversitySigner();
        isValidPendingDegreeIndex(_degreeIndex);
        isValidPendingDegree(_degreeIndex);

        callExternalContract(logicContractAddress);
    }

    function publishDegree(uint256 _degreeIndex) external {
        // Validation check
        isUniversityActive();
        onlyUniversityManager();
        isValidPendingDegreeIndex(_degreeIndex);
        isValidPendingDegree(_degreeIndex);
        degreeSignatureCountAndVerification(_degreeIndex);

        callExternalContract(logicContractAddress);
    }

    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- External Functions - Degree process
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    function removePendingDegreeByIndex(uint256 _degreeIndex) external {
        // Validation check
        isUniversityActive();
        onlyUniversityAuthority();
        isValidPendingDegreeIndex(_degreeIndex);

        // Delete pending degree object
        delete degreePending[_degreeIndex];
    }

    function getPendingDegreeObjectByIndex(uint256 _degreeIndex) external view returns(StructDegree.DegreeInformation memory) {
        // Validation check
        isUniversityActive(); 
        onlyUniversityAuthority(); 
        isValidPendingDegreeIndex(_degreeIndex);
        isValidPendingDegree(_degreeIndex);

        // Return de pending degree information
        return degreePending[_degreeIndex].information;
    }

    function getPendingDegreeHashToSign(uint256 _degreeIndex) external view returns(bytes32) {
        // Validation check
        isUniversityActive();
        onlyUniversitySigner();
        isValidPendingDegreeIndex(_degreeIndex);
        isValidPendingDegree(_degreeIndex);

        // Return the hash, unique identifier of the information of the degree to be issued, which must be signed
        return degreePending[_degreeIndex].information.hash_EIP712_ForSigning;
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
        require(degreeTemplateVersion > 0
            && degreeTemplateBytecode.length > 0
            && authorities[StructDegree.AuthorityPosition.Rector].accountAddress    != address(0)
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
    
 }