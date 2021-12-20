// Load deploy information files
const universityTemplate_contractAddress = "0xd07148AEb9B4d7601D0B33481905237EeeA59e76";
const universityTemplate_ABI_JSON        = `[
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
          "name": "_universityInfo",
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
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_degreeIssuedIndex",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_graduatedNumber",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "_degreeName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_graduatedName",
          "type": "string"
        }
      ],
      "name": "NewDegree",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_degreePendingIndex",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_externalID",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_graduatedNumber",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_degreeName",
          "type": "string"
        }
      ],
      "name": "NewPendingDegree",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "_degreePendingIndex",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_signatureAddress",
          "type": "address"
        }
      ],
      "name": "NewPendingDegreeSignature",
      "type": "event"
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
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "enum StructDegree.AuthorityPosition",
          "name": "",
          "type": "uint8"
        }
      ],
      "name": "authorities",
      "outputs": [
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
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "degreeIssued",
      "outputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "legalStatement",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "issueDate",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "emissionDate",
                  "type": "uint256"
                }
              ],
              "internalType": "struct StructDegree.Degree",
              "name": "degree",
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
                  "internalType": "uint256",
                  "name": "graduateNumber",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "accountAddress",
                  "type": "address"
                }
              ],
              "internalType": "struct StructDegree.Owner",
              "name": "owner",
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
              "name": "university",
              "type": "tuple"
            },
            {
              "internalType": "address",
              "name": "contractAddress",
              "type": "address"
            },
            {
              "internalType": "bytes32",
              "name": "hash_EIP712_ContractAddressSalt",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "hash_EIP712_ForSigning",
              "type": "bytes32"
            }
          ],
          "internalType": "struct StructDegree.DegreeInformation",
          "name": "information",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "degreeIssuedIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "degreePending",
      "outputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "legalStatement",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "issueDate",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "emissionDate",
                  "type": "uint256"
                }
              ],
              "internalType": "struct StructDegree.Degree",
              "name": "degree",
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
                  "internalType": "uint256",
                  "name": "graduateNumber",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "accountAddress",
                  "type": "address"
                }
              ],
              "internalType": "struct StructDegree.Owner",
              "name": "owner",
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
              "name": "university",
              "type": "tuple"
            },
            {
              "internalType": "address",
              "name": "contractAddress",
              "type": "address"
            },
            {
              "internalType": "bytes32",
              "name": "hash_EIP712_ContractAddressSalt",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "hash_EIP712_ForSigning",
              "type": "bytes32"
            }
          ],
          "internalType": "struct StructDegree.DegreeInformation",
          "name": "information",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "degreePendingIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "degreePendingNumber",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "governanceContractAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "logicContractAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "universityDegreeTemplate_ContainerAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "universityInfo",
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
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_governanceContractAddress",
          "type": "address"
        }
      ],
      "name": "setGovernanceContractAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_logicContractAddress",
          "type": "address"
        }
      ],
      "name": "setLogicContractAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "enum StructDegree.AuthorityPosition",
          "name": "_authorityPosition",
          "type": "uint8"
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
          "name": "_authorityPerson",
          "type": "tuple"
        }
      ],
      "name": "setAuthorityPerson",
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
              "internalType": "address",
              "name": "accountAddress",
              "type": "address"
            }
          ],
          "internalType": "struct StructUniversity.AuthorityPerson",
          "name": "_authorityPerson",
          "type": "tuple"
        }
      ],
      "name": "transferAuthorityPosition",
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
              "internalType": "address",
              "name": "accountAddress",
              "type": "address"
            }
          ],
          "internalType": "struct StructUniversity.AuthorityPerson",
          "name": "_newUniversityManager",
          "type": "tuple"
        }
      ],
      "name": "changeUniversityManager",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "_degreeTemplateBytecode",
          "type": "bytes"
        },
        {
          "internalType": "uint256",
          "name": "_degreeTemplateVersion",
          "type": "uint256"
        }
      ],
      "name": "setDegreeTemplate",
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
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "legalStatement",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "issueDate",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "emissionDate",
              "type": "uint256"
            }
          ],
          "internalType": "struct StructDegree.Degree",
          "name": "_degree",
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
              "internalType": "uint256",
              "name": "graduateNumber",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "accountAddress",
              "type": "address"
            }
          ],
          "internalType": "struct StructDegree.Owner",
          "name": "_owner",
          "type": "tuple"
        },
        {
          "internalType": "uint256",
          "name": "_externalID",
          "type": "uint256"
        }
      ],
      "name": "addPendingDegree",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_degreeIndex",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_signature",
          "type": "bytes"
        }
      ],
      "name": "addSignatureToPendingDegree",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_degreeIndex",
          "type": "uint256"
        }
      ],
      "name": "publishDegree",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_degreeIndex",
          "type": "uint256"
        }
      ],
      "name": "removePendingDegreeByIndex",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_degreeIndex",
          "type": "uint256"
        }
      ],
      "name": "getEthSignedMessageHash",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_degreeIndex",
          "type": "uint256"
        },
        {
          "internalType": "enum StructDegree.AuthorityPosition",
          "name": "_authorityPosition",
          "type": "uint8"
        }
      ],
      "name": "getPendingDegreeSignature",
      "outputs": [
        {
          "components": [
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
              "name": "signer",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "signatureDate",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "signature",
              "type": "bytes"
            }
          ],
          "internalType": "struct StructDegree.Signature",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]`;
