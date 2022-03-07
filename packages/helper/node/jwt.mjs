import { SignJWT,
  importJWK,
  jwtVerify,
} from "jose";
import { priv } from "../priv.mjs";
import { pub } from "../pub.mjs";


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
    var publicKey = await importJWK(pub, 'PS384')
    const { payload, protectedHeader } = await jwtVerify(jwtToken, publicKey, {
      // issuer: 'urn:example:issuer',
      // audience: 'urn:example:audience'
    })
    
    return {
      verified: true,
      header: protectedHeader,
      payload: payload,
    }
  } catch (error) {
    // console.error(error)
    return {
      verified: false,
      header: null,
      payload: null,
    }
  }
}

let jwt = {
  sign,
  verifyJwt,
}


export { jwt, jwt as default };