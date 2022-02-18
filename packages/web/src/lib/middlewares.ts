import { label, NextMiddleware } from "next-api-middleware";

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

const withAddRequestIdMiddleware = label(
  {
    addRequestId,
  },
);

const middlewares = {
  addRequestId: withAddRequestIdMiddleware("addRequestId")
}

export { middlewares, middlewares as default }