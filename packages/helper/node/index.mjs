import { ReturnDocument } from 'mongodb';

let mongo = {
  upsertDoc: async function (db, collectionName,filter, doc, res) {
    const options = { upsert: true, returnDocument: ReturnDocument.AFTER };
    if(!filter){
      filter = doc;
    }
    // https://mongodb.github.io/node-mongodb-native/4.3/classes/Collection.html#findOneAndReplace
    let p = db.collection(collectionName).findOneAndReplace(filter, doc, options).then(returnedDoc => {
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