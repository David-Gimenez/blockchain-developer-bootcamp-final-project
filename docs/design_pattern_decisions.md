# Design Pattern Decisions

In the development of this project the following design patterns are used.

All this relations can be saw easy on the contracts diagram: ![university_degree_protocol_diagram](docs/university_degree_protocol_diagram.jpg)

### Inter Contract Execution

Calling functions in external contracts. This functionality was used a couple of times in the project.

The **UniversityBuilder** contract imports the **UniversityTemplate_Container** contract interface and uses it to call it to get the bytecode from the **UniversityTemplate** contract and create new instance of this contract. This call is used in conjunction with the access control design pattern to allow the call only for the **UniversityBuilder** Contract.

The **UniversityBuilder** contract then also makes static calls to the newly created instance of the **UniversityTemplate** contract to verify the contract information.

It was taken into account to use call in cases where it was necessary to alter the state of the blockchain, such as when creating the contract, and to use static call to perform read-only operations.

Very similar is the case of the **UniversityTemplate_Logic** contract that makes calls and staticcalls to the **UniversityDegreeTemplate_Container** and **UniversityDegreeTemplate** contracts for the same reasons, create new contracts and read state variables.

The **UniversityDegreeTemplate_Container** also makes calls to the **UniversityDegreeTemplate** contract to read his bytecode and create a new instance based on that bytecode.

On the other hand each instance of the contract **University Template**, which are created by **UniversityBuilder**, must make delegate calls to the contract that contains its governance logic **UniversityTemplate_Governance** and to its contract that has its business logic **UniversityTemplate_Logic**.

These contracts were separated in this way for two reasons:

* Allow governance logic and business logic to be updated in the future by implementing the upgradable pattern described below
* Prevent the size of the **UniveristyTemplate** contract from exceeding the allowed limits

With this, each operation that is requested to the instances of the **UniversityTemplate** contract is delegated to its governance contract or to its logic contract, depending on the operation in question.

These delegate calls must be executed with delegatecall so that the state of the **UniveristyTemplate** contract, that acts as the proxy contract, is affected where appropriate.

### Inheritance contracts

Importing and extend contracts

Since the **UniversityDegree** contract uses delegatecall to execute operations on the **UniversityTemplate_Governance** and **UniversityTemplate_Logic** contracts, it was necessary that these three contracts share the same storage structure, that is, the same definition of state variables and mappings.

For this, inheritance was used, creating the **UniversityTemplate_State** contract that has the state variables and mappings required by the **UniversityTemplate** contract and **UniversityTemplate_Governance** and **UniversityTemplate_Logic** as well. Inheriting these last three contracts from the first one.


### Access Control

Restricting access to certain functions using ownable patter

All the contracts in the project use the access control pattern, implementing as an owner variable or role based.
All the main operations, which involve changes the state of the blockchain, are protected by this pattern.

In **UniversityBuilder** contract, this type of operations can only be accessed by the account deploying the contract.

In the **UniversityTemplate_Container** contract, only the address of the associated **UniversityBuilder** contract instance can execute this type of operations.

In **UniversityTemplate** the operations can only be carried out by the authorized accounts of the university that use the contract, and those are the ones that correspond to the roles of
* Manager
* Rector
* Dean
* Director

There are even specific operations for each role. For example the Manager cannot sign Degree titles but the Rector, Dean and Director can. But these last three cannot create Degree titles to be processed or publish them, which is the Manager's task. This generates a pattern of control among the operators of the University.

The **UniversityTemplate_Governance** and **UniversityTemplate_Logic** contracts do not have execution restrictions for their functions since the state that can be altered is their own but never that of the associated proxy contract, in this case the instance of **UniversityTemplate** contract, since these contracts are used to receive delegatecall from him.

The **UniversityDegreeTemplate_Containr** contract accept calls only from the account of the Manager of the university, since the calls that reach him are those made with delegatecall from the **UniversityTemplate** contract which is managed by the account of the Manager and the other authorities, but only the Manager has permissions on this contract, which is in charge of creating new university degrees.

**NOTE:** Reviewing the controls on the calls, I detect that in the contract **UniversityDegreeTemplate_Container** the method **createNewUniversityDegree** was left without the ownable pattern applied, so it is a bug to be fix in future versions of the protocol.

In the case of the **UniversityDegreeTemplate** contract, it only accepts calls from the account of the graduate student, which is the owner of the contract or the University contract that created it, but with different accesses. The university can set the signatures of the authorities in the contract and the owner can access their information and withdraw ethers if they ever fall into the contract.

### Upgradable Contracts

The way of update a deployed contract's logic

The upgrade pattern was implemented in two different places in the protocol and in two different ways.

The first way is in the relationship between the **UniversityTemplate**, **UniversityTemplate_Governance** and **UniversityTemplate_Logic** contracts, where a proxy-implementation pattern was used, where **UniversityTemplate** is the proxy contract and the two others are its two implementations regarding governance operations and business logic operations.

In this way, in the future, new governance and/or logic contracts can be deployed and the existing link in the proxy contract, that is, in **UniversistyTemplate**, can be updated in such a way that from that moment on, the contained code is used in the newly deployed contracts.

The second way the upgradable pattern was implemented was when creating contracts from other contracts.

**UniversityBuilder** and **UniversityDegreeTemplate_Container** contracts have the ability to create other contracts and these new contracts that they can create are created from existing bytecode in contracts deployed on the blockchain used as templates, i.e. **UniversityTemplate** contract to create universities and **UniversityDegreeTemplate** contract to create university degrees titles.

The way I do it is by obtaining from the template contracts, which are already deployed in the blockchain, the bytecode with the command: **type(contract_artifact).creationcode**. Then from that bytecode, create a new contract by deploying that bytecode in another address.

Here the update pattern is used on the contracts used as templates, since it is enough to deploy a new version of the **UniversityTemplate_Container** contract to be able to create university contracts with a new template and the same for **UniversityDegreeTemplate_Container**.

### Optimizing Gas

Creating more efficient Solidity code

Many gas saving techniques were implemented during the development of the project. Some of them are listed below:

* **Short circuit rule**
* **No loop was used in the project**
* **Explicit functions visibility**
    All the functions that can have external visibility have it, only the functions that really need to be called from within the contract have public visibility, which consumes more GAS.
* **Check for GAS Costly Patterns**
    * Dead code
    * Opaque predicate
* **Use functions instead of modifiers**
    Modifiers are more expensive to evaluate in terms of GAS usage as they consume more space in the contract to store and run. 
    For this reason, in the contracts with the highest risk of exceeding the maximum size of the contract, all the modifiers were converted to private functions. 