const universityTemplate_ABI = JSON.parse(universityTemplate_ABI_JSON);

// Variables for the contract
let web3;
let contractInstance;

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

        // Connect to the contract
        web3 = new window.Web3(window.ethereum);
        contractInstance = new web3.eth.Contract(universityTemplate_ABI, universityTemplate_contractAddress);

        await window.ethereum.request({ method: 'eth_requestAccounts'});
        metaMaskDiv.innerHTML = "Connected account: " + window.ethereum.selectedAddress;

        // -----------------------------------------------------------------------------------------------------------------------------
        // Load information for "statusContentDiv"
        // -----------------------------------------------------------------------------------------------------------------------------
        // Load information from contract
        const universityTemplate_Version                    = await contractInstance.methods.VERSION().call();
        const universityTemplate_GovernanceContractAddress  = await contractInstance.methods.governanceContractAddress().call();
        const universityTemplate_LogicContractAddress       = await contractInstance.methods.logicContractAddress().call();
        const universityTemplate_universityInfo             = await contractInstance.methods.universityInfo().call();
        const universityTemplate_universityDegreeTemplate   = await contractInstance.methods.universityDegreeTemplate_ContainerAddress().call();
        const universityTemplate_DegreePendingIndex         = await contractInstance.methods.degreePendingIndex().call();
        const universityTemplate_degreePendingNumber        = await contractInstance.methods.degreePendingNumber().call();
        const universityTemplate_degreeIssuedIndex          = await contractInstance.methods.degreeIssuedIndex().call();

        // Get University Authroties information
        const universityTemplate_RectorInformation          = await contractInstance.methods.authorities(1).call(); // 1 It is Rector
        const universityTemplate_DeanInformation            = await contractInstance.methods.authorities(2).call(); // 2 It is Dean
        const universityTemplate_DirectorInformation        = await contractInstance.methods.authorities(3).call(); // 3 It is Director
        const universityTemplate_ManagerInformation         = await contractInstance.methods.authorities(0).call(); // 0 It is Manager
        
        // Load html objects
        let universityContractAddressValue      = document.getElementById('universityContractAddressValue');
        let currentVersionValue                 = document.getElementById('currentVersionValue');
        let universityNameValue                 = document.getElementById('universityNameValue');
        let universityFullNameValue             = document.getElementById('universityFullNameValue');
        let universityCountryValue              = document.getElementById('universityCountryValue');
        let universityStateValue                = document.getElementById('universityStateValue');
        let universityGovernanceContractValue   = document.getElementById('universityGovernanceContractValue');
        let universityLogicContractValue        = document.getElementById('universityLogicContractValue');
        let universityDegreeContractValue       = document.getElementById('universityDegreeContractValue');
        let degreePendingIndex                  = document.getElementById('degreePendingIndexValue');
        let degreePendingNumber                 = document.getElementById('degreePendingNumberValue');
        let degreeIssuedIndex                   = document.getElementById('degreeIssuedIndexValue');

        // Load html object of university authorities
        let universityRectorNameValue           = document.getElementById('universityRectorNameValue');
        let universityRectorAddressValue        = document.getElementById('universityRectorAddressValue');
        let universityDeanNameValue             = document.getElementById('universityDeanNameValue');
        let universityDeanAddressValue          = document.getElementById('universityDeanAddressValue');
        let universityDirectorNameValue         = document.getElementById('universityDirectorNameValue');
        let universityDirectorAddressValue      = document.getElementById('universityDirectorAddressValue');
        let universityManagerNameValue          = document.getElementById('universityManagerNameValue');
        let universityManagerAddressValue       = document.getElementById('universityManagerAddressValue');
        
        // Show inforamtion on screen
        universityContractAddressValue.innerHTML    = universityTemplate_contractAddress;
        currentVersionValue.innerHTML               = universityTemplate_Version;
        universityNameValue.innerHTML               = universityTemplate_universityInfo.name;
        universityFullNameValue.innerHTML           = universityTemplate_universityInfo.fullName;
        universityCountryValue.innerHTML            = universityTemplate_universityInfo.country;
        universityStateValue.innerHTML              = universityTemplate_universityInfo.state;
        universityGovernanceContractValue.innerHTML = universityTemplate_GovernanceContractAddress;
        universityLogicContractValue.innerHTML      = universityTemplate_LogicContractAddress;
        universityDegreeContractValue.innerHTML     = universityTemplate_universityDegreeTemplate;
        degreePendingIndex.innerHTML                = universityTemplate_DegreePendingIndex;
        degreePendingNumber.innerHTML               = universityTemplate_degreePendingNumber;
        degreeIssuedIndex.innerHTML                 = universityTemplate_degreeIssuedIndex;

        // Show university authorities information
        universityRectorNameValue.innerHTML         = universityTemplate_RectorInformation.name;
        universityRectorAddressValue.innerHTML      = universityTemplate_RectorInformation.accountAddress;
        universityDeanNameValue.innerHTML           = universityTemplate_DeanInformation.name;
        universityDeanAddressValue.innerHTML        = universityTemplate_DeanInformation.accountAddress;
        universityDirectorNameValue.innerHTML       = universityTemplate_DirectorInformation.name;
        universityDirectorAddressValue.innerHTML    = universityTemplate_DirectorInformation.accountAddress;
        universityManagerNameValue.innerHTML        = universityTemplate_ManagerInformation.name;
        universityManagerAddressValue.innerHTML     = universityTemplate_ManagerInformation.accountAddress;
    }
};

