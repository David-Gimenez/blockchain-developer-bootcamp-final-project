//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

/**
 * @title   Hash_EIP712_CalculationFormula
 * @author  David Gimenez Gutierrez
 *
 * This contract contains the calculation formula to obtain the EIP format hash of the 
 * Degree contract information to be signed by University Authorities
 * This contract is part of my new Degree Certification Protocole.
 */

 contract Hash_EIP712_CalculationFormula {

     string public hash_EIP712_CalculationFormula = 
        "keccak256(abi.encodePacked("
							"'\x19\x01',"
							"keccak256(abi.encode("
                                                "keccak256('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'),"
                                                "keccak256(bytes('DegreeCertificationProtocole')),"
                                                "keccak256(abi.encode(VERSION)),"
                                                "chainID,"
                                                "university.accountAddress"
                                                ")"
                                        "),"
							"keccak256(abi.encode("
                                                "keccak256("
														"DegreeInformation(Degree degree,Owner owner,UniversityCollege university,address contractAddress)"
														"Degree(string name,string description,string legalStatement,uint256 issueDate)"
														"Owner(string name,uint256 graduateNumber,address accountAddress)"
														"UniversityCollege(string name,string fullName,string country,string state,address accountAddress)"
												"),"
                                                "keccak256(abi.encode("
																	"keccak256('Degree(string name,string description,string legalStatement,uint256 issueDate)'),"
																	"keccak256(bytes(degree.name)),"
																	"keccak256(bytes(degree.description)),"
																	"keccak256(bytes(degree.legalStatement)),"
																	"degree.issueDate"
																	")"
															"),"
                                                "keccak256(abi.encode("
																	"keccak256('Owner(string name,uint256 graduateNumber,address accountAddress)'),"
																	"keccak256(bytes(owner.name)),"
																	"owner.graduateNumber,"
																	"owner.accountAddress"
																	")"
															"),"
                                                "keccak256(abi.encode("
																	"keccak256('UniversityCollege(string name,string fullName,string country,string state,address accountAddress)'),"
																	"keccak256(bytes(university.name)),"
																	"keccak256(bytes(university.fullName)),"
																	"keccak256(bytes(university.country)),"
																	"keccak256(bytes(university.state)),"
																	"_university.accountAddress"
																	")"
															"),"
                                                "This_Degree_Contract_Address"
                                                ")"
                                            ")))";

 }