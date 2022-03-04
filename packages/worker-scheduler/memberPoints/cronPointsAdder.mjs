import { getNextStepMinuteTimestamp, getNextTimeSection } from "../helper.mjs";



console.log(
  getNextTimeSection(  new Date().setMonth( new Date().getMonth() - 1 )  , 60, 3).map(v => new Date(v))
)

async function normalAdder(now){
  now = now || Date.now(); // timestamp

}

async function errorAdder(now){
  now = now || Date.now(); // timestamp


}

export { normalAdder, errorAdder} 