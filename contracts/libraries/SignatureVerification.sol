//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

/**
 * @title   SignatureVerification
 * @author  David Gimenez Gutierrez
 *
 * This library contains the logic to verify a digital signature that was calculated off-chain.
 * The code in this contract is based on the code shown in the following link, from solidity-by-example.org: https://solidity-by-example.org/signature/ 
 * And was designed using https://eips.ethereum.org/EIPS/eip-712
 * This library is part of my new Degree Certification Protocole.
 */
library SignatureVerification {

    function verifySignature(bytes32 _messageHash, bytes memory _signature) external view returns(bool) {
        // Check signature length
        require(_signature.length == 65, "Invalid signature length.");
        
        // Get address of the account of the signer of the message
        address signatureSigner = _recoverSignerFromSignature(_messageHash, _signature);

        // Check the signature signer is the same address of the account of the sender
        return  msg.sender == signatureSigner;
    }

    function _recoverSignerFromSignature(bytes32 _ethMessageHash, bytes memory _signature) private pure returns (address) {
        // Get the base component of a signature
        (bytes32 r, bytes32 s, uint8 v) = _splitSignature(_signature);
        
        // Get the address associated with the public key from elliptic curve signature or return zero on error
        address publicKeyAddressOfTheSigner = ecrecover(_ethMessageHash, v, r, s);
        
        // Return the address
        return publicKeyAddressOfTheSigner;
    }

    function _splitSignature(bytes memory _signature) private pure returns(bytes32 r, bytes32 s, uint8 v)
    {
        assembly {
            /*
            First 32 bytes stores the length of the signature
            add(sig, 32) = pointer of sig + 32 effectively, skips first 32 bytes of signature
            mload(p) loads next 32 bytes starting at the memory address p into memory
            */

            // first 32 bytes, after the length prefix
            r := mload(add(_signature, 32))

            // second 32 bytes
            s := mload(add(_signature, 64))

            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(_signature, 96)))
        }
        return (r, s, v);
    }
}