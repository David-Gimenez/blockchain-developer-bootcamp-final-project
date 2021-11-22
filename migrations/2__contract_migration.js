const StructUniversity_library              = artifacts.require("StructUniversity");
const universityBuilder_contract            = artifacts.require("UniversityBuilder");

const universityTemplateContainer_contract  = artifacts.require("UniversityTemplate_Container");
const transferOnDestroy_Contract            = artifacts.require("TransferOnDestroy");

const universityTemplateGovernance_Contract = artifacts.require("UniversityTemplate_Governance");
const UniversityTemplate_Logic_Contract     = artifacts.require("UniversityTemplate_Logic");
const SignatureVerification_Library         = artifacts.require("SignatureVerification");

module.exports = async function (deployer, network) {
    await deployer.deploy(StructUniversity_library);
    await deployer.link(StructUniversity_library, universityBuilder_contract);
    const universityBuilderInstance = await deployer.deploy(universityBuilder_contract, {gas: 8500000000});
    
    await deployer.deploy(universityTemplateContainer_contract, universityBuilderInstance.address);

    // Deploy University Templates Logic contract and library
    await deployer.deploy(SignatureVerification_Library);
    await deployer.link(SignatureVerification_Library, UniversityTemplate_Logic_Contract);
    await deployer.deploy(UniversityTemplate_Logic_Contract, deployer.address, {gas: 8500000000});

    // Deploy University Templates Governance contract
    await deployer.deploy(universityTemplateGovernance_Contract, deployer.address, {gas: 8500000000});
  
    if (network === 'develop') {
        await deployer.deploy(transferOnDestroy_Contract);
    }
};