const StructUniversity_library              = artifacts.require("StructUniversity");
const universityBuilder_contract            = artifacts.require("UniversityBuilder");

const universityTemplateContainer_contract  = artifacts.require("UniversityTemplate_Container");
const transferOnDestroy_Contract            = artifacts.require("TransferOnDestroy");

module.exports = async function (deployer, network) {
    await deployer.deploy(StructUniversity_library);
    await deployer.link(StructUniversity_library, universityBuilder_contract);
    const universityBuilderContract = await deployer.deploy(universityBuilder_contract, {gas: 8500000000});
    
    await deployer.deploy(universityTemplateContainer_contract, universityBuilderContract.address);
  
    if (network === 'develop') {
        await deployer.deploy(transferOnDestroy_Contract);
    }
};