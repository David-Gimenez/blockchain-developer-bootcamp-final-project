// Load deploy information files
//const universityBuilder_contractAddress = "0x6dec23f85302FF8B35ef66C8a35c78cd344B489C";
let universityBuilder_contractAddress;
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

// Variables for the contract
let web3;
let contractInstance;

// Variables for extract ethers
let universityBuilder_ContractBalance;
let universityBuilder_CurrentAccountBalance;

// Load html objects
// university builder object
let metaMaskDiv                             = document.getElementById('metaMaskDiv');
let saveButton                              = document.getElementById('saveButton');
let UniversityTemplateContainerAddressInput = document.getElementById('UniversityTemplateContainerAddressInput');

// Create univerity object
let nameInput                               = document.getElementById('nameInput');
let fullNameInput                           = document.getElementById('fullNameInput');
let countryInput                            = document.getElementById('countryInput');
let stateInput                              = document.getElementById('stateInput');
let managerNameInput                        = document.getElementById('managerNameInput');
let managerAddressInput                     = document.getElementById('managerAddressInput');
let newContractInformationValue             = document.getElementById('newContractInformationValue');

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
    // Set the contract address to interact with
    universityBuilder_contractAddress = document.getElementById('contractAddressInput').value;
    if (universityBuilder_contractAddress.length === 0){
        alert("Please, set the contract address");
    }
    else if (universityBuilder_contractAddress.indexOf("0x") === -1 || universityBuilder_contractAddress === "0x0"){
        alert("Invalid contract address.");
    }
    else if (metaMaskDiv.innerHTML === "No wallet connected") {
        alert("You have to install MetaMask to interact with this application. Please go to https://metamask.io/");
    }
    else {
    
        // Connect to the contract
        web3 = new window.Web3(window.ethereum);
        contractInstance = new web3.eth.Contract(universityBuilder_ABI, universityBuilder_contractAddress);

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
        universityBuilder_ContractBalance         = web3.utils.fromWei(await web3.eth.getBalance(universityBuilder_contractAddress), 'ether');
        universityBuilder_CurrentAccountBalance   = web3.utils.fromWei(await web3.eth.getBalance(universityBuilder_OwnerAccountAddress), 'ether');

        let contractBalanceValueDiv         = document.getElementById('contractBalanceValue');
        let currentAccountBalanceValueDiv   = document.getElementById('currentAccountBalanceValue');

        contractBalanceValueDiv.innerHTML       = universityBuilder_ContractBalance.toString() + " ETH";
        currentAccountBalanceValueDiv.innerHTML = universityBuilder_CurrentAccountBalance.toString() + " ETH";
    }
};

// On-click method for save new University Template Contract address
saveButton.onclick = async () => {

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
        const tx = await contractInstance.methods.setUniversityTemplate(UniversityTemplateContainerAddressInput.value).send({ from: window.ethereum.selectedAddress });
        
        /*console.log(tx);
        let tx_result = await web3.eth.getTransactionReceipt(tx.transactionHash);
        console.log(tx_result);
        let number = 0;
        while (tx_result === null || tx_result === 'undefined'){
            tx_result = await web3.eth.getTransactionReceipt(tx.transactionHash);
            number = number + 1;
        }
        console.log(number);
        if(tx_result.confirmations < 0 || tx_result === undefined){
            alert("Please check your transaction: " + tx.transactionHash.toString() + "\n The transaction is undefined or has 0 confirmations.");
        }*/

        // Update status content
        if(tx.transactionHash !== null && tx.transactionHash !== 'undefined'){
            const universityBuilder_UniversityTemplateAddress   = await contractInstance.methods.universityTemplateContainer().call();
            let UniversityTemplateAddressValueDiv               = document.getElementById('UniversityTemplateAddressValue');
            UniversityTemplateAddressValueDiv.innerHTML         = universityBuilder_UniversityTemplateAddress;
        }
    }
}