// On-click method for save new University Template Contract address
setGovernanceContractAddressButton.onclick = async () => {

    if (metaMaskDiv.innerHTML === "Connect MetaMask"){
        alert("Please, first connect MetaMask.");
    }
    else if (governanceContractAddressInput.value.length === 0){
        alert("Please, set the Governance Contract Address.");
    }
    else if (governanceContractAddressInput.value.indexOf("0x") === -1 || governanceContractAddressInput.value === "0x0"){
        alert("Invalid Governance Contract address.");
    }
    else {
        // Set Governance contract address
        const tx = await contractInstance.methods.setGovernanceContractAddress(governanceContractAddressInput.value).send({ from: window.ethereum.selectedAddress });

        // Update status content
        if(tx.transactionHash !== null && tx.transactionHash !== 'undefined'){
            const universityTemplate_GovernanceContractAddress  = await contractInstance.methods.governanceContractAddress().call();
            let universityGovernanceContractValue               = document.getElementById('universityGovernanceContractValue');
            universityGovernanceContractValue.innerHTML         = universityTemplate_GovernanceContractAddress;
        }
    }
}

// On-click method for save new Logic Template Contract address
setLogicContractAddressButton.onclick = async () => {

    if (metaMaskDiv.innerHTML === "Connect MetaMask"){
        alert("Please, first connect MetaMask.");
    }
    else if (logicContractAddressInput.value.length === 0){
        alert("Please, set the Governance Contract Address.");
    }
    else if (logicContractAddressInput.value.indexOf("0x") === -1 || logicContractAddressInput.value === "0x0"){
        alert("Invalid Logic Contract address.");
    }
    else {
        // Set Governance contract address
        const tx = await contractInstance.methods.setLogicContractAddress(logicContractAddressInput.value).send({ from: window.ethereum.selectedAddress });

        // Update status content
        if(tx.transactionHash !== null && tx.transactionHash !== 'undefined'){
            const universityTemplate_LogicContractAddress   = await contractInstance.methods.logicContractAddress().call();
            let universityLogicContractValue                = document.getElementById('universityLogicContractValue');
            universityLogicContractValue.innerHTML          = universityTemplate_LogicContractAddress;
        }
    }
}

