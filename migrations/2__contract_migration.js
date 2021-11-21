const StructUniversity_library = artifacts.require("StructUniversity");
const universityBuilder_contract = artifacts.require("UniversityBuilder");
const transferOnDestroy_Contract = artifacts.require("TransferOnDestroy");

module.exports = async function (deployer, network) {
    await deployer.deploy(StructUniversity_library);
    await deployer.link(StructUniversity_library, universityBuilder_contract);
    await deployer.deploy(universityBuilder_contract, {gas: 8500000000});

    //await deployer.deploy(universityBuilder_contract, {gas: 8500000});
  
    if (network === 'develop') {
        await deployer.deploy(transferOnDestroy_Contract);
    }
};