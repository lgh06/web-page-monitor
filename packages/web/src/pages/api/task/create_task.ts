// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // console.log(req.body)
  // console.log(req)
  res.status(200).json({ test: "test", body: req.body })
}
