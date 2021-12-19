// Riquired libreries
const fs    = require('fs');
const path  = require('path');

// Load deploy information files
const deployInformation_File_Path   = path.resolve(process.cwd(), '../deployInformation/deployInformation.json');
const deployInformation_JSON_Object = JSON.parse(fs.readFileSync(deployInformation_File_Path, 'utf8'));

// Require Artifacts
const StructUniversity_library                      = artifacts.require("StructUniversity");
const universityBuilder_contract                    = artifacts.require("UniversityBuilder");

const universityTemplateContainer_contract          = artifacts.require("UniversityTemplate_Container");
const transferOnDestroy_Contract                    = artifacts.require("TransferOnDestroy");

const universityTemplateGovernance_Contract         = artifacts.require("UniversityTemplate_Governance");
const UniversityTemplate_Logic_Contract             = artifacts.require("UniversityTemplate_Logic");

const universityTemplateDegreeContainer_contract    = artifacts.require("UniversityDegreeTemplate_Container");

module.exports = async function (deployer, network, accounts) {
    
    // Deploy UniversityBuilder Contract
    await deployer.link(StructUniversity_library, universityBuilder_contract);
    const universityBuilder_Instance = await deployer.deploy(universityBuilder_contract, {gas: 8500000000});
    
    // Deploy UniversityTemplate_Container contract
    // Need to know UnivrsityBuilder contract address to check messagge call
    const universityTemplateContainer_Instance = await deployer.deploy(universityTemplateContainer_contract, universityBuilder_Instance.address);

    // Set Univeristy Template Container address in the UniversityBuilder contract
    await universityBuilder_Instance.setUniversityTemplate(universityTemplateContainer_Instance.address);

    // Deploy UniversityTemplate_Governance contract
    const universityTemplateGovernance_Instance = await deployer.deploy(universityTemplateGovernance_Contract, {gas: 8500000000});

    // Deploy SignatureVerification library and UniversityTemplates_Logic contract
    const UniversityTemplate_Logic_Instance = await deployer.deploy(UniversityTemplate_Logic_Contract, {gas: 8500000000});

    // Deploy UniversityDegreeTemplate_Container contract
    // Need to know Univrsity manager address to check messagge call, that is account[0]
    const universityTemplateDegreeContainer_Instance = await deployer.deploy(universityTemplateDegreeContainer_contract, accounts[0]);
  
    if (network === 'develop') {
        await deployer.deploy(transferOnDestroy_Contract);
    }

    // Save deployed contract information to deploy information file
    deployInformation_JSON_Object[network].deployDate                                    = new Date();
    deployInformation_JSON_Object[network].deployer_accountAddress                       = accounts[0];
    deployInformation_JSON_Object[network].universityBuilder_contractAddress             = universityBuilder_Instance.address;
    deployInformation_JSON_Object[network].universityTemplateContainer_contractAddress   = universityTemplateContainer_Instance.address;
    deployInformation_JSON_Object[network].universityTemplateGovernance_Contract         = universityTemplateGovernance_Instance.address;
    deployInformation_JSON_Object[network].UniversityTemplate_Logic_Contract             = UniversityTemplate_Logic_Instance.address;
    deployInformation_JSON_Object[network].universityTemplateDegreeContainer_contract    = universityTemplateDegreeContainer_Instance.address;
    fs.writeFileSync(deployInformation_File_Path, JSON.stringify(deployInformation_JSON_Object, null, 2));    
    console.log("----------------------------------------------------------------------");
    console.log("-- Contracts deployed informataion save to deployInformation.json file");
    console.log("----------------------------------------------------------------------");
};