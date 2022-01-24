import { MongoClient, Db, Document, ModifyResult } from "mongodb";


export namespace mongo {
  function upsertDoc(db: Db, collectionName: string, doc: Document): Promise<ModifyResult<Document>>;
}

// declare module '@webest/web-page-monitor-helper/mongo' {
//   function upsertDoc(db: Db, collectionName: string, doc: Document): Promise<ModifyResult<Document>>;
// }