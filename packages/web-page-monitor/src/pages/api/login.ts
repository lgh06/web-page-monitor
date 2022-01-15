// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import CONFIG from '../../../CONFIG';

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
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { provider, code} = req.query;

  res.redirect(307, `${CONFIG.frontHost}/login?code=${code}&provider=${provider}`)
}