// On-click method for save new Degree Template Contract address
setDegreeTemplateContractAddressButton.onclick = async () => {

    if (metaMaskDiv.innerHTML === "Connect MetaMask"){
        alert("Please, first connect MetaMask.");
    }
    else if (degreeContractAddressInput.value.length === 0){
        alert("Please, set the Degree Contract Address.");
    }
    else if (degreeContractAddressInput.value.indexOf("0x") === -1 || degreeContractAddressInput.value === "0x0"){
        alert("Invalid Degree Contract address.");
    }
    else {
        // Set Degree contract address
        const tx = await contractInstance.methods.setDegreeContractAddress(degreeContractAddressInput.value).send({ from: window.ethereum.selectedAddress });

        // Update status content
        if(tx.transactionHash !== null && tx.transactionHash !== 'undefined'){
            const universityTemplate_DegreeContractAddress  = await contractInstance.methods.degreeContractAddress().call();
            let universityDegreeContractValue               = document.getElementById('universityDegreeContractValue');
            universityDegreeContractValue.innerHTML         = universityTemplate_DegreeContractAddress;
        }
    }
}

// On-click method for add new authority person
addAuthorityButton.onclick = async () => {

    if (metaMaskDiv.innerHTML === "Connect MetaMask"){
        alert("Please, first connect MetaMask.");
    }
    else if (authorityPersonNameInput.value.length === 0){
        alert("Please, set the authority person name.");
    }
    else if (authorityPersonAddressInput.value.length === 0){
        alert("Please, set the authority person address.");
    }
    else if (authorityPersonAddressInput.value.indexOf("0x") === -1 || authorityPersonAddressInput.value === "0x0"){
        alert("Invalid authority person address.");
    }
    else {
        // Create authority person object
        const newAuthorityPerson = {
            name:           authorityPersonNameInput.value,
            accountAddress: authorityPersonAddressInput.value
        }

        // Add authority person
        const tx = await contractInstance.methods.setAuthorityPerson(
            authorityPositionSelect.value,
            newAuthorityPerson
            ).send({ from: window.ethereum.selectedAddress });

        // Update status content
        if(tx.transactionHash !== null && tx.transactionHash !== 'undefined'){
            const authorityPerson = await contractInstance.methods.authorities(authorityPositionSelect.value).call();
            let authorityPersonName;
            let authrotyPersonAccountAddress;

            if(authorityPositionSelect.value === 1){    // Set Rector
                authorityPersonName             = document.getElementById('universityRectorNameValue');
                authrotyPersonAccountAddress    = document.getElementById('universityRectorAddressValue');
            }
            else if (authorityPositionSelect.value === 2){  // Set Dean
                authorityPersonName             = document.getElementById('universityDeanNameValue');
                authrotyPersonAccountAddress    = document.getElementById('universityDeanAddressValue');
            }
            else if (authorityPositionSelect.value === 3){  // Set Director
                authorityPersonName             = document.getElementById('universityDirectorNameValue');
                authrotyPersonAccountAddress    = document.getElementById('universityDirectorAddressValue');
            }
            else if (authorityPositionSelect.value === 0){  // Set Manager
                authorityPersonName             = document.getElementById('universityManagerNameValue');
                authrotyPersonAccountAddress    = document.getElementById('universityManagerAddressValue');
            }
            
            authorityPersonName.innerHTML           = authorityPerson.name;
            authrotyPersonAccountAddress.innerHTML  = authorityPerson.accountAddress;
        }
    }
}


