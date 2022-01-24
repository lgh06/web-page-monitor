import { ReturnDocument } from 'mongodb';

let mongo = {
  upsertDoc: async function(db, collectionName, doc){
    const options = { upsert: true, returnDocument: ReturnDocument.AFTER };
    return db.collection(collectionName).findOneAndReplace(doc, doc , options).then(returnedDoc => {
      return returnedDoc
    });
  }
}

export { mongo } 