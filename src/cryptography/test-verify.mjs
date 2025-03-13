import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import { dataPackageToSend } from './test-digitalsign.mjs';
import { fileURLToPath } from 'url';
import { decryptWithPublicKey } from './decrypt.mjs';

// The data received from sender
const receivedData = dataPackageToSend;

const hash = crypto.createHash(receivedData.algorithm); // hash function to be used

// Decrypt the data with PublicKey
const publicKey = fs.readFileSync(
  path.join(fileURLToPath(import.meta.url), '..', 'id_rsa_pub.pem'),
  'utf-8'
);
const decryptedMessage = decryptWithPublicKey(
  publicKey,
  receivedData.signedAndEncryptedData
);

// NOTE: decrypted message is a hashed object. Refer signin process.
// So get hash by using buffer.toString()
const decryptedMessageHex = decryptedMessage.toString();

// Get hash of original message
hash.update(JSON.stringify(receivedData.originalData));
const hashOfOriginalMessageHex = hash.digest('hex');

// Compare the decrypted hash and original message hash
decryptedMessageHex === hashOfOriginalMessageHex
  ? console.log('The message has not been tempered and has valid signature.')
  : console.log('The message has been tempered!');
