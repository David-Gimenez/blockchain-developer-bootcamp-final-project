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

    before("Deploing contracts", async () => {
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

        /*
        // Deploy University Templates Logic contract and library
        const SignatureVerification_LibraryInstance = await SignatureVerification_Library.new();
        await universityTemplateLogic_Contract.link(SignatureVerification_LibraryInstance, SignatureVerification_LibraryInstance.address);
        universityTemplateLogic_Instance = await universityTemplateLogic_Contract.new(accounts[0], {gas: 8500000000});
        // Deploy University Tample Governance contract
        universityTemplateGovernancce_Instance = await universityTemplateGovernance_Contract.new(accounts[0], {gas: 8500000000});
        */

        /*
        await deployer.deploy(SignatureVerification_Library);
        await deployer.link(SignatureVerification_Library, universityTemplateLogic_Contract);
        await deployer.deploy(universityTemplateLogic_Contract, universityTemplate_Instance.address, {gas: 8500000000});

        // Deploy University Templates Governance contract
        await deployer.deploy(universityTemplateGovernance_Contract, universityTemplate_Instance.address, {gas: 8500000000});
        */
        
        // Get UniverityTemplate Governance and Logic contract instance
        universityTemplateGovernancce_Instance    = await universityTemplateGovernance_Contract.deployed();
        universityTemplateLogic_Instance          = await universityTemplateLogic_Contract.deployed();

        // Get current Manager address
        const managerAddressInGovernance = await universityTemplateGovernancce_Instance.universityManagerAddress();
        const managerAddressInLogic      = await universityTemplateLogic_Instance.universityManagerAddress();

        // Check university conttact address
        expect(managerAddressInGovernance).to.be.equals(accounts[0]);
        expect(managerAddressInLogic).to.be.equals(accounts[0]);
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

        it("Set Logic contract", async () => {
            // Set Logic contract instance
            await universityTemplate_Instance.setLogicContractAddress(universityTemplateLogic_Instance.address);

            // Get current university template Governance contract
            const universityTemplateLogicAddress   = await universityTemplate_Instance.logicContractAddress();

            // Assignation check
            expect(universityTemplateLogicAddress).to.be.equal(universityTemplateLogic_Instance.address);
        });
    });
    
    describe("Set authorities", async () => {
        it("Set Rector", async () => {
            const newAuthorityPerson = {
                name:           "Rector",
                accountAddress: accounts[1] // Address 0 => Manager
            }

            const managerAddressInGovernance = await universityTemplateGovernancce_Instance.universityManagerAddress();
            console.log(accounts[0]);
            console.log(managerAddressInGovernance);
            
            // Set rector of the university, index 1
            await universityTemplate_Instance.setAuthorityPerson(1, newAuthorityPerson).sendTransaction({ from: accounts[0] });
            
            // Get the rector loaded
            const universityTemplateRector = (await universityTemplate_Instance.authorities(1));   // 0 is the manager

            // Check authority person Rector
            expect(universityTemplateRector.name).to.be.equals(newAuthorityPerson.name);
            expect(universityTemplateRector.accountAddress).to.be.equals(newAuthorityPerson.accountAddress);
        });

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
    });
});