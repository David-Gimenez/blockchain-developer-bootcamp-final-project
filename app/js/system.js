// Load deploy information files
const universityBuilder_contractAddress = "0x6dec23f85302FF8B35ef66C8a35c78cd344B489C";
const universityBuilder_ABI_JSON        = `[
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "VERSION",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "universities",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "fullName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "country",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "state",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "contractAddress",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "universitiesNumber",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "universityTemplateContainer",
      "outputs": [
        {
          "internalType": "contract UniversityTemplate_Container",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_universityTemplateContainerAddress",
          "type": "address"
        }
      ],
      "name": "setUniversityTemplate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "fullName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "country",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "state",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "contractAddress",
              "type": "address"
            }
          ],
          "internalType": "struct StructUniversity.UniversityCollege",
          "name": "_universityCollege",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "accountAddress",
              "type": "address"
            }
          ],
          "internalType": "struct StructUniversity.AuthorityPerson",
          "name": "_universityManager",
          "type": "tuple"
        }
      ],
      "name": "createUniversity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "extractEthers",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]`;
const universityBuilder_ABI = JSON.parse(universityBuilder_ABI_JSON);

// Connect to the contract
const web3 = new window.Web3(window.ethereum);
const contractInstance = new web3.eth.Contract(universityBuilder_ABI, universityBuilder_contractAddress);

// Load html objects
let metaMaskDiv                             = document.getElementById('metaMaskDiv');
let saveButton                              = document.getElementById('saveButton');
let UniversityTemplateContainerAddressInput = document.getElementById('UniversityTemplateContainerAddressInput');

// Check if MetaMask if installed
window.addEventListener('load', function(){
    // Check for wallet integrated
    if(typeof window.ethereum !== 'undefined'){
        metaMaskDiv.innerHTML = "Connect MetaMask";
    }
    else {
        metaMaskDiv.innerHTML = "No wallet connected";
    }
});

// On-click method for MetaMask connection
metaMaskDiv.onclick = async () => {
    if (metaMaskDiv.innerHTML === "Connect MetaMask"){

        await window.ethereum.request({ method: 'eth_requestAccounts'});
        metaMaskDiv.innerHTML = "Connected account: " + window.ethereum.selectedAddress;

        // -----------------------------------------------------------------------------------------------------------------------------
        // Load information for "statusContentDiv"
        // -----------------------------------------------------------------------------------------------------------------------------
        const universityBuilder_Version                     = await contractInstance.methods.VERSION().call();
        const universityBuilder_OwnerAccountAddress         = await contractInstance.methods.owner().call();
        const universityBuilder_UniversityTemplateAddress   = await contractInstance.methods.universityTemplateContainer().call();
        const universityBuilder_universitiesNumber          = await contractInstance.methods.universitiesNumber().call();
        
        let contractAddressValue                = document.getElementById('contractAddressValue');
        let currentVersionValueDiv              = document.getElementById('currentVersionValue');
        let OwnerAccountValueDiv                = document.getElementById('OwnerAccountValue');
        let UniversityTemplateAddressValueDiv   = document.getElementById('UniversityTemplateAddressValue');
        let numberOfUniversitiesValueDiv        = document.getElementById('numberOfUniversitiesValue');
        
        contractAddressValue.innerHTML              = universityBuilder_contractAddress;
        currentVersionValueDiv.innerHTML            = universityBuilder_Version;
        OwnerAccountValueDiv.innerHTML              = universityBuilder_OwnerAccountAddress;
        UniversityTemplateAddressValueDiv.innerHTML = universityBuilder_UniversityTemplateAddress;
        numberOfUniversitiesValueDiv.innerHTML      = universityBuilder_universitiesNumber;
        
        // -----------------------------------------------------------------------------------------------------------------------------
        // Load information for "extractEthersContentDiv"
        // -----------------------------------------------------------------------------------------------------------------------------
        const universityBuilder_ContractBalance         = web3.utils.fromWei(await web3.eth.getBalance(universityBuilder_contractAddress), 'ether');
        const universityBuilder_CurrentAccountBalance   = web3.utils.fromWei(await web3.eth.getBalance(universityBuilder_OwnerAccountAddress), 'ether');

        let contractBalanceValueDiv         = document.getElementById('contractBalanceValue');
        let currentAccountBalanceValueDiv   = document.getElementById('currentAccountBalanceValue');

        contractBalanceValueDiv.innerHTML       = universityBuilder_ContractBalance.toString() + " ETH";
        currentAccountBalanceValueDiv.innerHTML = universityBuilder_CurrentAccountBalance.toString() + " ETH";
    }
};

// On-click method for save new University Template Contract address
saveButton.onclick = async () => {
    console.log(UniversityTemplateContainerAddressInput.value.indexOf("0x") != -1);
    if (metaMaskDiv.innerHTML === "Connect MetaMask"){
        alert("Please, first connect MetaMask.");
    }
    else if (UniversityTemplateContainerAddressInput.value.length === 0){
        alert("Please, set the new contract address.");
    }
    else if (UniversityTemplateContainerAddressInput.value.indexOf("0x") === -1){
        alert("The value must be a valid address");
    }
    else if (UniversityTemplateContainerAddressInput.value === "0x0"){
        alert("Invalid address");
    }
    else {
        // Set new address
        //const newUniversityTemplateAddress = web3.utils.toChecksumAddress(UniversityTemplateContainerAddressInput.value);
        const tx = await contractInstance.methods.setUniversityTemplate(UniversityTemplateContainerAddressInput.value).send({ from: window.ethereum.selectedAddress });
        tx.wait();

        // Update status content
        const universityBuilder_UniversityTemplateAddress   = await contractInstance.methods.universityTemplateContainer().call();
        let UniversityTemplateAddressValueDiv               = document.getElementById('UniversityTemplateAddressValue');
        UniversityTemplateAddressValueDiv.innerHTML         = universityBuilder_UniversityTemplateAddress;
    }
}