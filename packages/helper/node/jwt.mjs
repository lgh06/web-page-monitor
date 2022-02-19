import { SignJWT,
  generateKeyPair, exportJWK,importJWK,exportPKCS8,
  decodeProtectedHeader,decodeJwt,
  jwtVerify,
} from "jose";

let { priv } = await import("../priv.mjs");
var privateKey = await importJWK(priv, 'PS384')

async function sign(payloadObject){
  const signedJwt = await new SignJWT(payloadObject)
    .setProtectedHeader({ alg: 'PS384' })
    .sign(privateKey);
  return signedJwt;
}

let jwt = {
  sign,
}


export { jwt, jwt as default };