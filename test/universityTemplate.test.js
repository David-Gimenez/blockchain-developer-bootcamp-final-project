// Contract usage
const universityBuilder_Contract            = artifacts.require("UniversityBuilder");
const universityTemplateContainer_contract  = artifacts.require("universityTemplate_Container");
const universityTemplate_Contract           = artifacts.require("universityTemplate");

const universityTemplateGovernance_Contract = artifacts.require("universityTemplate_Governance");
const universityTemplateLogic_Contract      = artifacts.require("universityTemplate_Logic");
const SignatureVerification_Library         = artifacts.require("SignatureVerification");

let universityTemplate_Instance;
let universityTemplateGovernancce_Instance;
let universityTemplateLogic_Instance;

// Libraries required
const { expect }    = require("chai");
const fs            = require('fs');
const path          = require('path');

contract("University Template contract test", async accounts => {

    before("Get deploing contracts", async () => {
        const universityBuilder_Instance              = await universityBuilder_Contract.deployed();
        const universityTemplateContainer_Instance    = await universityTemplateContainer_contract.deployed();

        // Set UniversityTemplate address and version
        const universityTemplateVersion = 100;
        await universityBuilder_Instance.setUniversityTemplate(universityTemplateContainer_Instance.address, universityTemplateVersion);

        // Set universiti information
        const newUniversityCollege = {
            name:               "ORT University Uruguay",
            fullName:           "ORT University Uruguay - Bernard Wand-Polak",
            country:            "Uruguay",
            state:              "Montevideo",
            contractAddress:    accounts[0]
        }

        const newAuthorityPerson = {
            name:           "Manager",
            accountAddress: accounts[0]
        }

        // Create new university contract
        await universityBuilder_Instance.createUniversity(newUniversityCollege, newAuthorityPerson);

        // Get new contract created
        const universityCollegeInfo = await universityBuilder_Instance.universities(1);
        universityTemplate_Instance = await universityTemplate_Contract.at(universityCollegeInfo.contractAddress, accounts[0]);
        
        // Get UniverityTemplate Governance and Logic contract instance
        universityTemplateGovernancce_Instance    = await universityTemplateGovernance_Contract.deployed();
        universityTemplateLogic_Instance          = await universityTemplateLogic_Contract.deployed();
    });

    describe("Set external contracts", async () => {

        it("Set Governance contract", async () => {

            // Set governance contract instance
            await universityTemplate_Instance.setGovernanceContractAddress(universityTemplateGovernancce_Instance.address);

            // Get current university template Governance contract
            const universityTemplateGovernanceAddress   = await universityTemplate_Instance.governanceContractAddress();

            // Assignation check
            expect(universityTemplateGovernanceAddress).to.be.equal(universityTemplateGovernancce_Instance.address);
        });
        //-----------------------------------------------------------
        it("Set Logic contract", async () => {
            // Set Logic contract instance
            await universityTemplate_Instance.setLogicContractAddress(universityTemplateLogic_Instance.address);

            // Get current university template Governance contract
            const universityTemplateLogicAddress   = await universityTemplate_Instance.logicContractAddress();

            // Assignation check
            expect(universityTemplateLogicAddress).to.be.equal(universityTemplateLogic_Instance.address);
        });
        //-----------------------------------------------------------
        it("UniversityTemplate_Governance contract version test", async () => {
            // Get current version
            const expectedVersion   = 100;            
            const currentVersion    = await universityTemplateGovernancce_Instance.VERSION();
                        
            // Result check
            expect(parseInt(currentVersion)).to.be.equal(expectedVersion);
        });
        //-----------------------------------------------------------
        it("UniversityTemplate_Logic contract version test", async () => {
            // Get current version
            const expectedVersion   = 100;            
            const currentVersion    = await universityTemplateLogic_Instance.VERSION();
                        
            // Result check
            expect(parseInt(currentVersion)).to.be.equal(expectedVersion);
        });
    });
    
    describe("Governance functions test: Set authorities", async () => {

        it("Set Rector", async () => {
            // Create Authority Person object
            const newAuthorityPerson = {
                name:           "Rector",
                accountAddress: accounts[1] // Address 0 => Manager
            }
            
            // Set rector of the university, index 1
            await universityTemplate_Instance.setAuthorityPerson(1, newAuthorityPerson);
            
            // Get the authority loaded
            const universityTemplateRector = await universityTemplate_Instance.authorities(1);   // 0 is the manager

            // Check authority person Rector
            expect(universityTemplateRector.name).to.be.equals(newAuthorityPerson.name);
            expect(universityTemplateRector.accountAddress).to.be.equals(newAuthorityPerson.accountAddress);
        });
        //-----------------------------------------------------------
        it("Set Dean", async () => {
            const newAuthorityPerson = {
                name:           "Dean",
                accountAddress: accounts[2]
            }

            // Set rector of the university index 2
            await universityTemplate_Instance.setAuthorityPerson(2, newAuthorityPerson);

            // Get the rector loaded
            const universityTemplateRector = (await universityTemplate_Instance.authorities(2));

            // Check authority person Rector
            expect(universityTemplateRector.name).to.be.equals(newAuthorityPerson.name);
            expect(universityTemplateRector.accountAddress).to.be.equals(newAuthorityPerson.accountAddress);
        });
        //-----------------------------------------------------------
        it("Set Director", async () => {
            const newAuthorityPerson = {
                name:           "Director",
                accountAddress: accounts[3]
            }

            // Set rector of the university index 3
            await universityTemplate_Instance.setAuthorityPerson(3, newAuthorityPerson);

            // Get the rector loaded
            const universityTemplateRector = (await universityTemplate_Instance.authorities(3));

            // Check authority person Rector
            expect(universityTemplateRector.name).to.be.equals(newAuthorityPerson.name);
            expect(universityTemplateRector.accountAddress).to.be.equals(newAuthorityPerson.accountAddress);
        });
        //-----------------------------------------------------------
        it("Transfer Rector position", async () => {
            // Create Authority Person object
            const newAuthorityPerson = {
                name:           "Rector",
                accountAddress: accounts[4] // Address 0 => Manager
            }
            
            // Transfer rector position of the university to the account with index 4
            await universityTemplate_Instance.transferAuthorityPosition.sendTransaction(newAuthorityPerson, { from: accounts[1] });
            
            // Get the authority loaded
            const universityTemplateRector = await universityTemplate_Instance.authorities(1);   // 1 is the Rector

            // Check authority person Rector
            expect(universityTemplateRector.name).to.be.equals(newAuthorityPerson.name);
            expect(universityTemplateRector.accountAddress).to.be.equals(newAuthorityPerson.accountAddress);
        });
        //-----------------------------------------------------------
        it("Change University Manager position", async () => {
            // Create Authority Person object
            const newAuthorityPerson = {
                name:           "Manager",
                accountAddress: accounts[5] // Address 0 => current Manager
            }
            
            // Change manager position of the university to the account with index 5
            await universityTemplate_Instance.changeUniversityManager.sendTransaction(newAuthorityPerson, { from: accounts[2] }); // Use 2 because 1 is no longer the Rector
            
            // Get the authority loaded
            const universityTemplateRector = await universityTemplate_Instance.authorities(0);   // 0 is the Manager

            // Check authority person Rector
            expect(universityTemplateRector.name).to.be.equals(newAuthorityPerson.name);
            expect(universityTemplateRector.accountAddress).to.be.equals(newAuthorityPerson.accountAddress);
        });
        //-----------------------------------------------------------
        it("Set University Degree template version and bytecode", async () => {
            // Load University Degree template version and bytecode
            const universityDegreeTemplateVersion   = 101;
            const universityDegreeTemplateABIPath   = path.resolve(process.cwd(), "./build/contracts/UniversityDegreeTemplate.json");
            const universityDegreeTemplateArtifact  = JSON.parse(fs.readFileSync(universityDegreeTemplateABIPath, 'utf8'));
            
            // Set University Degree Template
            await universityTemplate_Instance.setDegreeTemplate.sendTransaction(
                universityDegreeTemplateArtifact.bytecode, 
                universityDegreeTemplateVersion, 
                { from: accounts[5], gas: 8500000000 }  // 5 is the new manager
            );
            
            // Get the information loaded
            const resultVersion     = await universityTemplate_Instance.degreeTemplateVersion();
            const resultBytecode    = await universityTemplate_Instance.degreeTemplateBytecode();

            // Check authority person Rector
            expect(parseInt(resultVersion)).to.be.equals(universityDegreeTemplateVersion);
            expect(resultBytecode).to.be.equals(universityDegreeTemplateArtifact.bytecode);
        });
    });
    
    describe("Logic functions test", async () => {
        
        it("Add Pending Degree test", async () => {
            
            const currentDate       = parseInt((new Date().getTime() / 1000).toFixed(0));   // In unix format
            const externalID        = 12;            // This is an example
            const graduatedNumber   = 112233;       // This is an example
            const degreeName        = "Bachelor of Systems";
            
            // Create the struct required
            const newUniversityDegree = {
                name:           degreeName,
                description:    "Has met the requirements of current regulations",
                legalStatement: "Ministry of Education registered this Degree with the number 123456",
                issueDate:      currentDate,
                emissionDate:   0
            }

            const newDegreeOwner = {
                name:           "David Gimenez Gutierrez",
                graduateNumber: graduatedNumber,
                accountAddress: accounts[7]    // I take the index 7 to represent the graduate student
            }
 
            // Create new pending degree object
            await universityTemplate_Instance.addPendingDegree.sendTransaction(
                newUniversityDegree, newDegreeOwner, externalID, 
                { from: accounts[5], gas: 8500000000 }  // 5 is the new manager
            );
            
            // Subscribe to an event NewPendingDegree
            const filter = {
                _externalID:        externalID,
                _graduatedNumber:   graduatedNumber
            };

            // Get the event
            const eventResult = await universityTemplate_Instance.getPastEvents("NewPendingDegree", { filter, fromBlock: 0 });

            // Check event information
            expect(eventResult[0].returnValues._externalID).to.be.equals(externalID.toString());
            expect(eventResult[0].returnValues._graduatedNumber).to.be.equals(graduatedNumber.toString());
            expect(eventResult[0].returnValues._degreeName).to.be.equals(degreeName);

            // Get Pending Degree object
            const degreePendingIndex    = eventResult[0].returnValues._degreePendingIndex;
            const pendingDegreeObject   = await universityTemplate_Instance.degreePending(degreePendingIndex);
            const universityInformation = await universityTemplate_Instance.universityInfo();

            //console.log(pendingDegreeObject);
            //console.log(universityInformation);

            // Check Pending Degree Object information
            
            // Check Degree information
            expect(pendingDegreeObject.degree.name).to.be.equals(newUniversityDegree.name);
            expect(pendingDegreeObject.degree.description).to.be.equals(newUniversityDegree.description);
            expect(pendingDegreeObject.degree.legalStatement).to.be.equals(newUniversityDegree.legalStatement);
            expect(pendingDegreeObject.degree.issueDate).to.be.equals(newUniversityDegree.issueDate.toString());
            expect(pendingDegreeObject.degree.emissionDate).to.be.equals(newUniversityDegree.emissionDate.toString());
            
            // Check Owner information
            expect(pendingDegreeObject.owner.name).to.be.equals(newDegreeOwner.name);
            expect(pendingDegreeObject.owner.graduateNumber).to.be.equals(newDegreeOwner.graduateNumber.toString());
            expect(pendingDegreeObject.owner.accountAddress).to.be.equals(newDegreeOwner.accountAddress);
            
            // Check University information
            expect(pendingDegreeObject.university.name).to.be.equals(universityInformation.name);
            expect(pendingDegreeObject.university.fullName).to.be.equals(universityInformation.fullName);
            expect(pendingDegreeObject.university.country).to.be.equals(universityInformation.country);
            expect(pendingDegreeObject.university.state).to.be.equals(universityInformation.state);
            expect(pendingDegreeObject.university.contractAddress).to.be.equals(universityInformation.contractAddress);
            
            // Check validation information not to be empty null or undefined
            expect(pendingDegreeObject.contractAddress).not.to.be.empty;
            expect(pendingDegreeObject.contractAddress).not.to.be.null;
            expect(pendingDegreeObject.contractAddress).not.to.be.undefined;

            expect(pendingDegreeObject.hash_EIP712_ContractAddressSalt).not.to.be.empty;
            expect(pendingDegreeObject.hash_EIP712_ContractAddressSalt).not.to.be.null;
            expect(pendingDegreeObject.hash_EIP712_ContractAddressSalt).not.to.be.undefined;

            expect(pendingDegreeObject.hash_EIP712_ForSigning).not.to.be.empty;
            expect(pendingDegreeObject.hash_EIP712_ForSigning).not.to.be.null;
            expect(pendingDegreeObject.hash_EIP712_ForSigning).not.to.be.undefined;
        });

        it("Add signature to pending Degree test", async () => {
            // Get degree object information
            const degreePendingIndex    = 1;   // Requiere the previos test to work
            const pendingDegreeObject   = await universityTemplate_Instance.degreePending(degreePendingIndex);

            // Check not empty null or undefined
            expect(pendingDegreeObject.hash_EIP712_ForSigning).not.to.be.empty;
            expect(pendingDegreeObject.hash_EIP712_ForSigning).not.to.be.null;
            expect(pendingDegreeObject.hash_EIP712_ForSigning).not.to.be.undefined;

            // Sign hash by Rector index 4
            const rectorSignature = await web3.eth.sign(pendingDegreeObject.hash_EIP712_ForSigning, accounts[4]);

            // Check not empty null or undefined
            expect(rectorSignature).not.to.be.empty;
            expect(rectorSignature).not.to.be.null;
            expect(rectorSignature).not.to.be.undefined;
            
            // Add signature to pending degree. It must be sent by the same account that signed the hash
            const universityTemplateRector = await universityTemplate_Instance.authorities(1);
            console.log(universityTemplateRector, accounts[4]);
            await universityTemplate_Instance.addSignatureToPendingDegree.sendTransaction(degreePendingIndex, rectorSignature, { from: accounts[4] });
            
            // Check that the signature has been added to the pending degree object
            const authorityPosition = 1; // 1 It is the Rector signature
            const pendingDegreeObjectSignature = await universityTemplate_Instance.getPendingDegreeSignature(degreePendingIndex, authorityPosition, { from: accounts[4] });
            console.log(pendingDegreeObjectSignature); 
            expect(pendingDegreeObjectSignature).to.be.equals(rectorSignature);
        });
    });
});