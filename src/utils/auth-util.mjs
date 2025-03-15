import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 12;

const PRIV_KEY = fs.readFileSync(
  path.join(
    fileURLToPath(import.meta.url),
    '..',
    '..',
    'cryptography',
    'id_rsa.pem'
  ),
  'utf-8'
);

const PUB_KEY = fs.readFileSync(
  path.join(
    fileURLToPath(import.meta.url),
    '..',
    '..',
    'cryptography',
    'id_rsa_pub.pem'
  ),
  'utf-8'
);

export async function hashPassword(pass) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return await bcrypt.hash(pass, salt);
}

export async function comparePassword(plain, hashed) {
  return await bcrypt.compare(plain, hashed);
}

export function issueJwt(user) {
  const payload = { sub: user._id };
  const expiresIn = '1h';

  const signedToken = jwt.sign(payload, PRIV_KEY, {
    algorithm: 'RS256',
    expiresIn: expiresIn,
  });

  return {
    token: signedToken,
    expiresIn: expiresIn,
  };
}

export function verifyJwt(token) {
  const decoded = jwt.verify(token, PUB_KEY, { algorithms: ['RS256'] });
  console.log('Decoded: ', decoded);
  return decoded;
}
