// production, front static files port 3001, next Node.js port 3002.
// development, all 3002.
let frontPort = String(process.env.NEXT_PUBLIC_DEV) === 'true' ? '3002' : '3001';
console.log('frontPort',frontPort, process.env.NEXT_PUBLIC_DEV);
let backPort = '3002';
let CONFIG = {
  frontHost: `http://localhost:${frontPort}`,
  giteeOauthClientId: '4606a3bd7aa3597e4de3e3c84687b8a2df672a6485cd112886cd1aee1cdc5d0e',
  giteeOauthClientSecret: '580f096526be60dcc2ef88bb933182918c2e2a6ab1f6880fbd54ac33db5a69a2',
  giteeRedirectUri: `http://localhost:${backPort}/api/login?provider=gitee`,
  socketio: `http://localhost:3003/`,
};

export { CONFIG, CONFIG as default };