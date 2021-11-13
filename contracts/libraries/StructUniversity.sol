//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

/**
 * @title   StructUniversity
 * @author  David Gimenez Gutierrez
 *
 * This library contains structs related to University definition to be used across multiple contracts. 
 * This library is part of my new Degree Certification Protocole.
 */
library StructUniversity {
    
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Structs
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    // Issuer university information
    struct UniversityCollege {
        string  name;           // Name of the University that issue the Degree title.
        string  fullName;       // Full name of the University.
        string  country;        // Country of the University that issue the Degree title.
        string  state;          // State of the University that issue the Degree title.
        address contractAddress;// Contract address of the University that issue the Degree title.
    }

    // University authority person that signed the Degree contracts
    struct AuthorityPerson {
        string              name;           // Name of the University authority that signed Degree contracts.
        address             accountAddress; // The Ethereum account address of the authority person.
    }
}