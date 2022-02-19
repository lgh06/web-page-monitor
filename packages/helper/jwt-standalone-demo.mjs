/**
 * this file is a single executable file, 
 * run `node jwt-standalone-demo.mjs` to run this file
 */
import { SignJWT,
  generateKeyPair, exportJWK,importJWK,exportPKCS8,
  decodeProtectedHeader,decodeJwt,
  jwtVerify,
} from "jose";
// use jsrsasign only in web browser
// import { KEYUTIL, jws } from "jsrsasign";

// https://nodejs.org/docs/latest-v16.x/api/crypto.html#static-method-keyobjectfromkey
// https://github.com/panva/jose/blob/c185e24def279e921258ccbafaf65d4bb571d60d/docs/README.md

// below 4 lines used when already have keypair
let { priv } = await import("./priv.mjs");
let { pub } = await import("./pub.mjs");
const publicKey = await importJWK(pub, 'PS384')
const privateKey = await importJWK(priv, 'PS384')

// below 7 lines used only when generating keypair
// const { publicKey, privateKey } = await generateKeyPair('PS384')
// const privateJwk = await exportJWK(privateKey)
// const publicJwk = await exportJWK(publicKey)
// const privatePKCS8 = await exportPKCS8(privateKey)
// fs.writeFileSync('./priv.mjs',`export const priv =`+ JSON.stringify(privateJwk,null,2));
// fs.writeFileSync('./pub.mjs',`export const pub =` +JSON.stringify(publicJwk, null, 2));
// fs.writeFileSync('./privPKCS8.pk8', privatePKCS8);

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

// use jsrsasign only in web browser
// const pubKey = KEYUTIL.getKey(pub);
// const jwtVerifyResult = jws.JWS.verifyJWT(jwt, pubKey, {alg: ['PS384']});
// console.log(jwtVerifyResult)


// "jose": "~4.5.0",
// "jsrsasign": "^10.5.6",