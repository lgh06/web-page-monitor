import { NextPage } from "next/types";
import { ChangeEvent, useEffect, MouseEvent } from 'react';
import { useAtom } from 'jotai';
import { useImmerAtom } from 'jotai/immer';
import { useResetAtom, RESET } from 'jotai/utils'

import { createTaskDetailAtom, monacoEditorAtom, userInfoAtom } from '../../atoms';
import { CronTime } from '@webest/web-page-monitor-helper';
import { fetchAPI, useI18n, innerHTML, mergeToTarget, useHeadTitle } from "../../helpers/index";
import Link from "next/link";

import dynamic from 'next/dynamic'
import { ESMLoader } from "@webest/web-page-monitor-esm-loader"

const MonacoEditor = dynamic(
  () => import('../../components/monacoEditor'),
  { ssr: false }
)


let mergeTaskValueFunc = (initValue, dbValue) =>{
  return dbValue ? dbValue : initValue;
}

const TaskEditCustomPage: NextPage = () => {

  const [taskDetail, setTaskDetail] = useImmerAtom(createTaskDetailAtom);
  const [editorValue, setEditorValue] = useImmerAtom(monacoEditorAtom);

  const [,setOneTaskDetail] = useAtom(createTaskDetailAtom);
  const [userInfo, setUserInfo] = useImmerAtom(userInfoAtom);
  const { t, router } = useI18n();
  const resetTaskDetail = useResetAtom(createTaskDetailAtom)
  let headTitle = useHeadTitle('Edit Custom Task');


  // update input date when first entry
  async function firstInit() {
    resetTaskDetail();
    if(router.query.id){ // edit
      let script: any = [];
      // TODO pagination
      script = await fetchAPI(`/task?id=${router.query.id}`) 
      let oneTask = script[0];
      setOneTaskDetail(mergeToTarget(taskDetail,oneTask, mergeTaskValueFunc));
      console.log(oneTask._id, oneTask)
      setTaskDetail(v => {
      })
      setEditorValue(v =>{
        v.value = oneTask.customScript
      })
    }else{ // create
      setTaskDetail(v => {
        v.mode = 'custom'; // this page for custom mode
        let nowDate = new Date();
        v.extra.detectMode = ""

      })
    }
  }

  // auth script inputs and post to server
  async function handleBtnClick(ev: MouseEvent<HTMLButtonElement> ) {
    ev.preventDefault()
    setTaskDetail(v => {
      v.submitting = true;
    });
    console.log(taskDetail._id, editorValue.value)
    // console.log(userInfo)
    let userId = userInfo._id;
    let preCheckErrorInfo = null;
    if(!editorValue.value){
      preCheckErrorInfo = 'Please modify the example code!';
    }else if(String(editorValue.value).length > 5000){
      preCheckErrorInfo = 'Custom script chars cannot > 5000';
    }
    if(preCheckErrorInfo){
      setTaskDetail(v =>{
        v.submitting = false;
      });
      alert(t(preCheckErrorInfo));
      return
    }
    let customScriptModule;
    try {
      customScriptModule = await ESMLoader(editorValue.value);
    } catch (error) {
      console.log(error)
      alert(t('Please check the script!'));
      setTaskDetail(v =>{v.submitting = false;})
      return;
    }
    if(customScriptModule 
        && customScriptModule.cronSyntax 
        && customScriptModule.endTime
        && customScriptModule.exec
        && Number.isInteger(customScriptModule.endTime)
        && customScriptModule.endTime < Date.now() + 3600 * 1000 * 24 * 30
      ){
        console.log(customScriptModule);
        // customScriptModule.exec({})
    }else{
      alert(t('Please check the script!'));
      setTaskDetail(v =>{v.submitting = false;})
      return;
    }
    // return;
    let resp;
    try {
      if(router.query.id && taskDetail._id && router.query.id === taskDetail._id){
        // edit an existing task
        console.log('edit an existing task')
        resp = await fetchAPI('/task', {
          taskDetail: {
            ...taskDetail,
            customScript: editorValue.value,
          },

        })
      }else{
        // create a new task
        resp = await fetchAPI('/task', {
          taskDetail: {
            ...taskDetail,
            userId,
            customScript: editorValue.value,
            mode: 'custom', // this page is custom mode.
          }
        })
      }
      if(resp.ok || resp.acknowledged){
        alert(t(`Success. You will be redirected to task list page.
Also, you can close our page, your task will keep running until `) + CronTime.toLocalISOString(customScriptModule.endTime));
        router.push("/task/list");
      }else{
        alert(t(`Create Error: Network issue or exceed max task number`));
      }
    } catch (error) {
      alert(t(`Create Error: ${error.message}`));
    }
    setTaskDetail(v =>{v.submitting = false;})

  }

  useEffect(() => {
    if(router.isReady){
      firstInit();
    }
  }, [router.query]);

  function btnDisabled(){
    return !(
      taskDetail.submitting === false 
    );
  }
  
  return (<main>
    {headTitle}
    <style jsx>{`
      div > input + a {
        margin-left: 3em;
      }
      @media (max-width: 768px) {
        div > input + a {
          margin-left: 1.2em;
        }
      }
    `}</style>
    <div>
      <Link prefetch={false} href="/login"><a>{t('Go back to user center')}</a></Link>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Link prefetch={false} href="/market/script/list"><a>{t('Go to script market')}</a></Link>
    </div>
    <div>
      <MonacoEditor 
            defaultValue={editorValue.value || editorValue.createCustomTaskDefaultValue}
            value={editorValue.value || editorValue.createCustomTaskDefaultValue}
        ></MonacoEditor>
    </div>
    <br/>
    <div {...innerHTML(t('Notice: One user can create max 5 tasks, and lasts max <b>7 days</b> (<b>30 days</b> if your points > 80) per task.\
      Minimum interval between two tasks is 10 minutes.'))}>
    </div>
    <div {...innerHTML(t('Notice: We need 15 minutes to distribute our tasks to different servers. <br/>\
      the first repeated task within 15 minutes will be ignored.'))}>
    </div>
    <div style={{zoom: 0.85}}>
      <a target="_blank" rel="noopener noreferrer" href={t("https://docs.webpagemonitor.net/FAQ/") + 'custom_mode/'} >{t(`More helps see here`)}</a>
    </div>
    <br />
    <div>
      <button data-btn-index="0" onClick={handleBtnClick} disabled={btnDisabled()}>{router.query.id ? t(`Update`) : t('Create Now')}</button>
    </div>
  </main>);
}

export default TaskEditCustomPage