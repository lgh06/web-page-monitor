import { ReturnDocument, Db } from 'mongodb';

let mongo = {
  /**
   * 
   * @param {Db} db 
   * @param {*} collectionName 
   * @param {*} filter 
   * @param {*} doc 
   * @param {*} res 
   * @returns 
   */
  upsertDoc: async function (db, collectionName,filter, doc, res) {
    if( (!db) && res) return res.status(500).send('db lost');
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
  },
  /**
   * 
   * @param {Db} db 
   * @param {*} collectionName 
   * @param {*} doc 
   * @param {*} res 
   * @returns 
   */
  insertDoc: async function (db, collectionName, doc, res) {
    if( (!db) && res) return res.status(500).send('db lost');
    // https://mongodb.github.io/node-mongodb-native/4.3/classes/Collection.html#findOneAndReplace
    let p = db.collection(collectionName).insertOne( doc ).then(returnedDoc => {
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
  },
  /**
   * 
   * @param {Db} db 
   * @param {*} collectionName 
   * @param {*} condition 
   * @param {*} project 
   * @param {*} res 
   * @returns 
   */
  queryDoc: async function (db, collectionName, condition = {}, project = {}, res) {
    if( (!db) && res) return res.status(500).send('db lost');
    let p = db.collection(collectionName).find( condition ).project(project).toArray().then(returnedDoc => {
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