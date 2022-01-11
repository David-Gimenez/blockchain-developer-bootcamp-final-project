# blockchain-developer-bootcamp-final-project

This is my final project repository for ConsenSys Academy 2021 Blockchain Developer Bootcamp to obtain the certification of Blockchain Developer.

### Objective

The objective of this project is to create a protocol based on Blockchain technology, which allows graduates of educational institutions to digitally validate the degrees obtained with the support of the issuing educational institution and to allow educational institutions to issue certified degrees backed by Blockchain technology.

The degree could be consulted electronically in the blockchain by third parties, with total confidence from anywhere in the world and with the same validity as the degree in paper.

The project will consist in the creation of a set of Smart Contracts and a web application that allows the validation of academic degrees in a safe, transparent and efficient way.

Using a distributed database system based on Blockchain technology, asymmetric cryptography and hash functions, thus allowing unequivocally identifying the intervening parties, as well as storing information safely to be consulted by third parties.

### Overview

This protocol foresees the participation of three actors:

* Protocol administrators
* University administrators
* Graduates who received academic degrees

In this sense, the landing page of this project has three sections, one for each actor of the protocol.
In production these sites should be three different platforms, but for the sample in this project they have been unified as a single platform.


### Responsibilities

* Protocol administrators

Use the functionalities of the 'UniversityBuilder' contract to create through this new contracts for each University that wishes to use the protocol, using the 'UniversityTemplate' contract as a template

* University administrators

Use the functionalities of the university contract created by the 'UniversityBuilder' contract to represent your University and from there, manage the issuance of new academic degrees by creating a new smart contract for each new degree using the 'UniversityDegreeTemplate' contract as a template.

* Graduates who received academic degrees

Query the information of your University Degree, through the smart contract that represents it, and that was created by the smart contract that represents your University.

### Business processes

#### Create new University contract

1. The **UniversityBuilder** contract queries the **UniversityTemplateContainer** contract to get the bytecode from the **UniversityTemplate** contract to create a new contract using that bytecode
2. The **UniversityBuilder** contract creates a new university contract using the bytecode obtained in 1. and the information provided by the protocol administrator of the new university.

#### Manage University contract

1. The account of the manager of the university will load to the contract the address of the auxiliar contracts of the university contract:
    * UniversityTemplate_Container
    * UniversityTemplate_Governance
    * UniversityTemplate_Logic
2. The account of the manager of the university will load to the contract the accounts of the main authorities of the University who will be the ones who will sign the Degree titles that will be issued.
    * Rector
    * Dean
    * Director

#### Issue a new degree title

1. The account of the university manager will load the information of the new degree title to be issued with the name of the graduate, name of the degree to be issued, date, etc.
2. The university manager account will use the functionalities of the university contract to predict the address of the contract of the new degree to be issued with the use of a Salt number to calculate the address.
3. The university administrator account will generate the hash to be signed by the university authorities, based on the address of the new contract to be issued, the data of the graduate and the data of the degree to be issued. All that information is hashed to be signed together.
4. The university authorities (Rector, Dean, Director) must proceed one by one to digitally sign the hash generated in the previous point with their personal private key. This process is carried out locally on the client machine through MetaMask, so that the private keys are never revealed.
5. Internally in the university's smart contract, each time a new signature is received, it is validated that the sender of the signature is one of the university authorities authorized to sign degrees and the signature is validated using the EIP-712 standard for validation of digital signatures on the blockchain. In this process, the sender's address is obtained from the signature and comparing against the sender address.
6. Once the title has received the 3 signatures required by the 3 university authorities, it is ready to be published. In this publication process, the university contract obtains in a low-level call to the UniveristyDegreeTemplate_Container contract the bytecode of the UniversityDegreeTemplate contract to be used to create a new contract that will represent the new degree issued, which will contain:
    * The information of the issuing university
    * The information of the graduate
    * The information of the issued degree
    * All the digital signatures generated by the university authorities
So that everything can be validated

#### Query an issued degree title

There are two ways to do this

1. Universities can consult the data of all the degrees they have issued

2. Graduates who own a degree title can consult their degree information on the graduate screen


### Repository installation process

1. Install Visual Sutidio Code: https://code.visualstudio.com/

