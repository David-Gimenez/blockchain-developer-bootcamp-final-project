// Contract usage
const universityBuilder_Contract    = artifacts.require("UniversityBuilder");
const universityTemplate_Contract   = artifacts.require("UniversityTemplate");
const transferOnDestroy_Contract    = artifacts.require("TransferOnDestroy");
let universityBuilder_Instance;
let universityTemplate_Instance;
let transferOnDestroy_Instance;

// Libraries required
const { expect }    = require("chai");
const fs            = require('fs');
const path          = require('path');

contract("University Builder contract test", async accounts => {

    before("", async () => {
        universityBuilder_Instance = await universityBuilder_Contract.deployed();
        transferOnDestroy_Instance = await transferOnDestroy_Contract.deployed();
    });

    describe("Check contract deploy and state set", async () => {
        it("It should deploy correcty", async () => {
            expect(universityBuilder_Instance, "Contract instance should be constructed.").to.be.ok;
        });
        //-----------------------------------------------------------
        it("Give the correct version", async () => {
            const expectedVersion   = 100;
            const acctaulVersion    = (await universityBuilder_Instance.VERSION()).words[0];
            expect(acctaulVersion).to.be.equal(expectedVersion);
        });
        //-----------------------------------------------------------
        it("Set the correct state", async () => {
            const expectedOwner             = accounts[0];
            const expectedUniversityNumber  = 0;

            const actualOwner               = await universityBuilder_Instance.owner();
            const actualUniversityNumber    = (await universityBuilder_Instance.universitiesNumber()).words[0];

            expect(actualOwner).to.be.equal(expectedOwner);
            expect(actualUniversityNumber).to.be.equal(expectedUniversityNumber);
        });
    });
    
    describe("Set state test", async () => {
        it("Method: setUniversityTemplateVersion", async () => {
            //const universityTemplate_Contract_object_path   = path.resolve("./build/contracts/UniversityTemplate.json");
            //const universityTemplate_Contract_object        = JSON.parse(fs.readFileSync(universityTemplate_Contract_object_path, "UTF-8")); 
            const universityTemplateVersion                 = 100;

            // Set University Template bytecode
            //console.log(universityTemplate_Contract_object.bytecode);
            //return;
            const tx = await universityBuilder_Instance.setUniversityTemplate(universityTemplateVersion);
            //console.log(tx);

            // Get current university template information
            //const actualUniversityTemplate          = await universityBuilder_Instance.universityTemplateBytecode();
            const actualUniversityTemplateVersion   = (await universityBuilder_Instance.universityTemplateVersion()).words[0];;

            // Information hashing
            //const expectedUniversityTemplatehash    = web3.utils.keccak256(universityBuilder_Contract_object.bytecode);
            //const actualUniversityTempateHash       = web3.utils.keccak256(actualUniversityTemplate);
            
            // Assignation check
            //expect(actualUniversityTempateHash).to.be.equal(expectedUniversityTemplatehash);
            expect(actualUniversityTemplateVersion).to.be.equal(universityTemplateVersion);
        });
        //-----------------------------------------------------------
        it("Method: createUniversity", async () => {
            
            const newUniversityCollege = {
                name:               "ORT University Uruguay",
                fullName:           "ORT University Uruguay - Bernard Wand-Polak",
                country:            "Uruguay",
                state:              "Montevideo",
                contractAddress:    accounts[0]
            }

            const newAuthorityPerson = {
                name:           "David",
                accountAddress: accounts[0]
            }

            // Create new university contract
            const tx = await universityBuilder_Instance.createUniversity(newUniversityCollege, newAuthorityPerson);
            expect(tx, "Contract instance should be constructed.").to.be.ok;
            
            // Get new contract created
            const newContract           = await universityBuilder_Instance.universities(1);
            universityTemplate_Instance = await universityTemplate_Contract.at(newContract.contractAddress);
            
            // Load values from new contract
            const universityTemplateVersion = (await universityTemplate_Instance.VERSION()).words[0];
            const universityTemplateInfo    = (await universityTemplate_Instance.universityInfo());
            const universityTemplateManager = (await universityTemplate_Instance.authorities(0));
            const universityTemplateIndex   = (await universityTemplate_Instance.degreePendingIndex()).words[0];;
            const universityTemplateNumber  = (await universityTemplate_Instance.degreePendingNumber()).words[0];;
                        
            // Check vsersion
            expect(universityTemplateVersion).to.be.equals(100);

            // Check University information
            expect(universityTemplateInfo.name).to.be.equals(newUniversityCollege.name);
            expect(universityTemplateInfo.fullName).to.be.equals(newUniversityCollege.fullName);
            expect(universityTemplateInfo.country).to.be.equals(newUniversityCollege.country);
            expect(universityTemplateInfo.state).to.be.equals(newUniversityCollege.state);
            expect(universityTemplateInfo.contractAddress).to.be.equals(newContract.contractAddress);

            // Check authority person manager
            expect(universityTemplateManager.name).to.be.equals(newAuthorityPerson.name);
            expect(universityTemplateManager.accountAddress).to.be.equals(newAuthorityPerson.accountAddress);

            // Check Degree index and number
            expect(universityTemplateIndex).to.be.equals(0);
            expect(universityTemplateNumber).to.be.equals(0);
        });
        //-----------------------------------------------------------
        it("Method: extractEthers", async () => {
            const amountToTransfer = 10;

            // Transfer ethers to the transferOnDestroy_Instance
            await transferOnDestroy_Instance.sendTransaction({
                from: accounts[0].address,
                value: web3.utils.toWei(amountToTransfer,"ether")
            });

            // Balance check transferOnDestroy_Instance
            const transferOnDestroy_ContractBalance = Web3.utils.fromWei(await web3.eth.getBalance(transferOnDestroy_Instance.address), "ether");
            expect(transferOnDestroy_ContractBalance).to.be.equal(amountToTransfer);

            // Self destruct contract
            await transferOnDestroy_Instance.selfDestruct(universityBuilder_Instance.address);

            // Balance check in universityBuilder_Instance
            const universityBuilder_ContractBalance = web3.utils.fromWei(await web3.eth.getBalance(universityBuilder_Instance.address), "ether");
            expect(universityBuilder_ContractBalance).to.be.equal(amountToTransfer);

            // Extract ethers from the contract
            const signerAccountBalanceBeforeDestroy = await web3.eth.getBalance(signerAccountBalance.address);
            await universityBuilder_Instance.extractEthers();

            // Balance check in universityBuilder_Instance and signer account
            const universityBuilder_ContractBalanceAfterDestroy = web3.utils.fromWei(await web3.eth.getBalance(universityBuilder_Instance.address), "ether");
            const actualSignerAccountBalanceAfterDestroy        = web3.utils.fromWei(await web3.eth.getBalance(accounts[0].address), "ether");
            const expectedSignerAccountBalanceAfterDestroy      = web3.utils.fromWei(signerAccountBalanceBeforeDestroy, "ether") + 10;
            
            expect(universityBuilder_ContractBalanceAfterDestroy).to.be.equal(amountToTransfer);
            expect(actualSignerAccountBalanceAfterDestroy).to.be.equal(expectedSignerAccountBalanceAfterDestroy);
        });
        //-----------------------------------------------------------
    });
/*
    describe("Not the owner test", async () => {
        it("Try to set the state with an account different of the owner", async () => {
            // Should return "Not authorized.""
        });
    });

    describe("Value transfer test", async () => {
        it("Value transfer to the contract should fail", async () => {
            const tx = {
                from:   accounts[0].address,
                value:  web3.toWei(10,"ether")
            };

            await expect(await universityBuilder_Instance.sendTransaction(tx)).to.be.revertedWith(""); // No message is set for this error
        });
    }); */
});