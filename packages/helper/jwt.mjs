import { SignJWT,
  generateKeyPair, exportJWK,importJWK,
  decodeProtectedHeader,decodeJwt,
  jwtVerify,
} from "jose";
import fs from "fs"

// https://nodejs.org/docs/latest-v16.x/api/crypto.html#static-method-keyobjectfromkey
// https://github.com/panva/jose/blob/c185e24def279e921258ccbafaf65d4bb571d60d/docs/README.md

// below one line used only when generating keypair
// const { publicKey, privateKey } = await generateKeyPair('PS384')

// below 4 lines used when already have keypair
let { priv } = await import("./priv.mjs");
let { pub } = await import("./pub.mjs");
const publicKey = await importJWK(pub, 'PS384')
const privateKey = await importJWK(priv, 'PS384')

// below 4 lines used only when generating keypair
// const privateJwk = await exportJWK(privateKey)
// const publicJwk = await exportJWK(publicKey)
// fs.writeFileSync('./priv.mjs',`export const priv =`+ JSON.stringify(privateJwk,null,2));
// fs.writeFileSync('./pub.mjs',`export const pub =` +JSON.stringify(publicJwk, null, 2));

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