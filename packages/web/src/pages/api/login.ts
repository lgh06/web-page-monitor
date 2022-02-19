// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

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
  const { provider, code, locale} = req.query;

  let host =  'http://' + req.headers.host;
  res.redirect(307, `${host}/${locale === 'en' ? '' : 'zh'}/login?code=${code}&provider=${provider}`)
}
