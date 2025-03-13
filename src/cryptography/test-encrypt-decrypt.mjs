import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { encryptWithPublicKey } from './encrypt.mjs';
import decryptWithPrivateKey from './decrypt.mjs';

//  ENCRYPT data with PublicKey
const publicKey = fs.readFileSync(
  path.join(fileURLToPath(import.meta.url), '..', 'id_rsa_pub.pem'),
  'utf-8'
);
const encryptedMessage = encryptWithPublicKey(publicKey, 'Secret Message');
console.log('Encrypted Message: ', encryptedMessage.toString());

// DECRYPT data with PrivateKey
const privateKey = fs.readFileSync(
  path.join(fileURLToPath(import.meta.url), '..', 'id_rsa.pem'),
  'utf-8'
);
const decryptedMessage = decryptWithPrivateKey(privateKey, encryptedMessage);
console.log('Decrypted Message: ', decryptedMessage.toString());
