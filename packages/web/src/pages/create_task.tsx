import { NextPage } from "next/types";
import { CronTime } from "cron";
import { useEffect, } from 'react';
import { useImmerAtom } from 'jotai/immer';
import { creatingTaskDetailAtom } from '../atoms';

const CreateTaskPage: NextPage = () => {

  const [taskDetail, setTaskDetail] = useImmerAtom(creatingTaskDetailAtom);
  function updateDate(){
    setTaskDetail(v => {
      let nowDate = new Date();
      v.nowTimestamp = nowDate.valueOf();
      let offset = nowDate.getTimezoneOffset();
      v.nowLocalMinuteString = new Date(nowDate.setMinutes(nowDate.getMinutes()-offset)).toISOString().substring(0, 19)
    })
  }
  useEffect(() => {
    // https://stackoverflow.com/questions/53090432/
    // react-hooks-right-way-to-clear-timeouts-and-intervals
    updateDate();
    let intervalId = setInterval(updateDate, 1000);
    return ()=>{
      clearInterval(intervalId)
    };
  });

  return (<>
    <div>input cron syntax <br/>{taskDetail.nowLocalMinuteString}
      <input 
      placeholder="cron syntax"
      >

      </input>
    </div>
    <div>continue loops,  until<br/>
      <input 
        placeholder="choose a time" 
        value={taskDetail.nowLocalMinuteString}
        type="datetime-local" 
        // min="2022-01-16T13:47:31.890" 
        // max="2022-01-20T15:47:31.890"
        >
      </input>
    </div>
  </>);
}

export default CreateTaskPage