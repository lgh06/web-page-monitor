import { NextPage } from "next/types";
import { ChangeEvent, useEffect, MouseEvent } from 'react';
import { useImmerAtom } from 'jotai/immer';
import { createTaskDetailAtom, monacoEditorAtom } from '../atoms';
import { CronTime } from '@webest/web-page-monitor-helper';
import { fetchAPI } from "../helpers/index";
import Link from "next/link";

import dynamic from 'next/dynamic'

// https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr
const MonacoEditor = dynamic(
  () => import('../components/monacoEditor'),
  { ssr: false }
)

const CreateTaskGeekPage: NextPage = () => {

  const [taskDetail, setTaskDetail] = useImmerAtom(createTaskDetailAtom);
  const [editorValue] = useImmerAtom(monacoEditorAtom);


  // update input date when first entry
  function updateDate() {
    setTaskDetail(v => {
      v.mode = 'geek'; // this page for geek mode
      let nowDate = new Date();
      // TODO different type user, diff end time
      v.endLocalMinuteString = CronTime.toLocalISOString(nowDate, 7*60*24);
      v.startLocalMinuteString = CronTime.toLocalISOString(nowDate, 10);
    })
  }

  function handleInputChange(ev: ChangeEvent<HTMLInputElement>) {
    let inputElement = ev.target;
    let index = ev.target.dataset.inputIndex;
    if (index === '0') {
      setTaskDetail(v => {
        v.cronSyntax = inputElement.value;
      })
      let nextArr = CronTime.getNextTimes(inputElement.value);
      let [passed, errorMsg] = CronTime.checkTimes(nextArr);
      // console.log(nextArr, passed, errorMsg)
      if (passed) {
        setTaskDetail(v => {
          v.cronPassed = true;
          v.cronMsg = 'cron syntax check passed. ';
        })
      } else {
        setTaskDetail(v => {
          v.cronPassed = false;
          v.cronMsg = Array(errorMsg).join(' ');
        })
      }
    }
    if (index === '1') {
      if (!inputElement.validity.valid) return;
      const dtISO = CronTime.toLocalISOString(new Date(inputElement.value));
      setTaskDetail(v => {
        v.endLocalMinuteString = dtISO;
      })
    }
  }

  async function handleBtnClick(ev: MouseEvent<HTMLButtonElement> ) {
    ev.preventDefault()
    console.log(editorValue);
    let data = await fetchAPI('/task/create_task', {test: "string one"});
    console.log(data)

    return true;
  }

  useEffect(() => {
    // https://stackoverflow.com/questions/53090432/
    // react-hooks-right-way-to-clear-timeouts-and-intervals
    updateDate();
    // let intervalId = setInterval(updateDate, 60*1000);
    // return ()=>{
    //   clearInterval(intervalId)
    // };
  }, []);
  
  return (<>
    <style jsx>{`
      div > input + a {
        color:blue;
        margin-left: 3em;
      }
      div > a {
        color:blue;
      }
      a:hover{
        text-decoration: underline;
      }
    `}</style>
    <div>
      {/* input cron syntax <br /> */}
      {taskDetail.cronMsg}<br/>
      <input
        placeholder="cron syntax"
        data-input-index="0"
        value={taskDetail.cronSyntax}
        onChange={handleInputChange}
      >
      </input>
      <Link href="./faq#WhatIsACronSyntaxCronPattern"><a>Cron Syntax Help in FAQ</a></Link>

    </div>
    <div>
      continue loops,  until<br />

      <input
        placeholder="choose a time"
        value={taskDetail.endLocalMinuteString}
        data-input-index="1"
        onChange={handleInputChange}
        type="datetime-local"
        min={taskDetail.startLocalMinuteString}
        max={taskDetail.endLocalMinuteString}
      >
      </input>
    </div>
    <div>
      <MonacoEditor defaultValue={editorValue.createTaskDefaultValue}></MonacoEditor>
      {/* <MonacoEditor defaultValue={'111' + editorValue.createTaskDefaultValue }></MonacoEditor> */}
    </div>
    <div>
      <button data-btn-index="0" onClick={handleBtnClick} disabled={!taskDetail.cronPassed}>Create Now</button>
    </div>
    <div>
      <Link href="./login"><a>Go Back to user center</a></Link>
    </div>
  </>);
}

export default CreateTaskGeekPage