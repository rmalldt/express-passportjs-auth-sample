import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import base64url from 'base64url';
import { fileURLToPath } from 'url';

const headerObj = { alg: 'HS256', typ: 'JWT' };

const payloadObj = {
  sub: '1234567890',
  name: 'John Doe',
  admin: true,
  iat: 1516239022,
};

/*****************************************************************
 * ISSUANCE
 */
const base64UrlHeader = base64url(JSON.stringify(headerObj));
const base64UrlPayload = base64url(JSON.stringify(payloadObj));

// Signature function to use
const signatureFn = crypto.createSign('RSA-SHA256');

// Load the header and payload to signature function
signatureFn.write(base64UrlHeader + '.' + base64UrlPayload);
signatureFn.end();

// Sign the jwt
const privateKey = fs.readFileSync(
  path.join(fileURLToPath(import.meta.url), '..', '..', 'id_rsa.pem'),
  'utf-8'
);

// NOTE: Node uses base64 encoding, therefore, the signed output is in base64 format
// Sign the data using PrivateKey
const signedBase64 = signatureFn.sign(privateKey, 'base64');

// Convert base64 to base64Url
const signedBase64Url = base64url.fromBase64(signedBase64);
console.log('HEADER: ', base64UrlHeader);
console.log('PAYLOAD: ', base64UrlPayload);
console.log('SIGN: ', signedBase64Url);

//////////////////////// END OF ISSUANCE ////////////////////////

/*****************************************************************
 * VERIFY
 */
const jwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.BUOKHY-m1XhvzY0Sfs6IhsZ25SoA5WlI_1PV0ys9ZKtWN89r1SJz2isFeeMBkR6Rz6qmRD-pLTEzfHPDUkfkMp9J1E8rh8Na8BwhqEyI7ucT2Nh5YxEuebFlfbkNFIGGGgOpP6xxZKzo7M8GgLWjQ0evsQLi4DUr7VtdQvi-vmnUJ9Wg5WtPGObbMAvuLci-uK21dYuEw469M3DuwLuzXV9g4AoooY_Q9-kHpo_aTOQl3y-cvV5U3N7kok1Mj39PLJTJeGJeMTgYRRPDPkWDSqm1VRIE2s_HvYP_KDigC8k8paVwluTWOCDRcFojoQF-3fPNXa2GVcSJcZAFD74BILI63w92YYWkp_57egBM7FejGogsqi7SKvP2nMAKGlIRVwjj-b1JLETT6bIj8KeYI3KLDUoarXbrTqx6d98iAHJlMg1hYVekpHC0T2NXV1Qj49E-DLbG0_kPuR3IotixvNNxhvifKG3cXIAF-UOf_xSZh2vlFQjs5tbaVLjeuXQVgV1o6167qo7t-Nqa3FmNX3_iiaeCk-49jeluqJuqy0_ZPgCca1_8MlDE8jpYGFLSdhlYgbjFDdOW6pgBg-wkjgynLO_Fxj4vHd9H1YQJ7KSpcLfaXxJxsKh0FJ7YbTDguFLVijGBD3PbspEKEtbcvASJGYGfWWz1lm-GsoUHYhE';

const verifyFn = crypto.createVerify('RSA-SHA256');

const jwtParts = jwt.split('.');
const headerBase64Url = jwtParts[0];
const payloadBase64Url = jwtParts[1];
const signatureBase64Url = jwtParts[2];

// Write header and payload for verification
verifyFn.write(headerBase64Url + '.' + payloadBase64Url);
verifyFn.end();

// NOTE: Node uses base64 encoding, therefore, ALWAYS convert base64Url to base64 before decryption.
const jwtSignatureBase64 = base64url.toBase64(signatureBase64Url);

const publicKey = fs.readFileSync(
  path.join(fileURLToPath(import.meta.url), '..', '..', 'id_rsa_pub.pem'),
  'utf-8'
);

// Verify the data using PublicKey
const signatureIsValid = verifyFn.verify(
  publicKey,
  jwtSignatureBase64,
  'base64'
);

console.log('SIGNATURE IS VALID: ', signatureIsValid);
