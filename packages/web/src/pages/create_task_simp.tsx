import { NextPage } from "next/types";
import { ChangeEvent, useEffect, MouseEvent } from 'react';
import { useImmerAtom } from 'jotai/immer';
import { createTaskDetailAtom, monacoEditorAtom, userInfoAtom } from '../atoms';
import { CronTime } from '@webest/web-page-monitor-helper';
import { fetchAPI } from "../helpers/index";
import Link from "next/link";


const CreateTaskGeekPage: NextPage = () => {

  const [taskDetail, setTaskDetail] = useImmerAtom(createTaskDetailAtom);
  const [userInfo, setUserInfo] = useImmerAtom(userInfoAtom);

  // update input date when first entry
  function updateDate() {
    setTaskDetail(v => {
      v.mode = 'simp'; // this page for simp-le mode
      let nowDate = new Date();
      // TODO different type user, diff end time
      v.endLocalMinuteString = CronTime.toLocalISOString(nowDate, 7*60*24);
      v.endTime = new Date(v.endLocalMinuteString).valueOf()
      v.startLocalMinuteString = CronTime.toLocalISOString(nowDate, 10);
    })
  }

  function handleInputChange(ev: ChangeEvent<HTMLInputElement>) {
    let inputElement = ev.target;
    let index = ev.target.dataset.inputIndex;
    if (index === '0') {
      setTaskDetail(v => {
        v.cronSyntax = inputElement.value;
      });
      let passed = false, errorMsg = '';
      if(String(inputElement.value).includes('/')){
        [passed, errorMsg] = [false, 'Please remove / in your syntax, see FAQ for details']
      }else{
        let nextArr = CronTime.getNextTimes(inputElement.value);
        [passed, errorMsg] = CronTime.checkTimes(nextArr);
        // console.log(nextArr, passed, errorMsg)
      }
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
        v.endTime = new Date(dtISO).valueOf()
      })
    }
    if (index === '2') {
      setTaskDetail(v => {
        v.pageURL = inputElement.value;
      })
      // console.log(nextArr, passed, errorMsg)
      let str = String(inputElement.value);
      let passed = (str.startsWith('https://') || str.startsWith('http://')) && str.match(/http.+\..+/);
      if (passed) {
        setTaskDetail(v => {
          v.pageURLPassed = true;
          v.pageURLMsg = 'URL check passed. ';
        })
      } else {
        setTaskDetail(v => {
          v.pageURLPassed = false;
          v.pageURLMsg = 'Please input a valid URL';
        })
      }
    }
    if(index === '3'){
      setTaskDetail(v => {v.cssSelector = inputElement.value})
    }
  }

  async function handleBtnClick(ev: MouseEvent<HTMLButtonElement> ) {
    ev.preventDefault()
    // let data = await fetchAPI('/task/create_task', {test: "string one"});
    // console.log(data)
    console.log(taskDetail)
    console.log(userInfo)

    return true;
  }

  useEffect(() => {
    updateDate();
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
        <Link href="/faq#WhatIsACronSyntaxCronPattern"><a>Cron Syntax Help in FAQ</a></Link>
    </div>
    <div>continue loops,  until<br />
      <input
        placeholder="choose a end time. from ten minutes later to 7 days later."
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
      {/* input page URL <br /> */}
      {taskDetail.pageURLMsg}<br/>
      <input
        placeholder="page URL"
        data-input-index="2"
        value={taskDetail.pageURL}
        onChange={handleInputChange}
      >

      </input>
    </div>
    <div>
      Please input a CSS selector, if you do not know what that is, kee it as default &quot;body&quot;<br/>
      <input
        placeholder="CSS selector"
        data-input-index="3"
        value={taskDetail.cssSelector}
        onChange={handleInputChange}
      >

      </input>
    </div>
    <div>
      <button data-btn-index="0" onClick={handleBtnClick} disabled={!(taskDetail.cronPassed && taskDetail.pageURLPassed)}>Create Now</button>
    </div>
    <div>
      <Link href="/login"><a>Go back to user center</a></Link>
    </div>
  </>);
}

export default CreateTaskGeekPage