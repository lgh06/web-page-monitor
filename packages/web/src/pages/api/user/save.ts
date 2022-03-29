import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB, middlewares, NextApiRequestWithUserInfo } from '../../../lib';
import { _userPostHandler } from './info';

async function _handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method === 'POST'){
    // TODO
    // china mainland server cannot connect to google / firebase's server
    // frontend passed email may be fake
    await middlewares.cors(_userPostHandler)(req.body, res);
  }else{
    res.status(400).json({ err: 'no method match' })
  }
}

export default _handler;