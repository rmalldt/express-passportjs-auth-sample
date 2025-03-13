import crypto from 'crypto';

/**
 * Decrypt PublicKey encrypted data with PrivateKey.
 */
export function decryptWithPrivateKey(privateKey, encryptedMessage) {
  return crypto.privateDecrypt(privateKey, encryptedMessage);
}

/**
 * Decrypt PrivateKey created digital signature with PublicKey
 */
export function decryptWithPublicKey(publicKey, encryptedMessage) {
  return crypto.publicDecrypt(publicKey, encryptedMessage);
}
