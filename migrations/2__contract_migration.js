const StructUniversity_library              = artifacts.require("StructUniversity");
const universityBuilder_contract            = artifacts.require("UniversityBuilder");

const universityTemplateContainer_contract  = artifacts.require("UniversityTemplate_Container");
const transferOnDestroy_Contract            = artifacts.require("TransferOnDestroy");

const universityTemplateGovernance_Contract = artifacts.require("UniversityTemplate_Governance");
const UniversityTemplate_Logic_Contract     = artifacts.require("UniversityTemplate_Logic");

module.exports = async function (deployer, network) {
    
    // Deploy UniversityBuilder Contract
    await deployer.link(StructUniversity_library, universityBuilder_contract);
    const universityBuilderInstance = await deployer.deploy(universityBuilder_contract, {gas: 8500000000});
    
    // Deploy UniversityTemplate_Container contract
    // Need to know UnivrsityBuilder contract address to check messagge call
    await deployer.deploy(universityTemplateContainer_contract, universityBuilderInstance.address);

    // Deploy UniversityTemplate_Governance contract
    await deployer.deploy(universityTemplateGovernance_Contract, {gas: 8500000000});

    // Deploy SignatureVerification library and UniversityTemplates_Logic contract
    await deployer.deploy(UniversityTemplate_Logic_Contract, {gas: 8500000000});
  
    if (network === 'develop') {
        await deployer.deploy(transferOnDestroy_Contract);
    }
};