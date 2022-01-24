import { ReturnDocument } from 'mongodb';

let mongo = {
  upsertDoc: async function (db, collectionName, doc, res) {
    const options = { upsert: true, returnDocument: ReturnDocument.AFTER };
    let p = db.collection(collectionName).findOneAndReplace(doc, doc, options).then(returnedDoc => {
      return returnedDoc
    })
    if (res) {
      p = p.then(doc => {
        return res.status(200).json(doc)
      }).catch((e) => {
        return res.status(500).json({ err: e });
      })
    }
    return p;
  }
}

export { mongo } 