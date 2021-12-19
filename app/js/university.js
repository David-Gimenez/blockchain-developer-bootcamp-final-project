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
        const universityTemplate_ManagerInformation         = await contractInstance.methods.authorities(0).call(); // 1 It is manager
        const universityTemplate_DegreePendingIndex         = await contractInstance.methods.degreePendingIndex().call();
        const universityTemplate_degreePendingNumber        = await contractInstance.methods.degreePendingNumber().call();
        
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
        let universityManagerNameValue          = document.getElementById('universityManagerNameValue');
        let universityManagerAddressValue       = document.getElementById('universityManagerAddressValue');
        let numberDegreesissuedValue            = document.getElementById('numberDegreesissuedValue');
        let numberdegreesrequestedValue         = document.getElementById('numberdegreesrequestedValue');
        
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
        universityManagerNameValue.innerHTML        = universityTemplate_ManagerInformation.name;
        universityManagerAddressValue.innerHTML     = universityTemplate_ManagerInformation.accountAddress;
        numberDegreesissuedValue.innerHTML          = universityTemplate_DegreePendingIndex;
        numberdegreesrequestedValue.innerHTML       = universityTemplate_degreePendingNumber;
    }
};