// On-click method for add pending degree to preocess
addPendingDegreeButton.onclick = async () => {

    // Graduate information check
    if (metaMaskDiv.innerHTML === "Connect MetaMask"){
        alert("Please, first connect MetaMask.");
    }
    else if (ownerNameInput.value.length === 0){
        alert("Please, set the Degree owner name (Graduate name).");
    }
    else if (ownerNumberInput.value.length === 0){
        alert("Please, set the Degree owner enrollment number (Graduate enrollment number).");
    }
    else if (ownerAddressInput.value.indexOf("0x") === -1 || ownerAddressInput.value === "0x0"){
        alert("Invalid address for the Degree owner.");
    }
    
    // Degree information check
    else if (degreeNameInput.value.length === 0){
        alert("Please, set a Degree name.");
    }
    else if (degreeDescriptionInput.value.length === 0){
        alert("Please, set a Degree description.");
    }
    else if (degreeLigalStatementInput.value.length === 0){
        alert("Please, set a Degree ligal statement.");
    }
    else if (degreeIssueDateInput.value.length === 0){
        alert("Please, set the correct Degree issue date.");
    }

    else {
        // Create Graduate object
        const newGraduate = {
            name:           ownerNameInput.value    // Name of the graduate holder of the University Degree.
            graduateNumber: ownerNumberInput.value  // The identification number of the graduate student at the university.
            accountAddress: ownerAddressInput.value // Exteral owned account address of the holder of the Academic Degree. The graduate recipient of the Degree title.
        }
        // Create Degree object
        const newDegree = {
            name:           degreeNameInput.value,              // University Degree name.
            description:    degreeDescriptionInput.value,       // University Degree description.
            legalStatement: degreeLigalStatementInput.value     // Legal statement for the issuance of the Degree title.
            issueDate:      degreeIssueDateInput.value          // Issue date of the Degree title.
            emissionDate:   degreeIssueDateInput.value          // Ths date will be replaced inside the process
        }

        // Set external_ID that represent the id of a relational database for the Degree
        const external_ID = 1;

        // Add authority person
        const tx = await contractInstance.methods.addPendingDegree(
            newDegree,
            newGraduate,
            external_ID
            ).send({ from: window.ethereum.selectedAddress });

        // Update state content
        if(tx.transactionHash !== null && tx.transactionHash !== 'undefined'){
            const universityTemplate_DegreePendingIndex     = await contractInstance.methods.degreePendingIndex().call();
            const universityTemplate_degreePendingNumber    = await contractInstance.methods.degreePendingNumber().call();
            
            let degreePendingIndex  = document.getElementById('degreePendingIndexValue');
            let degreePendingNumber = document.getElementById('degreePendingNumberValue');

            degreePendingIndex.innerHTML    = universityTemplate_DegreePendingIndex;
            degreePendingNumber.innerHTML   = universityTemplate_degreePendingNumber;

            // Update select i pending degree to sign
            let selectList = document.getElementById("pendingDegreeSelect");

            //Create and append the options
            let option = document.createElement("option");
            option.value = universityTemplate_DegreePendingIndex;
            option.text = ownerNameInput.value + " - " + degreeNameInput.value;
            selectList.appendChild(option);
        }
    }
}

// On-click method for get the pending degree information
getPendingDegreeToSignButton.onclick = async () => {

    if (metaMaskDiv.innerHTML === "Connect MetaMask"){
        alert("Please, first connect MetaMask.");
    }
    else {
        // Check that exists pending degree to sign
        let pendingDegreeSelectList = document.getElementById("pendingDegreeSelect");
        if (pendingDegreeSelectList.length === 0){
            alert("There is no pending Degree to Sign.");
        }
        else {
            // Load html objects
            let pendingDegree_ownerNameValue            = document.getElementById("pendingDegree_ownerNameValue");
            let pendingDegree_ownerNumberValue          = document.getElementById("pendingDegree_ownerNumberValue");
            let pendingDegree_ownerAddressValue         = document.getElementById("pendingDegree_ownerAddressValue");
            let pendingDegree_degreeNameValue           = document.getElementById("pendingDegree_degreeNameValue");
            let pendingDegree_degreeDescriptionValue    = document.getElementById("pendingDegree_degreeDescriptionValue");
            let pendingDegree_degreeLigalStatementValue = document.getElementById("pendingDegree_degreeLigalStatementValue");
            let pendingDegree_degreeIssueDateValue      = document.getElementById("pendingDegree_degreeIssueDateValue");
    
            // Get Pendning Degree information from contract
            const pendingDegreeInformation  = await contractInstance.methods.degreePending(pendingDegreeSelectList.value).call();
    
            // Show Pendning Degree information
            pendingDegree_ownerNameValue.innerHTML              = pendingDegreeInformation.information.owner.name;
            pendingDegree_ownerNumberValue.innerHTML            = pendingDegreeInformation.information.owner.graduateNumber;
            pendingDegree_ownerAddressValue.innerHTML           = pendingDegreeInformation.information.owner.accountAddress;
            pendingDegree_degreeNameValue.innerHTML             = pendingDegreeInformation.information.degree.name;
            pendingDegree_degreeDescriptionValue.innerHTML      = pendingDegreeInformation.information.degree.description;
            pendingDegree_degreeLigalStatementValue.innerHTML   = pendingDegreeInformation.information.degree.legalStatement;
            pendingDegree_degreeIssueDateValue.innerHTML        = pendingDegreeInformation.information.degree.issueDate;
        }
    }
}

