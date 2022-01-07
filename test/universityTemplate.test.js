// Contract usage
const universityBuilder_Contract                    = artifacts.require("UniversityBuilder");
const universityTemplateContainer_contract          = artifacts.require("universityTemplate_Container");
const universityTemplate_Contract                   = artifacts.require("universityTemplate");

const universityTemplateGovernance_Contract         = artifacts.require("universityTemplate_Governance");
const universityTemplateLogic_Contract              = artifacts.require("universityTemplate_Logic");

const universityTemplateDegreeContainer_contract    = artifacts.require("UniversityDegreeTemplate_Container");
const UniversityDegreeTemplate_contract             = artifacts.require("UniversityDegreeTemplate");


let universityTemplate_Instance;
let universityTemplateGovernancce_Instance;
let universityTemplateLogic_Instance;
let universityDegreeTemplate_Container_Instance;

// Variables to test Degree process
let newUniversityDegree;
let newDegreeOwner;

// Libraries required
const { expect }    = require("chai");
const fs            = require('fs');
const path          = require('path');

contract("University Template contract test", async accounts => {

    before("Get deploing contracts", async () => {
        const universityBuilder_Instance                = await universityBuilder_Contract.deployed();
        const universityTemplateContainer_Instance      = await universityTemplateContainer_contract.deployed();

        universityDegreeTemplate_Container_Instance     = await universityTemplateDegreeContainer_contract.deployed();

        // Set UniversityTemplate address and version
        await universityBuilder_Instance.setUniversityTemplate(universityTemplateContainer_Instance.address);

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
        it("Set UniversityDegreeTemplate_Container contract", async () => {
            // Set Logic contract instance
            await universityTemplate_Instance.setDegreeTemplateContainerContractAddress(universityDegreeTemplate_Container_Instance.address);

            // Get current UniversityDegreeTemplate_Container contract
            const UniversityDegreeTemplate_ContainerAddress   = await universityTemplate_Instance.universityDegreeTemplate_ContainerAddress();

            // Assignation check
            expect(UniversityDegreeTemplate_ContainerAddress).to.be.equal(universityDegreeTemplate_Container_Instance.address);
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
        it("Get University Degree template version and bytecode", async () => {
            // Expected University Degree template version and bytecode
            const expectedDegreeTemplateVersion     = 100;
            const universityDegreeTemplateABIPath   = path.resolve(process.cwd(), "./build/contracts/UniversityDegreeTemplate.json");
            const universityDegreeTemplateArtifact  = JSON.parse(fs.readFileSync(universityDegreeTemplateABIPath, 'utf8'));
            
            // Get University Degree template version and bytecode
            const universityDegreeTemplateVersion   = await universityDegreeTemplate_Container_Instance.VERSION();
            const universityDegreeTemplateBytecode  = await universityDegreeTemplate_Container_Instance.getUniversityDegreeTemplateBytecode();         

            // Check results
            expect(parseInt(universityDegreeTemplateVersion)).to.be.equals(expectedDegreeTemplateVersion);
            expect(universityDegreeTemplateBytecode).to.be.equals(universityDegreeTemplateArtifact.bytecode);
        });
    });
    
    describe("Logic functions test", async () => {
        
        it("Add Pending Degree test", async () => {
            
            const currentDate       = parseInt((new Date().getTime() / 1000).toFixed(0));   // In unix format
            const externalID        = 12;            // This is an example
            const graduatedNumber   = 112233;       // This is an example
            const degreeName        = "Bachelor of Systems";
            
            // Create the struct required
            newUniversityDegree = {
                name:           degreeName,
                description:    "Has met the requirements of current regulations",
                legalStatement: "Ministry of Education registered this Degree with the number 123456",
                issueDate:      currentDate,
                emissionDate:   0
            }

            newDegreeOwner = {
                name:           "David Gimenez Gutierrez",
                graduateNumber: graduatedNumber,
                accountAddress: accounts[7]    // I take the index 7 to represent the graduate student
            }
 
            // Get Manager account, corresponde to the accounts[5] address
            const managerAccount = await universityTemplate_Instance.authorities(0); // 0 It is the Manager Authority Position index
            expect(managerAccount.accountAddress).to.be.equals(accounts[5]);
            
            // Create new pending degree object
            await universityTemplate_Instance.addPendingDegree.sendTransaction(
                newUniversityDegree, newDegreeOwner, externalID, 
                { from: managerAccount.accountAddress, gas: 8500000000 }  // 5 is the new manager
            );

            // Get addedd pending degree
            let degreePendingIndex = parseInt(await universityTemplate_Instance.degreePendingIndex());

            // Add contract addres salt
            await universityTemplate_Instance.addContractAddressSaltToPendingDegree.sendTransaction(degreePendingIndex, { from: managerAccount.accountAddress });
            
            // Predict Degree contract address
            await universityTemplate_Instance.predictDegreeContractAddress.sendTransaction(degreePendingIndex, { from: managerAccount.accountAddress });

            // Generate EIP712 Hash For Signing
            await universityTemplate_Instance.generateEIP712HashForSigning.sendTransaction(degreePendingIndex, { from: managerAccount.accountAddress });
            
            // Subscribe to an event NewPendingDegree
            const filter = {
                _externalID:        externalID,
                _graduatedNumber:   graduatedNumber
            };

            // Get the event
            const currentPendingDegreeIndex = await universityTemplate_Instance.degreePendingIndex();
            const eventResult = await universityTemplate_Instance.getPastEvents("NewPendingDegree", { filter, fromBlock: 0 });

            // Check event information
            expect(eventResult[0].returnValues._degreePendingIndex).to.be.equals(currentPendingDegreeIndex.toString());
            expect(eventResult[0].returnValues._externalID).to.be.equals(externalID.toString());
            expect(eventResult[0].returnValues._graduatedNumber).to.be.equals(graduatedNumber.toString());
            expect(eventResult[0].returnValues._degreeName).to.be.equals(degreeName);
            
            // Get Pending Degree object
            degreePendingIndex          = eventResult[0].returnValues._degreePendingIndex;
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
        //-----------------------------------------------------------
        it("Add signature to pending Degree test", async () => {
            // Get degree object information
            const degreePendingIndex        = 1;   // Requiere the previos test to work
            const pendingDegreeObject       = await universityTemplate_Instance.degreePending(degreePendingIndex);
            const universityTemplateRector  = await universityTemplate_Instance.authorities(1); // 1 It is the Rector position index
            
            // Check not empty null or undefined
            expect(pendingDegreeObject.hash_EIP712_ForSigning).not.to.be.empty;
            expect(pendingDegreeObject.hash_EIP712_ForSigning).not.to.be.null;
            expect(pendingDegreeObject.hash_EIP712_ForSigning).not.to.be.undefined;

            // Sign hash by Rector accounts index 4.
            const rectorSignature = await web3.eth.sign(pendingDegreeObject.hash_EIP712_ForSigning, universityTemplateRector.accountAddress);
            
            // Check generated signature no to be null empty or undefined
            expect(rectorSignature).not.to.be.empty;
            expect(rectorSignature).not.to.be.null;
            expect(rectorSignature).not.to.be.undefined;

            // Check account signer of generated signature 
            const accountVerification = await web3.eth.accounts.recover(pendingDegreeObject.hash_EIP712_ForSigning, rectorSignature);
            expect(accountVerification, "Signature account address mismatch").to.be.equals(universityTemplateRector.accountAddress);

            // To check the signature off chain together with the rectorSignature
            //const messageHashToValidate = await universityTemplate_Instance.getEthSignedMessageHash(degreePendingIndex, { from: universityTemplateRector.accountAddress });
                        
            // Add signature to pending degree. It must be sent by the same account that signed the hash
            await universityTemplate_Instance.addSignatureToPendingDegree(
                degreePendingIndex, rectorSignature, 
                { from: universityTemplateRector.accountAddress, gas: 8500000000 }
            );
            
            // Subscribe to an event NewPendingDegree
            const filter = {
                _degreePendingIndex:    degreePendingIndex,
                _signatureAddress:      universityTemplateRector.accountAddress
            };

            // Get the event
            const eventResult = await universityTemplate_Instance.getPastEvents("NewPendingDegreeSignature", { filter, fromBlock: 0 });

            // Check event information
            expect(eventResult[0].returnValues._degreePendingIndex).to.be.equals(degreePendingIndex.toString());
            expect(eventResult[0].returnValues._signatureAddress).to.be.equals(universityTemplateRector.accountAddress);
            
            // Check that the signature has been added to the pending degree object
            const authorityPosition = 1; // 1 It is the Rector Position
            const pendingDegreeObjectSignature = await universityTemplate_Instance.getPendingDegreeSignature(
                degreePendingIndex, authorityPosition, { from: universityTemplateRector.accountAddress }
            );
            
            //console.log(pendingDegreeObjectSignature); 
            expect(pendingDegreeObjectSignature.signer.name).to.be.equals("Rector");
            expect(pendingDegreeObjectSignature.signer.accountAddress).to.be.equals(universityTemplateRector.accountAddress);
            expect(pendingDegreeObjectSignature.signature).to.be.equals(rectorSignature);
        });
        //-----------------------------------------------------------
        it("Publish Degree test", async () => {
            // Get degree object information
            const degreePendingIndex        = 1;   // Requiere the previos test to work
            const degreePendingNumber       = await universityTemplate_Instance.degreePendingNumber();  // In the test must be 1
            const universityTemplateManager = await universityTemplate_Instance.authorities(0);         // 0 is the Manager
            const pendingDegreeObject       = await universityTemplate_Instance.degreePending(degreePendingIndex);

            // Get authority people of the University
            const universityTemplateRector      = await universityTemplate_Instance.authorities(1); // 1 is the Rector
            const universityTemplateDean        = await universityTemplate_Instance.authorities(2); // 2 is the Dean
            const universityTemplateDirector    = await universityTemplate_Instance.authorities(3); // 3 is the Director

            // Add Dean and Director signatures
            const deanSignature     = await web3.eth.sign(pendingDegreeObject.hash_EIP712_ForSigning, universityTemplateDean.accountAddress);
            const directorSignature = await web3.eth.sign(pendingDegreeObject.hash_EIP712_ForSigning, universityTemplateDirector.accountAddress);
            
            // Add signature to pending degree. It must be sent by the same account that signed the hash
            await universityTemplate_Instance.addSignatureToPendingDegree(degreePendingIndex, deanSignature, { from: universityTemplateDean.accountAddress, gas: 8500000000 });
            await universityTemplate_Instance.addSignatureToPendingDegree(degreePendingIndex, directorSignature, { from: universityTemplateDirector.accountAddress, gas: 8500000000 });
            
            // Check that all signatures has been loaded to the new Degree object
            const rectorPosition    = 1;
            const deanPosition      = 2;
            const directorPosition  = 3;

            // Rector signature
            const rectorSignature_Loaded = await universityTemplate_Instance.getPendingDegreeSignature(
                degreePendingIndex, rectorPosition, { from: universityTemplateDirector.accountAddress }
            );

            // Dean signature
            const deanSignature_Loaded = await universityTemplate_Instance.getPendingDegreeSignature(
                degreePendingIndex, deanPosition, { from: universityTemplateDirector.accountAddress }
            );

            // Director signature
            const directorSignature_Loaded = await universityTemplate_Instance.getPendingDegreeSignature(
                degreePendingIndex, directorPosition, { from: universityTemplateDirector.accountAddress }
            );
            
            // Rector
            // Check signature information
            expect(rectorSignature_Loaded.signer.name).to.be.equals("Rector");
            expect(rectorSignature_Loaded.signer.accountAddress).to.be.equals(universityTemplateRector.accountAddress);
            expect(rectorSignature_Loaded.signature.length).to.be.greaterThan(0);

            // Check signature verification
            const addressInRectorSignature = await web3.eth.accounts.recover(pendingDegreeObject.hash_EIP712_ForSigning, rectorSignature_Loaded.signature);
            expect(addressInRectorSignature, "Rector signature account address mismatch").to.be.equals(universityTemplateRector.accountAddress);

            // Dean
            // Check signature information
            expect(deanSignature_Loaded.signer.name).to.be.equals("Dean");
            expect(deanSignature_Loaded.signer.accountAddress).to.be.equals(universityTemplateDean.accountAddress);
            expect(deanSignature_Loaded.signature.length).to.be.greaterThan(0);

            // Check signature verification
            const addressInDeanSignature = await web3.eth.accounts.recover(pendingDegreeObject.hash_EIP712_ForSigning, deanSignature_Loaded.signature);
            expect(addressInDeanSignature, "Dean signature account address mismatch").to.be.equals(universityTemplateDean.accountAddress);

            // Director
            // Check signature information
            expect(directorSignature_Loaded.signer.name).to.be.equals("Director");
            expect(directorSignature_Loaded.signer.accountAddress).to.be.equals(universityTemplateDirector.accountAddress);
            expect(directorSignature_Loaded.signature.length).to.be.greaterThan(0);

            // Check signature verification
            const addressInDirectorSignature = await web3.eth.accounts.recover(pendingDegreeObject.hash_EIP712_ForSigning, directorSignature_Loaded.signature);
            expect(addressInDirectorSignature, "Dean signature account address mismatch").to.be.equals(universityTemplateDirector.accountAddress);

            // ------------------------
            // Publish new Degree Title
            // ------------------------
            await universityTemplate_Instance.publishDegree(degreePendingIndex, { from: universityTemplateManager.accountAddress, gas: 8500000000 });

            // Get new object results
            const degreeIssuedIndex     = await universityTemplate_Instance.degreeIssuedIndex();
            const newDegreeIssuedObject = await universityTemplate_Instance.degreeIssued(degreeIssuedIndex);
            const universityInformation = await universityTemplate_Instance.universityInfo();

            // Check Pending Degree Object information

            // Check degreePendingNumber
            const currentDegreePendingNumber = await universityTemplate_Instance.degreePendingNumber();  // In the test must be 1
            expect(parseInt(currentDegreePendingNumber)).to.be.equals(parseInt(degreePendingNumber)-1);
            
            // Check Degree information
            expect(newDegreeIssuedObject.degree.name).to.be.equals(newUniversityDegree.name);
            expect(newDegreeIssuedObject.degree.description).to.be.equals(newUniversityDegree.description);
            expect(newDegreeIssuedObject.degree.legalStatement).to.be.equals(newUniversityDegree.legalStatement);
            expect(newDegreeIssuedObject.degree.issueDate).to.be.equals(newUniversityDegree.issueDate.toString());
            
            // Check Owner information
            expect(newDegreeIssuedObject.owner.name).to.be.equals(newDegreeOwner.name);
            expect(newDegreeIssuedObject.owner.graduateNumber).to.be.equals(newDegreeOwner.graduateNumber.toString());
            expect(newDegreeIssuedObject.owner.accountAddress).to.be.equals(newDegreeOwner.accountAddress);
            
            // Check University information
            expect(newDegreeIssuedObject.university.name).to.be.equals(universityInformation.name);
            expect(newDegreeIssuedObject.university.fullName).to.be.equals(universityInformation.fullName);
            expect(newDegreeIssuedObject.university.country).to.be.equals(universityInformation.country);
            expect(newDegreeIssuedObject.university.state).to.be.equals(universityInformation.state);
            expect(newDegreeIssuedObject.university.contractAddress).to.be.equals(universityInformation.contractAddress);

            // Check event information

            // Subscribe to an event NewDegree
            /*
            const filter = {
                _degreeIssuedIndex: degreeIssuedIndex,
                _graduatedNumber:   newDegreeIssuedObject.owner.graduateNumber,
                _degreeName:        newDegreeIssuedObject.degree.name
            };

            // Get the event
            const eventResult = await universityTemplate_Instance.getPastEvents("NewDegree", { filter, fromBlock: 0 });

            // Check event information
            expect(eventResult[0].returnValues._degreeIssuedIndex).to.be.equals(degreeIssuedIndex.toString());
            expect(eventResult[0].returnValues._graduatedNumber).to.be.equals(newDegreeIssuedObject.owner.graduateNumber.toString());
            expect(eventResult[0].returnValues._graduatedName).to.be.equals(newDegreeIssuedObject.owner.name);
            expect(eventResult[0].returnValues._degreeName).to.be.equals(newDegreeIssuedObject.degree.name);
            */

            // Get new Degree contract created
            console.log(newDegreeIssuedObject);
            UniversityDegreeTemplate_Instance = await UniversityDegreeTemplate_contract.at(newDegreeIssuedObject.contractAddress, accounts[0]);
            //console.log(UniversityDegreeTemplate_Instance);
        });
    });
});