import crypto from 'crypto';

/**
 * Encrypt message with PublicKey for data encryption.
 */
export function encryptWithPublicKey(publicKey, message) {
  const msgBuffer = Buffer.from(message, 'utf-8');
  return crypto.publicEncrypt(publicKey, msgBuffer);
}

/**
 * Encrypt message with PrivateKey to attach digital signature.
 */
export function encryptWithPrivateKey(privateKey, message) {
  const msgBuffer = Buffer.from(message, 'utf-8');
  return crypto.privateEncrypt(privateKey, msgBuffer);
}
