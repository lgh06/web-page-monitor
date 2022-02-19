import { SignJWT,
  importJWK,
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

// nodejs side use
async function verifyJwt(jwtToken){
  try {
  
    const { payload, protectedHeader } = await jwtVerify(jwt, publicKey, {
      // issuer: 'urn:example:issuer',
      // audience: 'urn:example:audience'
    })
    
    return {
      verified: true,
      header: protectedHeader,
      jwt: payload,
    }
  } catch (error) {
    return {
      verified: false,
      header: null,
      jwt: null,
    }
  }
}

let jwt = {
  sign,
  verifyJwt,
}


export { jwt, jwt as default };