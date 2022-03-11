// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ObjectId, ReturnDocument } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB, middlewares, NextApiRequestWithUserInfo } from '../../../lib';
import { mongo, jwt } from '@webest/web-page-monitor-helper/node';
import { CONFIG } from '../../../../CONFIG';
import { _userPostHandler } from './info';

let collectionName = 'user';


async function oauthPostHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { code, redirectUri, provider } = req.body;
  // if we have code, then ask for access_token
  if(provider === 'gitee'){
    try {
      // https://gitee.com/api/v5/oauth_doc#/list-item-2
      let resp = await fetch(`https://gitee.com/oauth/token?grant_type=authorization_code&code=${code}&client_id=${CONFIG.giteeOauthClientId}&redirect_uri=${redirectUri}`, {
        method: 'POST',
        body: new URLSearchParams(`client_secret=${CONFIG.giteeOauthClientSecret}`)
      });
      const data = await resp.json();
      // got access_token
      const { access_token, refresh_token, scope } = data;
  
      if (String(scope).includes('email')) {
        // ask for emails
        // https://gitee.com/api/v5/swagger#/getV5Emails
        let resp2 = await fetch(`https://gitee.com/api/v5/emails?access_token=${access_token}`, {
          method: 'GET',
        });
        const emailResp = await resp2.json();
        // emailResp, array, may have multiple emailResp
        if (emailResp && emailResp.length && emailResp[0] && emailResp[0].email) {
          // TODO save to db and generate jwt
          let email = emailResp[0].email;
          let emailState = emailResp[0].state;
          let oauthProvider = provider;
          return _userPostHandler({
            email,
            emailState,
            oauthProvider,
          }, res);
        }
      }
      return res.status(400).json({ err: 'no email returned from gitee' })
    } catch (error) {
      res.status(400).json({ err: error })
    }
  }

}




async function _handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method === 'POST'){
    await middlewares.cors(oauthPostHandler)(req, res);
  }else{
    res.status(400).json({ err: 'no method match' })
  }
}

export default _handler;