// On-click method for get the pending degree information HASH to sign
getHashToSignButton.onclick = async () => {
    if (metaMaskDiv.innerHTML === "Connect MetaMask"){
        alert("Please, first connect MetaMask.");
    }
    else {
        // Check that exists pending degree to sign
        let pendingDegreeSelectList = document.getElementById("pendingDegreeSelect");
        if (pendingDegreeSelectList.length === 0){
            alert("There is no pending Degree to Sign.");
        }
        else {
            // Load html objects
            let pendingDegree_hashToSignValue   = document.getElementById("pendingDegree_hashToSignValue");
            
            // Get Pendning Degree information from contract
            //const pendingDegreeInformationHashToSign = await contractInstance.methods.getEthSignedMessageHash(pendingDegreeSelectList.value).call();
            const pendingDegreeInformation  = await contractInstance.methods.degreePending(pendingDegreeSelectList.value).call();

            // Show Pendning Degree information
            //pendingDegree_hashToSignValue.innerHTML = pendingDegreeInformationHashToSign;
            pendingDegree_hashToSignValue.innerHTML = pendingDegreeInformation.information.hash_EIP712_ForSigning;
        }
    }
}

// On-click method for sign the degree information HASH of a pendning Degree
signButton.onclick = async () => {
    if (metaMaskDiv.innerHTML === "Connect MetaMask"){
        alert("Please, first connect MetaMask.");
    }
    else {
        // Check that exists pending degree to sign
        let pendingDegreeSelectList = document.getElementById("pendingDegreeSelect");
        if (pendingDegreeSelectList.length === 0){
            alert("There is no pending Degree to Sign.");
        }
        else {
            // Get Pendning Degree information from contract
            const pendingDegreeInformation  = await contractInstance.methods.degreePending(pendingDegreeSelectList.value).call();

            // Sign the hash of the pending degree information
            const authritySignature = await web3.eth.sign(pendingDegreeInformation.information.hash_EIP712_ForSigning, window.ethereum.selectedAddress);

            // Add signature tu pending Degree
            const tx = await contractInstance.methods.addSignatureToPendingDegree(
                pendingDegreeSelectList.value,
                authritySignature
                ).send({ from: window.ethereum.selectedAddress });
            
            if(tx.transactionHash !== null && tx.transactionHash !== 'undefined'){
                alert("Transaction to add signature sent successfully. Please check the transaction confirmation in MetaMask.");
            }
        }
    }
}

//----------------------------------------------
//-- PUBLISH DEGREE
//----------------------------------------------
// On-click method for get the pending degree information
getPendingDegreeToPublishButton.onclick = async () => {

    if (metaMaskDiv.innerHTML === "Connect MetaMask"){
        alert("Please, first connect MetaMask.");
    }
    else {
        // Check that exists pending degree to sign
        let publishDegreeSelectList = document.getElementById("publishDegreeSelect");
        if (publishDegreeSelectList.length === 0){
            alert("There is no pending Degree to publish.");
        }
        else {
            // Load html objects
            let publishDegree_ownerNameValue            = document.getElementById("publishDegree_ownerNameValue");
            let publishDegree_ownerNumberValue          = document.getElementById("publishDegree_ownerNumberValue");
            let publishDegree_ownerAddressValue         = document.getElementById("publishDegree_ownerAddressValue");
            let publishDegree_degreeNameValue           = document.getElementById("publishDegree_degreeNameValue");
            let publishDegree_degreeDescriptionValue    = document.getElementById("publishDegree_degreeDescriptionValue");
            let publishDegree_degreeLigalStatementValue = document.getElementById("publishDegree_degreeLigalStatementValue");
            let publishDegree_degreeIssueDateValue      = document.getElementById("publishDegree_degreeIssueDateValue");
    
            // Get Pendning Degree information from contract
            const pendingDegreeInformation  = await contractInstance.methods.degreePending(publishDegreeSelectList.value).call();
    
            // Show Pendning Degree information
            publishDegree_ownerNameValue.innerHTML              = publishDegreeInformation.information.owner.name;
            publishDegree_ownerNumberValue.innerHTML            = publishDegreeInformation.information.owner.graduateNumber;
            publishDegree_ownerAddressValue.innerHTML           = publishDegreeInformation.information.owner.accountAddress;
            publishDegree_degreeNameValue.innerHTML             = publishDegreeInformation.information.degree.name;
            publishDegree_degreeDescriptionValue.innerHTML      = publishDegreeInformation.information.degree.description;
            publishDegree_degreeLigalStatementValue.innerHTML   = publishDegreeInformation.information.degree.legalStatement;
            publishDegree_degreeIssueDateValue.innerHTML        = publishDegreeInformation.information.degree.issueDate;
        }
    }
}

