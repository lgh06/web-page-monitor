import type { MongoClient, Db, WithoutId, Filter, Document, ModifyResult, DeleteResult } from "mongodb";
import type { NextApiRequest, NextApiResponse } from 'next'


export namespace mongo {
  function upsertDoc(db: Db | null, collectionName: string, filter: Filter<Document>, doc: WithoutId<Document>, res?: NextApiResponse<any> | undefined): Promise<void>;
  function upsertDoc(db: Db | null, collectionName: string, filter: Filter<Document> ,doc: WithoutId<Document>): Promise<ModifyResult<Document>>;
  function queryDoc(db: Db | null, collectionName: string, condition: Filter<Document>, project: Document, res: NextApiResponse<any>): Promise<Document[]>;
  function delOneDoc(db: Db | null, collectionName: string, condition: Filter<Document>, res: NextApiResponse<any>): Promise<DeleteResult>;
}

// declare module '@webest/web-page-monitor-helper/mongo' {
//   function upsertDoc(db: Db, collectionName: string, doc: Document): Promise<ModifyResult<Document>>;
// }