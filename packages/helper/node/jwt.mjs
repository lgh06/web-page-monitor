import { SignJWT,
  generateKeyPair, exportJWK,importJWK,exportPKCS8,
  decodeProtectedHeader,decodeJwt,
  jwtVerify,
} from "jose";
import { priv } from "../priv.mjs";


async function sign(payloadObject){
  var privateKey = await importJWK(priv, 'PS384')
  const signedJwt = await new SignJWT(payloadObject)
    .setProtectedHeader({ alg: 'PS384' })
    .sign(privateKey);
  return signedJwt;
}

let jwt = {
  sign,
}


export { jwt, jwt as default };