2. Install NodeJS that includes npm: https://nodejs.org/en/download/

3. Install Git that includes bash terminal: https://git-scm.com/download/win

4. **Recommended:** Set Git bush as you default terminal in VSCode
    * Open the command palette using Ctrl + Shift + P.
    * Type - Select Default Profile
    * Select Git Bash from the options

5. Install the following extensions in VSCode
    * Solidity - Juan Blanco
    * Live Server - Ritwick Dey

6. Install MetaMask as an Chrome extension: https://metamask.io/

7. Install truffle with the following command
    * npm install -g truffle

8. Clone the repo with the following git command:
    * git clone https://github.com/David-Gimenez/blockchain-developer-bootcamp-final-project.git

9. Open project folder in VSCode

10. Set up project with the following commands
    * npm install

### To run the tests

1. Execute the following commands in this order
    1. truffle compile
    2. truffle develop
    3. test

### To test the project with live server and truffle develop

- You can see the full demo at: 

1. Add the truffle develop virtual blockchain network to MetaMask. To do this, follow the following steps:
    1. Go to MetaMask and click on network list
    2. Select add network
    3. Add the information to set up Truffle Develop virtual network
        * Network Name:       Truffle Develop (The name is not relevant)
        * RPC URL:            http://127.0.0.1:9545/
        * Chain ID:           1337
        * Symbol:             ETH
        * Block explorer URL: Empty
    4. Confirm the operation
    
2. Execute the following command in the VSCode terminal: 
    **truffle develop**
    This will display a list of 10 accounts and 10 private keys that will be used later

3. Inside the truffel develop console run the following command: 
    **migrate**
    This will deploy the contracts on the virtual blockchain of truffle develop

4. Add private keys to MetaMask to represent each user (Manager, Rector, Dean, Director and Graduate):
    1. Go to MetaMask and click on the account button. It's the colored, circular button in the upper-right corner of the wallet.
    2. Click on 'Import Account'
    3. Copy the first Private Key of the list show by truffle develop and past it in the private key box
    4. Click on 'Import' button
    5. Rename the imported account with a name related to the names of the actors (Manager, Rector, Dean, Director or Graduate)
        To do this, follow the following steps
        * Click on the three dots to the right of the account name
        * Select account details
        * On the right side of the account name, click on the pencil drawing to edit the name
        * Rename the account as for example: 'Manager - Truffle Develop'
        * Confirm the operation
    6. Repeat this operation 4 more times to import other 4 accounts for Rector, Dean, Director and Graduate to be able to complete the test

5. On the 'index.html' file right click and select 'Open with Live Server'. This will open a browser with the landing page for the project
    
6. This page will show 3 options: System, University and Graduate. That options represents 3 differents paths for the 3 differents actores of the protocole.
        **System:** This path is for the administrators of the protocols. Allow to create universities conctracts that represents a University institution.
        **University:** THis path is for a specific university. Allow to load the authorities of the university and issue degree titles by creating contracts
        **Graduate:** THis path is for graduated students that receive the University Degree title. Allow to query the degree title information
    
    * In all paths at the top rigth side of the screen you have the button to connect to MetaMask. 
        - If MetaMask is not installed the button will show '**No wallet detected**'.
        - If MetaMask is installed the button will show '**Connect MetaMask**'.
    
    * In all paths at the top left side of the screen you have the button to go back to home page, the lading page. 

    * In all paths at the left side of the screen you will see the menu with the operation allowed for this path.
    
7. Lets beggin with the administration path to set up the protocole.
    1. Click on System path
    2. The first option in the menu is '**Status**', this option will query the blockchain and show the information from the UniversityBuilder contract once you connect with MetaMask.
    3. To see the information connect MetaMask, click on '**Connect MetaMask**' button. This will query the bockchain and show the information.


Errores posibles
Si al ejecutar una transacción da un error de TX no tiene el nonce correcto
    Se debe resetear el nonce de la accunt en question
    Para eso ir a el icono del usuario --> Configuracion --> Avanzado --> Restablecer cuenta
    Confirmar la operacion


------
Install Ganache: https://trufflesuite.com/ganache/

### About the author

- Author:   **David Gimenez Gutierrez**
- Linkedin: 



    