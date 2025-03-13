export function objectToBase64Url(obj) {
  const json = JSON.stringify(obj);
  return Buffer.from(json).toString('base64url');
}

export function base64UrlToObject(base64UrlString) {
  const json = Buffer.from(base64UrlString, 'base64url').toString();
  return JSON.parse(json);
}
