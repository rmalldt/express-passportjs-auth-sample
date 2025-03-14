import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { encryptWithPrivateKey } from './encrypt.mjs';

// Sign the hashed data with PrivateKey i.e. encrypt with PrivateKey
const senderPrivateKey = fs.readFileSync(
  path.join(fileURLToPath(import.meta.url), '..', 'id_rsa.pem'),
  'utf-8'
);

const testData = {
  firstName: 'Jim',
  lastName: 'Page',
  email: 'jim@in.com',
};

// Hash the data
const hash = crypto.createHash('sha256'); // hash function to be used
hash.update(JSON.stringify(testData)); // set the value of hash with data (must be string format)
const hashedData = hash.digest('hex'); // hashed data in hexadecimal string format

const signedMessage = encryptWithPrivateKey(senderPrivateKey, hashedData);

export const dataPackageToSend = {
  algorithm: 'sha256',
  originalData: testData,
  signedAndEncryptedData: signedMessage,
};
