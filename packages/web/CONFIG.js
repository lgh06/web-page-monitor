import { globalConfig } from "@webest/web-page-monitor-helper";

// production, front static files port 3001, next Node.js port 3002.
// development, all 3002.
let frontPort = String(process.env.NEXT_PUBLIC_DEV) === 'true' ? '3002' : '3001';
console.log('frontPort',frontPort, process.env.NEXT_PUBLIC_DEV);
let backPort = '3002';
let host = (globalConfig.useProdConfig && globalConfig.nextHost) ? globalConfig.nextHost : 'localhost';
let CONFIG = {
  dbName: '' || globalConfig.dbName,
  mongodbURI: '' || globalConfig.mongodbURI,
  // frontHost: `http://${host}:${frontPort}`,
  backHost:`http://${host}:${backPort}`,
  giteeOauthClientId: '4606a3bd7aa3597e4de3e3c84687b8a2df672a6485cd112886cd1aee1cdc5d0e',
  giteeOauthClientSecret: '580f096526be60dcc2ef88bb933182918c2e2a6ab1f6880fbd54ac33db5a69a2',
  giteeRedirectUri: `http://${host}:${backPort}/api/login?provider=gitee`,
  socketio: `http://${host}:3003/`,
  useProdConfig: globalConfig.useProdConfig,
};

// remove DB configs from frontend side's config
let frontCONFIG = {
  ...CONFIG,
  dbName: undefined,
  mongodbURI: undefined,
}

export { CONFIG, frontCONFIG };