// Contract usage
const transferOnDestroy_Contract = require("UniversityBuilder");
const universityBuilder_Contract = require("UniversityBuilder");
const universityBuilder_Instance;

// Libraries required
const { expect }    = require("chai");
const fs            = require('fs');
const path          = require('path');

contract("University Builder contract test", async accounts => {

    before("", async () => {
        universityBuilder_Instance = await universityBuilder_Contract.deploy();
    });

    describe("Check contract deploy and state set", async () => {
        it("It should deploy correcty", async () => {
            expect(universityBuilder_Instance, "Contract instance should be constructed.").to.be.ok;
        });
        //-----------------------------------------------------------
        it("Give the correct version", async () => {
            const expectedVersion   = 100;
            const acctaulVersion    = universityBuilder_Instance.VERSION();
            expect(acctaulVersion).to.be.equal(espectedVersion);
        });
        //-----------------------------------------------------------
        it("Set the correct state", async () => {
            const expectedOwner             = accounts[0].address;
            const expectedUniversityNumber  = 0;

            const actualOwner               = universityBuilder_Instance.owner();
            const actualUniversityNumber    = universityBuilder_Instance.universityNumber();

            expect(actualOwner).to.be.equal(expectedOwner);
            expect(actualUniversityNumber).to.be.equal(expectedUniversityNumber);
        });
    });
    
    describe("Set state test", async () => {
        it("Method: setUniversityTemplate", async () => {
            const universityBuilder_Contract_object_path    = path.resolve("../../build/contracts/UniversityBuilder.json");
            const universityBuilder_Contract_object         = JSON.parse(fs.readFileSync(universityBuilder_Contract_object_path, "UTF-8")); 
            const universityTemplateVersion                 = 100;

            console.log(universityBuilder_Contract_object_path);
            console.log(universityBuilder_Contract_object);

            // Set University Template bytecode
            universityBuilder_Instance.setUniversityTemplate(universityBuilder_Contract_object.bytecode, universityTemplateVersion);

            // Get current university template information
            const actualUniversityTemplate          = universityBuilder_Instance.universityTemplateBytecode();
            const actualUniversityTemplateVersion   = universityBuilder_Instance.universityTemplateVersion(); 

            // Information hashing
            const expectedUniversityTemplatehash    = web3.utils.keccak256(universityBuilder_Contract_object.bytecode);
            const actualUniversityTempateHash       = web3.utils.keccak256(actualUniversityTemplate);
            
            // Assignation check
            expect(actualUniversityTempateHash).to.be.equal(expectedUniversityTemplatehash);
            expect(actualUniversityTemplateVersion).to.be.equal(universityTemplateVersion);
        });
        //-----------------------------------------------------------
        it("Method: createUniversity", async () => {
            const newUniversityCollege = {
                name:       "ORT University Uruguay",
                FullName:   "ORT University Uruguay - Fernan Wan Polack",
                country:    "Uruguay",
                state:      "Montevideo"
            }

            const newAuthorityPerson = {
                name:           "David",
                accountAddress: accounts[0].address
            }

            const newUniversityAddress = await universityBuilder_Instance.createUniversity(newUniversityCollege, newAuthorityPerson);
            expect(newUniversityAddress, "Contract instance should be constructed.").to.be.ok;
            
            //-------------------------------
            //-- SIN TERMINAR
            //-- Hay que probar que la version del contrato creada pueda ser recuperada y funcione bien
            //-------------------------------
        });
        //-----------------------------------------------------------
        it("Method: extractEthers", async () => {
            const amountToTransfer = 10;

            // Transfer ethers to the transferOnDestroy_Contract
            await transferOnDestroy_Contract.sendTransaction({
                from: accounts[0].address,
                value: web3.toWei(amountToTransfer,"ether")
            });

            // Balance check transferOnDestroy_Contract
            const transferOnDestroy_ContractBalance = Web3.utils.fromWei(await web3.eth.getBalance(transferOnDestroy_Contract.address), "ether");
            expect(transferOnDestroy_ContractBalance).to.be.equal(amountToTransfer);

            // Self destruct contract
            await transferOnDestroy_Contract.selfDestruct(universityBuilder_Instance.address);

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
    });
});