// On-click method for crear universities
createButton.onclick = async () => {
    if (metaMaskDiv.innerHTML === "Connect MetaMask"){
        alert("Please, first connect MetaMask.");
    }
    else if (nameInput.value.length         === 0 ||
            fullNameInput.value.length      === 0 ||
            countryInput.value.length       === 0 ||
            stateInput.value.length         === 0 ||
            managerNameInput.value.length   === 0 ||
            managerAddressInput.value.length=== 0){
        alert("All fields are required");
    }
    else if (managerAddressInput.value.indexOf("0x") === -1 || managerAddressInput.value === "0x0"){
        alert("The value in 'Manager address' must be a valid address");
    }
    else {
        // Create UniversityCollege object
        const universityCollegeObject = {
            name:               nameInput.value,
            fullName:           fullNameInput.value,
            country:            countryInput.value,
            state:              stateInput.value,
            contractAddress:    universityBuilder_contractAddress   // This address will be replaced for the address of the new contract inside de process
        }

        // Create AuthorityPerson object
        const universityManager = {
            name:           managerNameInput.value,
            accountAddress: managerAddressInput.value
        }

        // Create university
        const tx = await contractInstance.methods
            .createUniversity(
                universityCollegeObject,
                universityManager
            ).send({ 
                from:   window.ethereum.selectedAddress
            }).then(async () => {
                
                // Update university builder contract status
                const universityBuilder_universitiesNumber  = await contractInstance.methods.universitiesNumber().call(); 
                let numberOfUniversitiesValueDiv            = document.getElementById('numberOfUniversitiesValue');
                numberOfUniversitiesValueDiv.innerHTML      = universityBuilder_universitiesNumber;

                // Show address of the new university contract
                const newUniversityContractAddress = await contractInstance.methods.universities(universityBuilder_universitiesNumber).call();
                
                const newUniversityContractObject = {
                    contractAddress: newUniversityContractAddress.contractAddress,
                    name: newUniversityContractAddress.name,
                    fullName: newUniversityContractAddress.fullName,
                    country: newUniversityContractAddress.country,
                    state: newUniversityContractAddress.state
                }
                
                newContractInformationValue.value = JSON.stringify(newUniversityContractObject, null, 2);

                // Add university to list of universities created
                let selectList = document.getElementById("createdUniversitiesSelect");

                //Create and append the options
                let option = document.createElement("option");
                option.value = universityBuilder_universitiesNumber;
                option.text = newUniversityContractAddress.name;
                selectList.appendChild(option);
            });
        
        // Show results operation
        //if(tx.transactionHash !== null && tx.transactionHash !== 'undefined'){
        //}
    }
}

// On-Click method for query University contract information
queryButton.onclick = async () => {
    // Get createdUniversitiesSelect object
    let selectList = document.getElementById("createdUniversitiesSelect");
    
    if (metaMaskDiv.innerHTML === "Connect MetaMask"){
        alert("Please, first connect MetaMask.");
    }
    else if (selectList.length === 0){
        alert("No University contract has been created yet");

        //Create and append the options
        for (let i = 1; i < 5; i++) {
            let option = document.createElement("option");
            option.value = i;
            option.text = i.toString();
            selectList.appendChild(option);
        }
    }
    else {

    }
    
    // Show information of the university contract selected
    const universityContract = await contractInstance.methods.universities(selectList.value).call();

    // Load html elements
    let universityContractAddressValue  = document.getElementById("universityContractAddressValue");
    let universityNameValue             = document.getElementById("universityNameValue");
    let universityFullNameValue         = document.getElementById("universityFullNameValue");
    let universityCountryValue          = document.getElementById("universityCountryValue");
    let universityStateValue            = document.getElementById("universityStateValue");
            
    // Set University contract information
    universityContractAddressValue.innerHTML    = universityContract.contractAddress;
    universityNameValue.innerHTML               = universityContract.name;
    universityFullNameValue.innerHTML           = universityContract.fullName;
    universityCountryValue.innerHTML            = universityContract.country;
    universityStateValue.innerHTML              = universityContract.state;
}

// On-click method for extract ethers
extractButton.onclick = async () => {
    if (metaMaskDiv.innerHTML === "Connect MetaMask"){
        alert("Please, first connect MetaMask.");
    }
    else {
        // Get the contract balance
        universityBuilder_ContractBalance = parseInt(web3.utils.fromWei(await web3.eth.getBalance(universityBuilder_contractAddress), 'ether'));

        if (universityBuilder_ContractBalance === 0){
            alert("There is no balance to withdraw.");
        }
        else {
            // Withdraw balance
            const tx = await contractInstance.methods.extractEthers().send({ from: window.ethereum.selectedAddress });

            // -----------------------------------------------------------------------------------------------------------------------------
            // Load result balance
            // -----------------------------------------------------------------------------------------------------------------------------
            universityBuilder_ContractBalance         = web3.utils.fromWei(await web3.eth.getBalance(universityBuilder_contractAddress), 'ether');
            universityBuilder_CurrentAccountBalance   = web3.utils.fromWei(await web3.eth.getBalance(universityBuilder_OwnerAccountAddress), 'ether');

            let contractBalanceValueDiv         = document.getElementById('contractBalanceValue');
            let currentAccountBalanceValueDiv   = document.getElementById('currentAccountBalanceValue');

            contractBalanceValueDiv.innerHTML       = universityBuilder_ContractBalance.toString() + " ETH";
            currentAccountBalanceValueDiv.innerHTML = universityBuilder_CurrentAccountBalance.toString() + " ETH";
        }
    }
}
