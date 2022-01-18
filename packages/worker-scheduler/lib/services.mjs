import { getDB } from "./lib/index.mjs"
let db = await getDB();

function getNext1to4MinutesTasks(){
  db.collection('dynjs').findOne({filename}).then(doc => {
    if(doc){
      return res.status(200).send(doc.content)
    }else{
      return res.status(200).send('')
    }
  })
}


/**
 * set newly created task's next execute time, from cron syntax.
 * 
 * TODO , should do this thing in `web` side, when one user first 
 * submit one task.
 * @param {*} cronSyntax cronSyntax
 */
async function setNewTaskNextTime(cronSyntax){

}