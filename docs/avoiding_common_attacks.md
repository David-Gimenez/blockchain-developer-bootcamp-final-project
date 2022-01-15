# Avoiding Common Attacks

In the development of this project the following avoiding common attacks are used

### Using specific compiler pragma

All contracts use a single compiler version which is 0.8.4. Ranges are not used to allow other versions

### Proper use of Require and uso modifiers only for validations

Requires and modifiers are only used to restrict access to operations or to control value edge cases, but not to perform part of the business processes in the pattern.

### Pull over push

Prioritize receiving contracts call over making contract calls

In the process of creating a contract that introduces a Degree Title, hashing and encryption operations are chained together in the interaction between multiple contracts, for example:

* The setting of the salt for the calculation of the address that the contract of the Degree title that will be issued will have
* The calculation of the address of the Degree title to be issued
* The calculation of the hash that contains the information of the Degree title to be issued and that must be signed by each university authority

These operations can be done one hooked to the other, but it would imply many calls between contracts, so it was decided to separate them into several operations so that the University Manager must call each one of them (pull) instead of just one call that trigger many calls between contracts (push).

### Checks-Effects-Interactions

Avoiding state changes after external contract calls

This pattern could not be implemented in all cases. Many times the business logic required that after an external call the state of the blockchain be altered, either by changing a state variable or creating a contract.

What was added to mitigate this problem were additional checks after the operations that reverse the transaction in case the result is not as expected.

### Also this contracts take proytection against:

##### Re-entrency (SWC-107)

The contracts in the project are designed not to be able to receive ethers, since they do not have payable functions or receive or fallback functions.

Even so, the **UniversityBuilder**, **UniversityTemplate** and **UniversityDegreeTemplate** contracts have mechanisms to extract ethers from the contracts if they ever fall into them due to the Solidity vulnerability with the Selfdestruct command that forces a contract to receive ethers.

##### Forcible sending Ethers (SWC-132)

As mentioned in the previous point, this vulnerability was taken into account, both to be able to withdraw the ethers that are received, as well as functionalities that depend on the amount of ethers that a contract has were not generated.

##### Timestamp dependence (SWC-116)

No business process on the project is date-dependent for execution or control.

The dates stored in smart contracts in the system are two:
* The date on which the University issued the Degree Title
* The date on which a new contract that represnets an university degree is created

The difference is that the first date is defined by the University externally and corresponds to the date of the administrative process.

While the second date is obtained from the blockchain when the contract that represents the University Degree is mined

But in no case can the business cycle of the application be altered by altering any of these dates.

##### Tx.origin authentication (SWC-115)

tx.origin was not used in any authentication method or in any part of the code of the project contracts.