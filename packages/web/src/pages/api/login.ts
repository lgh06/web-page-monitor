// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { middlewares } from '../../lib';

type Data = {
  [key: string]: string | string[];
}

/**
 * 
 * see https://gitee.com/api/v5/oauth_doc#/list-item-2  
 * see https://gitee.com/oauth/applications
 * 
 * @param req 
 * @param res 
 */
async function _handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { provider, code} = req.query;

  let host =  'http://' + req.headers.host;
  res.redirect(307, `${host}?code=${code}&provider=${provider}`)
}

export default middlewares.cors(_handler);
