import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import jwt from 'jsonwebtoken';

const privateKey = fs.readFileSync(
  path.join(fileURLToPath(import.meta.url), '..', '..', 'id_rsa.pem'),
  'utf-8'
);

const publicKey = fs.readFileSync(
  path.join(fileURLToPath(import.meta.url), '..', '..', 'id_rsa_pub.pem'),
  'utf-8'
);

const payloadObj = {
  sub: '1234567890',
  name: 'John Doe',
  admin: true,
  iat: 1516239022,
};

const signedJWT = jwt.sign(payloadObj, privateKey, { algorithm: 'RS256' });
console.log('SIGNED JWT: ', signedJWT);

const decoded = jwt.verify(signedJWT, publicKey, {
  algorithms: ['RS256'],
});
console.log('DECODED: ', decoded);
