import { SignJWT,
  generateKeyPair, exportJWK,importJWK,
  decodeProtectedHeader,decodeJwt,
  jwtVerify,
} from "jose";
import fs from "fs"

// https://nodejs.org/docs/latest-v16.x/api/crypto.html#static-method-keyobjectfromkey
// https://github.com/panva/jose/blob/c185e24def279e921258ccbafaf65d4bb571d60d/docs/README.md
// const { webcrypto, KeyObject } = await import('crypto');
// const { subtle } = webcrypto;
// const key = await subtle.generateKey({
//   name: 'HMAC',
//   hash: 'SHA-256',
//   length: 256
// }, true, ['sign', 'verify']);

// const key = await subtle.generateKey({
//   name: 'HMAC',
//   hash: 'SHA-256',
//   length: 256
// }, true, ['sign', 'verify']);

// const keyObject = KeyObject.from(key);
// console.log(keyObject)

// const { publicKey, privateKey } = await generateKeyPair('PS384')
const publicKey = await importJWK(JSON.parse(fs.readFileSync('./pub', 'utf8')), 'PS384')
const privateKey = await importJWK(JSON.parse(fs.readFileSync('./priv', 'utf8')), 'PS384')

console.log(publicKey, privateKey)

// const privateJwk = await exportJWK(privateKey)
// const publicJwk = await exportJWK(publicKey)

// fs.writeFileSync('./priv',JSON.stringify(privateJwk,null,2));
// fs.writeFileSync('./pub',JSON.stringify(publicJwk, null, 2));
// console.log(privateJwk, publicJwk)



const jwt = await new SignJWT({ 'urn:example:claim': true })
  .setProtectedHeader({ alg: 'PS384' })
  // .setIssuedAt()
  // .setIssuer('urn:example:issuer')
  // .setAudience('urn:example:audience')
  // .setExpirationTime('2h')
  .sign(privateKey)

console.log(jwt)

const decodedHeader = await decodeProtectedHeader(jwt);
const decodedJwt = await decodeJwt(jwt);
console.log(decodedHeader, decodedJwt)


const { payload: payload2, protectedHeader: protectedHeader2 } = await jwtVerify(jwt, publicKey, {
  // issuer: 'urn:example:issuer',
  // audience: 'urn:example:audience'
})

console.log(protectedHeader2)
console.log(payload2)