import { NextPage } from "next/types";
import { ChangeEvent, useEffect, } from 'react';
import { useImmerAtom } from 'jotai/immer';
import { creatingTaskDetailAtom } from '../atoms';
import { cron } from '@webest/web-page-monitor-helper';

const CreateTaskPage: NextPage = () => {

  const [taskDetail, setTaskDetail] = useImmerAtom(creatingTaskDetailAtom);

  // Calculate a ISO string in local time, minute, without end 'Z'
  function toLocalISOString(oneDate: Date, plusMinutes = 0){
    let offset = oneDate.getTimezoneOffset();
    return new Date(oneDate.setMinutes(oneDate.getMinutes()-offset + plusMinutes)).toISOString().substring(0, 16)
  }


  function checkTimes(timestampArr : Array<number>){
    let now = Date.now();
    let errors = new Set();
    timestampArr.forEach((v, i, a) => {
      if(i === 0) {
        if((v - now) < 60*6*1000){
          errors.add('first job need 6 minutes later, please check');
        }
      }
      if(i >= 1){
        if((v - a[i-1]) < 60*5*1000){
          errors.add('jobs between need >= 5 minutes later, please check');
        }
      }
      let errorArr = Array.from(errors);
      if(errorArr.length){
        return [false, errorArr]
      }else{
        return [true];
      }
    })
  }
  // update input date when first entry
  function updateDate(){
    setTaskDetail(v => {
      let nowDate = new Date();
      v.endLocalMinuteString = toLocalISOString(nowDate, 6);
    })
  }

  function handleInputChange(ev: ChangeEvent<HTMLInputElement>){
    let inputElement = ev.target;
    let index = ev.target.dataset.inputIndex;
    if(index === '0'){
      let nextArr = cron.getNextTimes(inputElement.value);
      console.log(nextArr)
      setTaskDetail(v => {
        v.cronSyntax = inputElement.value;
      })
    }
    if(index === '1'){
      if (!inputElement.validity.valid) return;
      const dtISO = toLocalISOString( new Date(inputElement.value) );
      setTaskDetail(v => {
        v.endLocalMinuteString = dtISO;
      })
    }
  }
  useEffect(() => {
    // https://stackoverflow.com/questions/53090432/
    // react-hooks-right-way-to-clear-timeouts-and-intervals
    updateDate();
    // let intervalId = setInterval(updateDate, 60*1000);
    // return ()=>{
    //   clearInterval(intervalId)
    // };
  },[]);

  return (<>
    <div>input cron syntax <br/>{taskDetail.endLocalMinuteString}
      <input 
        placeholder="cron syntax"
        data-input-index="0"
        value={taskDetail.cronSyntax}
        onChange={handleInputChange}
      >

      </input>
    </div>
    <div>continue loops,  until<br/>
      <input 
        placeholder="choose a time" 
        value={taskDetail.endLocalMinuteString}
        data-input-index="1"
        onChange={handleInputChange}
        type="datetime-local" 
        min={taskDetail.endLocalMinuteString}
        >
      </input>
    </div>
  </>);
}

export default CreateTaskPage