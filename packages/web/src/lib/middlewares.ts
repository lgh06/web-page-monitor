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
  },
);
const withAuthJwtMiddleware = label(
  {
    authJwt,
  },
);

const middlewares = {
  addRequestId: withAddRequestIdMiddleware("addRequestId"),
  authJwt: withAuthJwtMiddleware("authJwt"),
}

export { middlewares, middlewares as default }