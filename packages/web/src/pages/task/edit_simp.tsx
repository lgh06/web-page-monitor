import { NextPage } from "next/types";
import { ChangeEvent, useEffect, MouseEvent } from 'react';
import { useAtom } from 'jotai';
import { useImmerAtom } from 'jotai/immer';
import { useResetAtom, RESET } from 'jotai/utils'

import { createTaskDetailAtom, monacoEditorAtom, userInfoAtom } from '../../atoms';
import { CronTime } from '@webest/web-page-monitor-helper';
import { fetchAPI, useI18n, innerHTML, mergeToTarget, useHeadTitle } from "../../helpers/index";
import Link from "next/link";


let mergeTaskValueFunc = (initValue, dbValue) =>{
  return dbValue ? dbValue : initValue;
}

const TaskEditSimpPage: NextPage = () => {

  const [taskDetail, setTaskDetail] = useImmerAtom(createTaskDetailAtom);
  const [,setOneTaskDetail] = useAtom(createTaskDetailAtom);
  const [userInfo, setUserInfo] = useImmerAtom(userInfoAtom);
  const { t, router } = useI18n();
  const resetTaskDetail = useResetAtom(createTaskDetailAtom)
  let headTitle = useHeadTitle('Edit Task');


  // update input date when first entry
  async function firstInit() {
    resetTaskDetail();
    if(router.query.id){
      let script: any = [];
      // TODO pagination
      script = await fetchAPI(`/task?id=${router.query.id}`) 
      let oneTask = script[0];
      setOneTaskDetail(mergeToTarget(taskDetail,oneTask, mergeTaskValueFunc));
      console.log(oneTask._id, oneTask)
      setTaskDetail(v => {

        let nowDate = new Date();
        let endTimeDate = new Date(oneTask.endTime)
        v.endTime = endTimeDate.valueOf();
        v.endLocalMinuteString = CronTime.toLocalISOString(endTimeDate);
        v.startLocalMinuteString = CronTime.toLocalISOString(nowDate, 10);
        v.endMaxLocalMinuteString = CronTime.toLocalISOString(nowDate, 7*60*24);

      })
    }else{
      setTaskDetail(v => {
        v.mode = 'simp'; // this page for simp-le mode
        let nowDate = new Date();
        // TODO different type user, different end time
        v.endLocalMinuteString = CronTime.toLocalISOString(nowDate, 7*60*24);
        v.endMaxLocalMinuteString = CronTime.toLocalISOString(nowDate, 7*60*24);
        v.endTime = new Date(v.endLocalMinuteString).valueOf()
        v.startLocalMinuteString = CronTime.toLocalISOString(nowDate, 10);
        v.extra.alias = (Math.floor(nowDate.valueOf())).toString(36).toUpperCase();
      })
    }
  }

  function handleInputChange(ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    let inputElement = ev.target;
    let index = ev.target.dataset.inputIndex;
    if (index === '0') {
      setTaskDetail(v => {
        v.cronSyntax = inputElement.value;
      });
      let passed = false, errorMsg = [''];
      if(String(inputElement.value).includes('/')){
        [passed, errorMsg] = [false, ['Please remove / in your syntax, see FAQ for details']]
      }else{
        let nextArr = CronTime.getNextTimes(inputElement.value);
        [passed, errorMsg] = CronTime.checkTimes(nextArr);
      }
      if (passed) {
        setTaskDetail(v => {
          v.cronPassed = true;
          v.cronMsg = 'Cron syntax check passed.';
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
    if(index === '4' || index === '5'){
      setTaskDetail(v =>{
        v.extra.detectMode = String(inputElement.value)
      })
    }
    if(index === '6'){
      setTaskDetail(v =>{
        v.extra.detectWord = String(inputElement.value);
      })
    }
    if(index === '7'){
      setTaskDetail(v =>{
        v.extra.alias = String(inputElement.value);
      });
    }
    if(index === '8'){
      setTaskDetail(v =>{
        let str = String(inputElement.value)
        if(str && str !== ''){
          v.extra.eraserArr = str.split('\n');
        }else{
          v.extra.eraserArr = [];
        }
      });
    }
  }

  async function handleBtnClick(ev: MouseEvent<HTMLButtonElement> ) {
    ev.preventDefault()
    setTaskDetail(v => {
      v.submitting = true;
    });
    console.log(taskDetail._id)
    // console.log(userInfo)
    let userId = userInfo._id;
    // return;
    let resp;
    try {
      if(router.query.id && taskDetail._id && router.query.id === taskDetail._id){
        // edit an existing task
        resp = await fetchAPI('/task', {
          taskDetail
        })
      }else{
        // create a new task
        resp = await fetchAPI('/task', {
          taskDetail: {
            userId,
            ...taskDetail,
            mode: 'simp', // this page is simp mode.
          }
        })
      }
      if(resp.ok || resp.acknowledged){
        router.push("/task/list");
      }else{
        alert(t(`Create Error: Network issue or exceed max task number`));
      }
    } catch (error) {
      alert(t(`Create Error: ${error.message}`));
    }
    console.log(resp);
    // return true;

  }

  useEffect(() => {
    if(router.isReady){
      firstInit();
    }
  }, [router.query]);

  function btnDisabled(){
    return !(
      taskDetail.cronPassed 
      && taskDetail.pageURLPassed 
      && (taskDetail.extra.detectMode === '2' ? taskDetail.extra.detectWord : true) 
      && taskDetail.cssSelector
      && taskDetail.extra.alias
      && taskDetail.extra.eraserArr.length <= 3
      && ( taskDetail.extra.eraserArr.length ? taskDetail.extra.eraserArr.every(v => (v.length === 24)) : true )
      && taskDetail.submitting === false
    );
  }
  
  return (<main>
    {headTitle}
    <style jsx>{`
      div > input + a {
        margin-left: 3em;
      }
    `}</style>
    <div>
      <Link href="/login"><a>{t('Go back to user center')}</a></Link>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Link href="/market/script/list"><a>{t('Go to script market')}</a></Link>
    </div>
    <br/>
    <div>
      {/* input cron syntax <br /> */}
      {t(taskDetail.cronMsg)}:<br/>
      <input
        placeholder="cron syntax"
        data-input-index="0"
        value={taskDetail.cronSyntax}
        onChange={handleInputChange}
      >
      </input>
        <Link href="/faq#WhatIsACronSyntaxCronPattern"><a>{t(`Cron Syntax Help in FAQ`)}</a></Link>
    </div>
    <div>{t(`Choose an end time, from 10 minutes later to 7 days later`)}:<br />
      <input
        value={taskDetail.endLocalMinuteString}
        data-input-index="1"
        onChange={handleInputChange}
        type="datetime-local"
        min={taskDetail.startLocalMinuteString}
        max={taskDetail.endMaxLocalMinuteString}
      >
      </input>
    </div>
    <div>
      {/* input page URL <br /> */}
      {t(taskDetail.pageURLMsg)}<br/>
      <input
        placeholder="page URL"
        data-input-index="2"
        value={taskDetail.pageURL}
        onChange={handleInputChange}
      >

      </input>
    </div>
    <div>
      {t(`Please input a CSS selector, if you do not know what that is, keep it as default "body"`)}:<br/>
      <input
        placeholder="CSS selector"
        data-input-index="3"
        value={taskDetail.cssSelector}
        onChange={handleInputChange}
      >

      </input>
    </div>
    <div>
    {t(`Please input an alias name of this task, or keep it as default`)}:<br/>
      <input
        placeholder="task alias name"
        data-input-index="7"
        value={taskDetail.extra.alias}
        onChange={handleInputChange}
        className="consolas"
      >
      </input>
    </div>
    <div>
    {t(`Notify you when`)}: <br/>
      <label htmlFor="detectMode1">
        <input data-input-index="4" type="radio" id="detectMode1" checked={taskDetail.extra.detectMode === '1'} name="detectMode" onChange={handleInputChange} value="1" />
        {t(`Page Changes`)}
      </label> <br/>
      <label htmlFor="detectMode2">
        <input data-input-index="5" type="radio" id="detectMode2" checked={taskDetail.extra.detectMode === '2'} name="detectMode" onChange={handleInputChange} value="2" />
        {t(`Word(s) Show up`)}
      </label>
      <input 
      data-input-index="6" 
      type="text" 
      placeholder={t(`Please input some words, multiple words can be separated by commas`) + ':'}
      value={taskDetail.extra.detectWord}
      onChange={handleInputChange}
      />
    </div>
    <div>
      {t(`Please input eraser script IDs`)}. &nbsp;
      {t(`One line one id, 3 erasers max`)}. &nbsp;
      {t(`You can find more erasers on Script Market`)} . &nbsp;
      <Link href="/faq#WhatIsEraserScript"><a>{t('Eraser Script in FAQ')}</a></Link>
       : <br/>
      <textarea data-input-index="8" value={taskDetail.extra.eraserArr.join('\n')} onChange={handleInputChange} name="erasers" id="erasers" cols={20} rows={3}></textarea>
    </div>
    <div {...innerHTML(t('Note: One user can only create max 3 tasks, and lasts max 7 days per task.\
      Minimum interval between two tasks is 10 minutes.'))}>
    </div>
    <div {...innerHTML(t('Note: Simple Mode is only suitable for monitor web pages,\
      not for txt, xml or other files without HTML structure.<br/>\
      Our Geek Mode will be coming soon, for more advanced features.'))}>
    </div>
    <div {...innerHTML(t('Note: We need 15 minutes to distribute our tasks to different servers. <br/>\
      the first repeated task within 15 minutes will be ignored.'))}>
    </div>
    <div>
      <button data-btn-index="0" onClick={handleBtnClick} disabled={btnDisabled()}>{router.query.id ? t(`Update`) : t('Create Now')}</button>
    </div>
  </main>);
}

export default TaskEditSimpPage