// On-click method for publish a Degree
publishButton.onclick = async () => {
    if (metaMaskDiv.innerHTML === "Connect MetaMask"){
        alert("Please, first connect MetaMask.");
    }
    else {
        // Check that exists pending degree to sign
        let pendingDegreeSelectList = document.getElementById("pendingDegreeSelect");
        if (pendingDegreeSelectList.length === 0){
            alert("There is no Degree to publish.");
        }
        else {
            // Publish Degree
            const tx = await contractInstance.methods.publishDegree(pendingDegreeSelectList.value).send({ from: window.ethereum.selectedAddress });
            
            if(tx.transactionHash !== null && tx.transactionHash !== 'undefined'){
                alert("Transaction to Publish Degree sent successfully. Please check the transaction confirmation in MetaMask.");

                // Get new Published Degree Contract Address
                const publishDegreeIndex                    = await contractInstance.methods.degreeIssuedIndex().call();
                const publishDegreeObject                   = await contractInstance.methods.degreeIssued(publishDegreeIndex).call();
                let publishedDegree_ContractAddress         = document.getElementById("publishedDegree_ContractAddress");
                publishedDegree_ContractAddress.innerHTML   = publishDegreeObject.information.contractAddress;
            }
        }
    }
}

//----------------------------------------------
//-- QUERY PUBLISHED DEGREE
//----------------------------------------------
// On-click method for get a issued degree information
getPublishedDegreeButton.onclick = async () => {

    if (metaMaskDiv.innerHTML === "Connect MetaMask"){
        alert("Please, first connect MetaMask.");
    }
    else {
        // Check that exists pending degree to sign
        let publishedDegreeSelectList = document.getElementById("publishedDegreeSelect");
        if (publishedDegreeSelectList.length === 0){
            alert("There is no Published Degree.");
        }
        else {
            // Load html objects
            let publishedDegree_ownerNameValue            = document.getElementById("publishedDegree_ownerNameValue");
            let publishedDegree_ownerNumberValue          = document.getElementById("publishedDegree_ownerNumberValue");
            let publishedDegree_ownerAddressValue         = document.getElementById("publishedDegree_ownerAddressValue");
            let publishedDegree_degreeNameValue           = document.getElementById("publishedDegree_degreeNameValue");
            let publishedDegree_degreeDescriptionValue    = document.getElementById("publishedDegree_degreeDescriptionValue");
            let publishedDegree_degreeLigalStatementValue = document.getElementById("publishedDegree_degreeLigalStatementValue");
            let publishedDegree_degreeIssueDateValue      = document.getElementById("publishedDegree_degreeIssueDateValue");
            let publishedDegree_ContractAddressValue      = document.getElementById("publishedDegree_ContractAddressValue");
    
            // Get Pendning Degree information from contract
            const PublishedDegreeInformation  = await contractInstance.methods.degreePending(publishedDegreeSelectList.value).call();
    
            // Show Pendning Degree information
            publishedDegree_ownerNameValue.innerHTML              = publishedDegreeInformation.information.owner.name;
            publishedDegree_ownerNumberValue.innerHTML            = publishedDegreeInformation.information.owner.graduateNumber;
            publishedDegree_ownerAddressValue.innerHTML           = publishedDegreeInformation.information.owner.accountAddress;
            publishedDegree_degreeNameValue.innerHTML             = publishedDegreeInformation.information.degree.name;
            publishedDegree_degreeDescriptionValue.innerHTML      = publishedDegreeInformation.information.degree.description;
            publishedDegree_degreeLigalStatementValue.innerHTML   = publishedDegreeInformation.information.degree.legalStatement;
            publishedDegree_degreeIssueDateValue.innerHTML        = publishedDegreeInformation.information.degree.issueDate;
            publishedDegree_ContractAddressValue.innerHTML        = publishedDegreeInformation.information.contractAddress;
        }
    }
}