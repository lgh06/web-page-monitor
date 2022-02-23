import { label, NextMiddleware } from "next-api-middleware";
import { jwt } from "@webest/web-page-monitor-helper/node";

// https://github.com/htunnicliff/next-api-middleware

const addRequestId: NextMiddleware = async (req, res, next) => {
  // Let remaining middleware and API route execute
  // if(req.cookies && req.cookies.NEXT_LOCALE){
  //   await next();
  //   // Apply header
  //   res.setHeader("X-Response-TTime", Date.now());
  // }else{
  //   res.status(401);
  //   res.send('forbidden');
  //   res.end();
  // }
  res.setHeader("X-Response-TTime", Date.now());
  await next();
};

const cors: NextMiddleware = async (req, res, next) => {
  if(req.method === 'OPTIONS'){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Max-Age', 1728000);
    res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
    res.setHeader('Content-Length', 0);
    res.status(204);
    res.end();
  }else{
    res.setHeader('Access-Control-Allow-Methods', '*')
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Expose-Headers", "*");
    await next();
  }
};

const authJwt: NextMiddleware = async (req, res, next) => {
  let authorization = req.headers.authorization;
  let jwtToken = String(authorization).substring(7);
  let {verified} = await jwt.verifyJwt(jwtToken);
  if(!req.headers.authorization || !verified){
    res.status(401);
    res.json({err:'forbidden'});
    res.end();
  }else{
    await next();
  }
  // res.setHeader("X-Response-TTime", Date.now());
};

const withAddRequestIdMiddleware = label(
  {
    addRequestId,
    cors,
  },
  ['cors']
);
const withAuthJwtMiddleware = label(
  {
    authJwt,
    cors,
  },
  ['cors']
);
const withCorsMiddleware = label(
  {
    cors,
  },
);

const middlewares = {
  addRequestId: withAddRequestIdMiddleware("addRequestId"),
  authJwt: withAuthJwtMiddleware("authJwt"),
  cors: withCorsMiddleware("cors"),
}

export { middlewares, middlewares as default }