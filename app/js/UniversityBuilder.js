const contractAddress = '0xeaeb37A509a00a2bc30426e7ED714Fcf414A3A3e';
const contractABI = [
	{
		"inputs": [],
		"name": "myNumber",
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
		"name": "owner",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_newValue",
				"type": "uint256"
			}
		],
		"name": "setMyNumber",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_newValue",
				"type": "uint256"
			}
		],
		"name": "setNumber",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

//console.log("Hello world");

window.addEventListener('load', function(){
    if(typeof window.ethereum !== 'undefined'){
        console.log('MetaMask detected');
        let mmDetected = document.getElementById('mm-detected');
        mmDetected.innerHTML = "MetaMask has been detected";
        alert('Metamask available');
    }
    else {
        console.log('Not wallet available');
        alert('Not wallet available');
    }
});

const mmEnable = document.getElementById('mm-connect');
mmEnable.onclick = async () => {
    await ethereum.request({ method: 'eth_requestAccounts'});

    const mmCurrentAccount = document.getElementById('mm-current-account');
    mmCurrentAccount.innerHTML = "Account: " + ethereum.selectedAddress;
};

const ssSubmit = document.getElementById('mm-input-button');

ssSubmit.onclick = async () => {
    const ssSubmitBox = document.getElementById('ss-input-box').value;

    console.log(ssSubmitBox);
    
    const web3 = new Web3(window.ethereum);
    
    const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
    //contractInstance.setProvider(window.ethereum);
    
    await  contractInstance.methods.setMyNumber(ssSubmitBox).send({ from: ethereum.selectedAddress });
};