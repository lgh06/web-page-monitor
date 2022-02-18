import { label, NextMiddleware } from "next-api-middleware";

// https://github.com/htunnicliff/next-api-middleware

const addRequestId: NextMiddleware = async (req, res, next) => {
  // Let remaining middleware and API route execute
  await next();

  // Apply header
  res.setHeader("X-Response-TTime", Date.now());
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