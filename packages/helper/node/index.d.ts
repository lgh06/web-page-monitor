import { MongoClient, Db, Document, ModifyResult } from "mongodb";
import type { NextApiRequest, NextApiResponse } from 'next'


export namespace mongo {
  function upsertDoc(db: Db, collectionName: string, doc: Document, res: NextApiResponse<any>): Promise<void>;
  function upsertDoc(db: Db, collectionName: string, doc: Document): Promise<ModifyResult<Document>>;
}

// declare module '@webest/web-page-monitor-helper/mongo' {
//   function upsertDoc(db: Db, collectionName: string, doc: Document): Promise<ModifyResult<Document>>;
// }