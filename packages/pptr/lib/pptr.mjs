import { simpleMode } from "./simpleMode.mjs";

async function main(){
 // TODO subscribe MQ
 // distinct different mode, then use different mjs to execute pptr
  let taskDetail = {};

  if(taskDetail.mode ==='simp'){
    try {
      let [result, err] = await simpleMode(taskDetail)
    } catch (error) {
      console.log(error);
    }
  }
}

main();

