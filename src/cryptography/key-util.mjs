import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Generate an object where the keys are stored in properties 'privateKey' and 'publicKey'.
 *  - Type: 'rsa'
 *  - Modulus: 4096 => Standard for rsa
 *  - Encodings:
 *      - type: 'pkcs1' => Public Key Cryptography Standards 1
 *      - format: 'pem' => Privacy Enhanced Mail
 */
function genKeyPair() {
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  });

  fs.writeFileSync(
    path.join(fileURLToPath(import.meta.url), '..', '/id_rsa_pub.pem'),
    keyPair.publicKey
  );
  fs.writeFileSync(
    path.join(fileURLToPath(import.meta.url), '..', '/id_rsa.pem'),
    keyPair.privateKey
  );
}

genKeyPair();
