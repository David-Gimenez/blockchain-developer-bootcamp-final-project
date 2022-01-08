//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

/**
 * @title   StructUniversity 
 * @author  David Gimenez Gutierrez
 * @notice  This library is part of my new Degree Certification Protocole 
 * @dev     This library contains structs related to University definition to be used across multiple contracts
 */
library StructUniversity {
    
    // ----------------------------------------------------------------------------------------------------------------------------------------------
    // -- Structs
    // ----------------------------------------------------------------------------------------------------------------------------------------------

    /// @dev Contains the issuer university information
    /// @param name [string] Name of the University that issue the Degree title
    /// @param fullName [string] Full name of the University
    /// @param country [string] Country of the University that issue the Degree title
    /// @param state [string] State of the University that issue the Degree title
    /// @param contractAddress [address] Contract address of the University that issue the Degree title
    struct UniversityCollege {
        string  name;
        string  fullName;
        string  country;
        string  state;
        address contractAddress;
    }

    /// @dev Contains the University authority person that signed the Degree contracts
    /// @param name [string] Name of the University authority that signed Degree contracts
    /// @param accountAddress [address] The Ethereum account address of the authority person
    struct AuthorityPerson {
        string  name;
        address accountAddress;
    }
}