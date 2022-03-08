
// production, front static files port 3001, next Node.js port 3002.
// development, all 3002.
let frontPort = String(process.env.NEXT_PUBLIC_DEV) === 'true' ? '3002' : '3001';
console.log('frontPort',frontPort, process.env.NEXT_PUBLIC_DEV);
let backPort = '3002';
// if NEXT_PUBLIC_nextHost == 1, then apiHost will use current host, api request will be sent to current host.
let host = process.env.NEXT_PUBLIC_nextHost || 'localhost';
let CONFIG = {
  dbName: process.env.dbName || 'webmonitordb',
  mongodbURI: process.env.mongodbURI || "mongodb://localhost:27017/",
  apiHost: process.env.NEXT_PUBLIC_apiHost || ( host === 'localhost' ? `http://${host}:${backPort}` : `` ),
  apiPrefix: process.env.NEXT_PUBLIC_apiPrefix || `/api`,
  wxApiHost: process.env.NEXT_PUBLIC_WX_API_HOST,
  giteeOauthClientId: '4606a3bd7aa3597e4de3e3c84687b8a2df672a6485cd112886cd1aee1cdc5d0e',
  giteeOauthClientSecret: '580f096526be60dcc2ef88bb933182918c2e2a6ab1f6880fbd54ac33db5a69a2',
  socketio: `http://${host}:3003/`,
  i18nDebug: process.env.NEXT_PUBLIC_i18nDebug === 'false' ? false : true,
};

// remove DB configs from frontend side's config
let frontCONFIG = {
  ...CONFIG,
  dbName: undefined,
  mongodbURI: undefined,
}

export { CONFIG, frontCONFIG };