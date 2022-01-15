# blockchain-developer-bootcamp-final-project
##### Author: David Gimenez Gutierrez

This is my final project repository for ConsenSys Academy 2021 Blockchain Developer Bootcamp to obtain the certification of Blockchain Developer.

### My Ethereum Mainet Account Address

**0x6fa544cA8e47a5F729562379d49a8c9d96Ab26De**

### Objective

The objective of this project is to create a protocol based on Blockchain technology, which allows graduates of educational institutions to digitally validate the degrees obtained with the support of the issuing educational institution and to allow educational institutions to issue certified degrees backed by Blockchain technology.

The degree could be consulted electronically in the blockchain by third parties, with total confidence from anywhere in the world and with the same validity as the degree in paper.

The project will consist in the creation of a set of Smart Contracts and a web application that allows the validation of academic degrees in a safe, transparent and efficient way.

Using a distributed database system based on Blockchain technology, asymmetric cryptography and hash functions, thus allowing unequivocally identifying the intervening parties, as well as storing information safely to be consulted by third parties.

### Main project information

**Public FrontEnd Web Site:**    
[https://david-gimenez.github.io/blockchain-developer-bootcamp-final-project/index.html](https://david-gimenez.github.io/blockchain-developer-bootcamp-final-project/index.html)

**Public Ethereum Contract Address in Rinkeby:**
    **universityBuilder_contractAddress:**              0x61a6742C9Ce494Ea30EF3fb8d57ac84d35EEA14B
    **universityTemplateContainer_contractAddress:**    0x8a00E40aa1b141684a9CBc529f26096A28dC3AE9
    **universityTemplateGovernance_Contract:**          0xCD1560FB9b34861f256D5a4C426270b7513FBF74
    **UniversityTemplate_Logic_Contract:**              0x8a0d1cFAa78BB7552ed79d14A9B8B38BeE71385F
    **universityTemplateDegreeContainer_contract:**     0x88B5832bc31ED30C924ed75b366d51B5a1E87355

### Tutorials videos

**Configure the project and run the tests**     [https://www.youtube.com/watch?v=ZDnCxVYB58w&list=PLeY7oRtekzoD1wTxxZlksKJgRxmq7Ppv-](https://www.youtube.com/watch?v=ZDnCxVYB58w&list=PLeY7oRtekzoD1wTxxZlksKJgRxmq7Ppv-)
**Coplate demo of the protocol in FrontEnd**    [https://youtu.be/If5yabPZhWQ](https://youtu.be/If5yabPZhWQ)


### Repository installation process

1. Install Visual Sutidio Code: [https://code.visualstudio.com/](https://code.visualstudio.com/)

2. Install NodeJS that includes npm: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

3. Install Git that includes bash terminal: [https://git-scm.com/download/win](https://git-scm.com/download/win)

4. **Recommended:** Set Git bush as you default terminal in VSCode
    * Open the command palette using Ctrl + Shift + P.
    * Type - Select Default Profile
    * Select Git Bash from the options

5. Install the following extensions in VSCode
    * Solidity - Juan Blanco
    * Live Server - Ritwick Dey

6. Install MetaMask as an Chrome extension: [https://metamask.io/](https://metamask.io/)

7. Install truffle with the following command
    * npm install -g truffle

8. Clone the repo with the following git command:
    * git clone https://github.com/David-Gimenez/blockchain-developer-bootcamp-final-project.git

9. Open project folder in VSCode

10. Set up project with the following commands
    * npm install

11. Fill in the .env file with your wallet account address for the environment you are going to use
    The .env file was included into the repository only with an empty variable structure and the seed phrase used in the Ganache client locally for testing purpose.
    **IMPORTANT: Private keys and mnemonic provided in this .env file are NOT safe. You should NOT rely on them to secure blockchain assets or use it in a production environment**

    Environments
    * Ethereum Rinkeby network
    * Ganache network

    For example for Ganache the variables are:
    * GANACHE_MANAGER_ADDRESS:  The address used in the deploy and manager role in the protocole
    * GANACHE_MANAGER_PK:       The private key used in the deploy and manager role in the protocole
    * GANACHE_RECTOR_PK:        The private key used as the Rector role in the protocole
    * GANACHE_DEAN_PK:          The private key used as the Dean role in the protocole
    * GANACHE_DIRECTOR_PK:      The private key used as the Director role in the protocole
    * GANACHE_GRADUATE_PK:      The private key used as the Graduated role in the protocole

12. **Optionally** Install Ganache: [https://trufflesuite.com/ganache/](https://trufflesuite.com/ganache/)

### To run the tests

1. Execute the following commands in this order
    1. truffle compile
    2. truffle develop
    3. test

### To test the project with live server and truffle develop

- You can see the full demo at: [https://youtu.be/If5yabPZhWQ](https://youtu.be/If5yabPZhWQ)

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
    1. Click on System path. A screen will be displayed with a menu on the left side and an inputbox in the header where you must enter the address of the **UniversityBuilder** contract instance with which you want to connect.
    2. The first option in the menu is '**Status**', this option will query the blockchain and show the information from the UniversityBuilder contract once you connect with MetaMask.
    3. To see the information connect MetaMask, click on '**Connect MetaMask**' button. This will query the bockchain and show the information.
    4. **Set University Template Contract** allow you to set the address of the template contract for the creation of futurs universitis contracts
    5. **Create University Contract** allow you to create a new instance of **UniversityTemplate** contract with the information set in the inputbox on screen.
    This operation will return with the information of the contract that was created, included the address of the new contract.
    6. **Query University Contract** allows you to retrieve the information of the contract already created. The combo box shown on the screen has four hard coded values ​​for easy access in the demo, but in the production environment this will be loaded from a relational database.
    7. **Extract Ethers from contract** displays the amount of ethers in the **UniversityBuilder** contract and the amount of ethers in the user connected account via MetaMask, allowing you to extract the ethers of the contract in class if the amount is greater than zero.

8. University path, for university administrator and authorities
    1. A screen will be displayed with a menu on the left side and an inputbox in the header where you must enter the address of the **UniversityTemplate** contract instance with which you want to connect. This address was obtained at the time of the creation of the contract in step 5 of the previous route.
    2. **Status** All the state variables of the university are displayed here, as well as the number of degree titles ordered, pending and issued.
    3. **Administration** Aalows you to setup the addressess of the contracts with the governance logic, business logic and Degree template contract. All three contracts were deployed at the time of migration and their addresses are stored in the project's "deployedInformation" file.
    Once loaded these addresses will be visible on the university *Status** screen.
    4. **University Authorities** shows the name and external owned account of each of the University authorities: Rector, Dean, Director and Manager. 
    This information is obtained from the blockchain by pressing the button to connect with MetaMask in the upper right corner of the screen.
    5. **Add Authority Person** allows to add name and external owned account for each position of authority of the university: Rector, Dean, Director and Manager.
    The Manager position was loaded at the time of contract creation, but this can be transferred by smart contract operations.
    6. **Add Degree to Process** allows to create an object in the **UniversityTemplate** contract that represents the Degree title that has to be issued, with the information of the graduate and the Degree title that was entered on the screen.
    This operation can only be executed if the account connected to MetaMask is the University Manager account.
    7. **Predict Degree Address** before issuing the degrees, the university must ensure that the degree is signed by its authorities (Rector, Dean, Director). For that, it is necessary to generate a hash that contains all the information of the degree that will be issued, including the future address of the contract that will contain it.
    For that, the three steps on this screen must be executed in descending order:
        1. **Add Contract Address Salt to Pending Degree** this generates the Salt that will be used to hash the information. It is an internal process that involves all the information entered of the university and the student to graduate.
        2. **Predict Degree Contract Address** using the salt calculated in the previous step, this operation calculates the address of the contract that will represent the Degree that will be issued.
        This step is important so that the authorities can sign a hash of the information that already contains the address of the contract where the Degree will be represented.
        3. **Generate EIP712 Hash for Signing** In this step, the hash of the information is generated, which will be signed by the university authorities. The information represented by this hash includes:
            **Information on the university that issues the Degree**
            **Information of the student receiving the Degree**
            **Information of the contract that will represent the Degree in the blockchain as its future address**
        The format of this hash follows the standard established in EIP-712 to encode and hash the information contained in struct objects. Nothing easy by the way :(
        Each operation, when confirmed by the blockchain, will show a message next to the operation carried out in red.
    8. **Sign Pending Degree** This operation allows the university authorities (Rector, Dean and Director) to digitally sign the hash generated in the previous point through MetaMask.
    This operation can only be executed by the mentioned authorities.
    On the screen you can consult the information of the Degree to be signed and the hash to be signed to contrast it with the one shown by MetaMask.
    9. **Publish Degree** This screen is the final step in the university's process for issuing university degrees.
    First, it allows you to consult the information of a title pending to be issued by retrieving the information from the object in the blockchain.
    Keep in mind that the values ​​in the cobobox are harcoded for the demo.
    The **Publish Degree** button will create a new contract at the previously calculated address with the information from the selected Degree object.
    Once the operation is confirmed in the blockchain, a floating alert will be displayed.
    10. **Query Published Degree** It allows to consult the information of the Degree Titles issued by the university, retrieving the information from the object loaded in the contract **UniversistyTemplate** of the university in question, not from the contract created in the previous point. But the information does include the address of the created contract.
    The information displayed in the combobox was harcoded for this demo.

9. Graduated path
    This screen does not have operation menus.
    In the header of the page in the center there is an inputbox to load the address of the contract **UniversityDegreeTemplate** created in the path of the university. It can be obtained from point 10 of the path of the University.

    By clicking on the **Connect MetaMask** button the Degree title information will be retrieved from the contract created for that Degree title and displayed on the screen in each corresponding space:
        **Graduate Name**
        **Degree Name**
        **University Name**
        **Date**
        **Each digital signature will be displayed too**
    The digital signatures are displayed becasue together with the calculated hash for the can be checked and validated.

    **NOTE:** The Degree title information retrieval is not restricted to just the graduate, to facilitate demonstration. But the extraction of ethers from the contract is restricted.
    As a future improvement to the protocol, a way to enable access to certain people for a certain time.

### overview of the project

#### Project Folder Structure

##### app

This folder hold the FrontEnd aplication code.
Include:
* HTML pages
    * **index.html**        This is the sample landing page for the degree certification protocol. Show the three possible paths, one for each role in the protocol
    * **system.html**       This is the sample page that emulate the backoffice site for each degree certification protocol administrator. From here new university contracts instance can be created and set up. Communicates with the 'UniversityBuilder' contract
    * **university.html**   This is the sample page that emulate the backoffice site for each university that use the degree certification protocol. Communicates with the University contracts and allow to set up university authorities and issue new Degree contracts.
    * **graduate.html**     This is the sample page that emulate the site for each graduate that receive an University Degree Title throw the protocol. It communicates with the University Degrees contracts. Allows to consult the University Degree information of the account connected through MetaMask that represents a graduate.
* Folders
    * **css**
    * **img**
    * **js**

##### contracts

This folder containsthe the contracts of the protocole divided in sub folders.
In this document you will also find the description of the architecture of the project where the responsibility of each contract is explained

* **libraries folder:**     Include the two libraries created for the project that define structures and enums
* **university folder:**    Inlcude the "UniversityBuilder.sol" file.
* **template folder:**      Include the templated contracts for University and Degree and all contracts related to the business process carried out for the University role
* **forTest:**              Include only one contract that is only used in test cases and is only deployed in the migration process over testnets ('Develop', 'Ganache') 

##### deployInformation

This folder contains the 'deployInformation.json' file in which after each migration process, the address of the deployed contracts are automatically stored separated by environment along with the deployed date and deployer address. That way, give a easy way to access the address of the deployed contracts.
The structure of the file it is as follow, for example for the 'development' environment, which is the truffle develop virtual blockchain environment:

* deployDate
* deployer_accountAddress
* universityBuilder_contractAddress
* universityTemplateContainer_contractAddress
* universityTemplateGovernance_Contract
* UniversityTemplate_Logic_Contract
* universityTemplateDegreeContainer_contract

##### migrations

This folder contains the migrations scripts for the project.

##### test

This folder contains the test scripts for the functionalities in the Smart Contracts.
In total there are 22 different tests, but each test can include more than one validation on the same use case.

### Overview of the protocol

This protocol foresees the participation of three actors:

* Protocol administrators
* University administrators
* Graduates who received academic degrees

In this sense, the landing page of this project has three sections, one for each actor of the protocol.
In production these sites should be three different platforms, but for the sample in this project they have been unified as a single platform.


### Roles and Responsibilities

* Protocol administrators

Use the functionalities of the 'UniversityBuilder' contract to create through this new contracts for each University that wishes to use the protocol, using the 'UniversityTemplate' contract as a template

* University administrators

Use the functionalities of the university contract created by the 'UniversityBuilder' contract to represent your University and from there, manage the issuance of new academic degrees by creating a new smart contract for each new degree using the 'UniversityDegreeTemplate' contract as a template.

* Graduates who received academic degrees

Query the information of your University Degree, through the smart contract that represents it, and that was created by the smart contract that represents your University.

### Smart Contracts Architecture

Please do to the file: ![university_degree_protocol_diagram](docs/university_degree_protocol_diagram.jpg)

### Design Patterns Decisions

Please go to the file: ![design_pattern_decisions](docs/design_pattern_decisions.md)

### Avoiding Common Attacks

Please go to the file: ![avoiding_common_attacks](docs/avoiding_common_attacks.md)

#### Smart Contracts responsibilities

**StructUniversity**

This library contains the structures that represent the objects that universities need to store their information within the protocol.

**StructDegree**

This library contains the structures that represent the Degree objects that universities need to store their degree information within the protocol.

**UniversityBuilder**

This smart contract contains the main logic for protocol administrators to subscribe new universities to the protocol by creating new smart contracts representing the new universities.
This contract calls the contract **UniversityTemplate_Container** requesting the bytecode of the contract **UniversityTemplate** to create a new smart contract with an assembly command based on that code.

**UniversityTemplate_Container**

This smart contract contains the logic for extract the bytecode from the **UniversityTemplate** contract and return it.
operations over this smart contract are only allowed to the **UniversityBuilder** contract stored internally.

The reason for not obtaining the **UniversityTemplate** contract bytecode directly from the **UniversityBuilder** contract, is that the protocol was intended to be upgradeable, so the template codes to create new universities or new university degrees are contained in contracts that are deployed in the blockchain, and through another contract the bytecode of these contracts can be obtained but for this operation to work, the contract that obtains the code must know the interface of the contract that owns the code, in other words, it must import it and for reasons of contract size the **UniversityTemplate** contract could not be included in the **UniversityBuilder** contract because it exceeded its size limit.

**UniversityTemplate**

This smart contract it is the template contract for the creation of new contract that represents each university enrolled in the protocole.
For each new university that use the protocol, the **University Builder** contract will create a new smart contract base in this contract template.

In this way, each university will have its own contract to issue new University degrees.

The operations and functionalities of a University are many and could undergo changes over time, so the protocol was designed to allow these functionalities to be updated in the future, without the need to create a new university contract for the same university. In order to allow this, the functionalities and logic of the **UniversityTemplate** contract were divided into three contracts, one to be inherited and two to be used and updated independently. 

So in the future, if the logic need to be updated, a new contract logic will be deployed to the blockchain and the **UniversityTemplate** contract instance of the University related will be updated to call this new deployed contract with the new logic.

These contracts are the following:

* **UniversityTemplate_State**

This smart contract contains the state variables and mappings to store all the information that universities need to work with the protocol.
This smart contract is intended to be inherited by **University Template** contract.

* **UniversityTemplate_Governance**

This smart contract contains the logic to establish the university authorities as Rector, Dean and Director, who are the people who sign the degree titles that will be issued by the university.

* **UniversityTemplate_Logic**

This smart contract contains the main logic for the operation of an university, including:
* Request a new degree titles with the corresponding information
* Calculate the hash corresponding to the information of a requested degree, which will be used to be digitally signed by the university authorities
* Allow university authorities to sign the hash calculated from the information of the new degree to be issued
* Predict in advance the address of the future smart contract that will be created on the blockchain to represent the new degree title to be issued
* Create a new smart contract that represent a new degree title in the predited address on the blockchain
* Query the smart contract created that represents degree title on the blockchain

Only the authorized accounts of the Manager, Rector, Dean and Director can operate over this university contracts.

**UniversityDegreeTemplate**

This smart contract represents a University Degree title issued on the blockchain by an university enrolled in the protocole.

This smart contract will be used as a template for the creation of each new degree. In this way, the protocol allows updating the template that is used to create new degree titles in the blockchain, because in the future, if the information of the degree title needs to be updated, another version of the **UniversityDegreeTemplate ** contract can be deployed  on the blockchain to be used as a new template for new degrees titles to be issued.

Each instance of the contract is created for a specific graduate of the university that issues the degree title, so only the graduate is the owner of the contract and only him can access the information.

A possible future improvement may be to allow query the contract information based on a code issued by the owner of the contract.

**UniversityDegreeTemplate_Container**

This smart contract contains the logic for extract the bytecode from the **UniversityDegreeTemplate** contract and return it.
Operations on this smart contract are only allowed to a specific university contract.

The use of this contract is analogous to the use explained in the **UniversityTemplate_Container** contract.

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

#### Possible Issues with MetaMask

If when executing a transaction an error is generated with a message similar to: *"The account does not have the correct nonce"* Then the nonce of the account in question must be reset. 
For that, go to MetaMask, in user icon --> Settings --> Advanced --> Reset account.
Confirm the operation and try again. Good luck!

### About the author

- Author:   **David Gimenez Gutierrez**
- Linkedin: [linkedin.com/in/david-gimenez-gutierrez](linkedin.com/in/david-gimenez-gutierrez)



    