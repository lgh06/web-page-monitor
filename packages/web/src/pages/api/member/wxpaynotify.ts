// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB, ObjectId, middlewares, NextApiRequestWithUserInfo } from '../../../lib';
import { CronTime } from '@webest/web-page-monitor-helper';
import { mongo, jwt } from '@webest/web-page-monitor-helper/node';

import { fetchAPI } from "../../../helpers/httpHooks"
import crypto from 'crypto';

export default async function wxPayNotifyHandler(
  req: NextApiRequestWithUserInfo,
  res: NextApiResponse
) {
  const secret = process.env.NEXT_WX_PAY_SECRET

  let body = req.body;
  console.log('wxPayNotifyHandler body', body);
  res.status(200).json({ok: 1, success: true});
}