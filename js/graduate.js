// Load deploy information files
//const universityDegree_contractAddress = "0x3B54F2f539eB628000b933A778353a8B0cc5E160";
let universityDegree_contractAddress;
const universityDegreeTemplate_ABI_JSON        = `[
    {
      "inputs": [
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
          "name": "_degreeInformation",
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
          "internalType": "address",
          "name": "_university_ContractAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_university_Name",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_owner_Address",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_owner_Name",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "_degreeName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_contractAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "_contractSalt",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_remittent",
          "type": "address"
        }
      ],
      "name": "DegreeCreation",
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
      "inputs": [],
      "name": "deanSignature",
      "outputs": [
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
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "degreeInformation",
      "outputs": [
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
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "directorSignature",
      "outputs": [
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
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "hash_EIP712_ContractAddressSalt",
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
      "inputs": [],
      "name": "ownerInformation",
      "outputs": [
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
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "rectorSignature",
      "outputs": [
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
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "signed_EIP712_Hash",
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
      "inputs": [],
      "name": "universityInformation",
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
      "inputs": [],
      "name": "extractEthers",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getChainID",
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
          "name": "_rectorSignature",
          "type": "tuple"
        },
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
          "name": "_deanSignature",
          "type": "tuple"
        },
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
          "name": "_directorSignature",
          "type": "tuple"
        }
      ],
      "name": "_setSignatures",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]`;
const universityDegreeTemplate_ABI = JSON.parse(universityDegreeTemplate_ABI_JSON);

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
    // Set the contract address to interact with
    universityDegree_contractAddress = document.getElementById('contractAddressInput').value;
    if (universityDegree_contractAddress.length === 0){
        alert("Please, set the contract address");
    }
    else if (universityDegree_contractAddress.indexOf("0x") === -1 || universityDegree_contractAddress === "0x0"){
        alert("Invalid contract address.");
    }
    else if (metaMaskDiv.innerHTML === "Connect MetaMask"){

        // Connect to the contract
        web3 = new window.Web3(window.ethereum);
        contractInstance = new web3.eth.Contract(universityDegreeTemplate_ABI, universityDegree_contractAddress);

        await window.ethereum.request({ method: 'eth_requestAccounts'});
        metaMaskDiv.innerHTML = "Connected account: " + window.ethereum.selectedAddress;

        // -----------------------------------------------------------------------------------------------------------------------------
        // Load Degree information
        // -----------------------------------------------------------------------------------------------------------------------------
        // Load information from contract
        const universityDegreeTemplate_Version                  = await contractInstance.methods.VERSION().call();
        const universityDegreeTemplate_degreeInformation        = await contractInstance.methods.degreeInformation().call();
        const universityDegreeTemplate_ownerInformation         = await contractInstance.methods.ownerInformation().call();
        const universityDegreeTemplate_universityInformation    = await contractInstance.methods.universityInformation().call();

        // Get signatures information
        const universityDegreeTemplate_rectorSignature      = await contractInstance.methods.rectorSignature().call();
        const universityDegreeTemplate_deanSignature        = await contractInstance.methods.deanSignature().call();
        const universityDegreeTemplate_directorSignature    = await contractInstance.methods.directorSignature().call();

        // Load html objects
        let graduateNameValue       = document.getElementById('graduateNameValue');
        let degreeNameValue         = document.getElementById('degreeNameValue');
        let universityNameValue     = document.getElementById('universityNameValue');
        let degreeIssueDateValue    = document.getElementById('degreeIssueDateValue');

        let signatureRector         = document.getElementById('rectorSignature');
        let signatureDean           = document.getElementById('deanSignature');
        let signatureDirector       = document.getElementById('directorSignature');

        // Show inforamtion on screen
        graduateNameValue.innerHTML     = universityDegreeTemplate_ownerInformation.name;
        degreeNameValue.innerHTML       = universityDegreeTemplate_degreeInformation.name;
        universityNameValue.innerHTML   = universityDegreeTemplate_universityInformation.name;
        degreeIssueDateValue.innerHTML  = new Date(universityDegreeTemplate_degreeInformation.issueDate * 1000).toLocaleDateString('en-US');

        // Show each signature
        console.log(universityDegreeTemplate_rectorSignature);
        signatureRector.innerHTML   = universityDegreeTemplate_rectorSignature.signature;
        signatureDean.innerHTML     = universityDegreeTemplate_deanSignature.signature;
        signatureDirector.innerHTML = universityDegreeTemplate_directorSignature.signature;        
    }
};
