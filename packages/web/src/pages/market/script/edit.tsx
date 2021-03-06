import type { NextPage } from 'next'
import { ChangeEvent, useEffect, MouseEvent } from 'react';
// @ts-ignore
import { ESMLoader } from "@webest/web-page-monitor-esm-loader"

import { sampleFunctionCreateScript1, sampleFunctionCreateScript2, sampleFunctionCreateScript3 } from '@webest/web-page-monitor-helper';


import { monacoEditorAtom, createScriptDetailAtom, userInfoAtom } from '../../../atoms';
import { useImmerAtom } from 'jotai/immer';
import { useResetAtom } from 'jotai/utils'


import Head from 'next/head'
import styles from '../../../styles/modules/market.module.scss'
import Link from 'next/link'
import { useI18n,genClassNameAndString, fetchAPI, useAPI, innerHTML, useHeadTitle } from '../../../helpers'
import Cookies from 'js-cookie'
import nextConfig from "../../../../next.config"

import dynamic from 'next/dynamic'
const MonacoEditor = dynamic(
  () => import('../../../components/monacoEditor'),
  { ssr: false }
)

const Market: NextPage = () => {
  // https://nextjs.org/docs/migrating/from-react-router#nested-routes
  const { t, router } = useI18n();
  let [cn, cs] = genClassNameAndString(styles);
  const [editorValue, setEditorValue] = useImmerAtom(monacoEditorAtom);
  const [userInfo] = useImmerAtom(userInfoAtom);
  const [scriptDetail, setScriptDetail] = useImmerAtom(createScriptDetailAtom);
  const resetScriptDetail = useResetAtom(createScriptDetailAtom)
  const resetEditorValue = useResetAtom(monacoEditorAtom)
  let headTitle = useHeadTitle('Edit Script');

  // update input date when first entry
  async function firstInit() {
    resetScriptDetail();
    resetEditorValue();
    if(router.query.id){
      console.log(router.query.id)
      let script: any = [];
      // TODO pagination
      script = await fetchAPI(`/market/script?id=${router.query.id}`) 
      setScriptDetail((v) => {
        if(script && script.length === 1){
          v.alias = script[0].alias;
          if(script[0]._id){
            v._id = script[0]._id;
          }
          if(userInfo._id !== script[0].userId){
            v.readonly = true;
          }
        }
      });
      setEditorValue((v) => {
        if(script && script.length === 1){
          v.value = script[0].value;
        }
      });
    }else{
      setScriptDetail((v) => {
        v.alias = (Math.floor(Date.now())).toString(36).toUpperCase();
      })
    }

  }
  useEffect(() => {
    firstInit();
  },[router.query]);

  async function handleBtnClick(ev: MouseEvent<HTMLButtonElement> ) {
    ev.preventDefault()
    setScriptDetail(v =>{
      v.submitting = true;
    })
    console.log(editorValue);
    console.log(scriptDetail.alias)
    console.log(userInfo)
    if(!editorValue.value){
      alert(t('Please modify the example code!'));
      return
    }
    if(String(editorValue.value).length > 5000){
      alert(t('Script length too long! need <= 5000 characters'));
      return
    }
    let customScriptModule;
    try {
      customScriptModule = await ESMLoader(editorValue.value);
    } catch (error) {
      alert(t('Please check the script!'));
      return;
    }
    // TODO auth module in frontend
    // and backend
    let domainArr = [];
    if(customScriptModule.urlRegExpArr && customScriptModule.urlRegExpArr.length){
      domainArr = customScriptModule.urlRegExpArr.map(v =>{
        return new URL('http://' + v).hostname
      });
    }
    let resp;
    try {
      resp = await fetchAPI('/market/script', {
        scriptDetail:{
          _id: scriptDetail._id,
          alias: scriptDetail.alias,
          value: editorValue.value,
          userId: userInfo._id,
          domainArr,
        }
      });
      if( (resp && resp.ok && resp.value) || resp.acknowledged){
        alert(t(`${router.query.id ? 'Update' : 'Create'} script success!, will go to script list page`));
        router.push('/market/script/list')
      }else{
        alert(t(`Create Error: Network issue or exceed max script number`));
      }
    } catch (error) {
      alert(t(`Create Error: ${error.message}`));
    }
    return true;
  }
  function handleInputChange(ev: ChangeEvent<HTMLInputElement>) {
    let inputElement = ev.target;
    let index = inputElement.dataset.inputIndex;
    console.log(index, inputElement.value);
    if (index === '0') {
      setScriptDetail(v =>{
        v.alias = inputElement.value;
      })
    }
  }

  function handleSelectChange(ev: ChangeEvent<HTMLSelectElement>) {
    let selectEle = ev.target;
    console.log(selectEle.value);
    let crossHelper = {
      sampleFunctionCreateScript1,
      sampleFunctionCreateScript2,
      sampleFunctionCreateScript3,
    }
    setEditorValue(v =>{
      // v.searchKey = selectEle.value;
      v.value = crossHelper['sampleFunctionCreateScript'+selectEle.value];
    })
  }
  return (
    <main>
      {headTitle}
      <div>
        <Link prefetch={false} href={ '/market/script/list'}>
          <a>{ t(`Go back to Market home`)}</a>
        </Link>
      </div>
      {
        scriptDetail.readonly && (
          <div style={{zoom: 1.1}}>
            You are in readonly mode now!!
          </div>
        )
      }
      <section className='create'>
        {
          router.query.id ? (
            <div>
              {t(`Script Unique ID`)} : &nbsp; <br/>
              <input className='consolas' data-input-index="-1" value={scriptDetail._id || ''} placeholder='script id' disabled />
            </div>
          ) : (
            <div style={{zoom: 1.1}}
              {...innerHTML(t(`Notice: All scripts you created will be <strong>public</strong>, you can only modify your own scripts.`))}
              >
            </div>
          )
        }
        <div>
          {router.query.id ? t(`You can modify the script name, or keep its name same as before`) 
            : t(`Please input a script name, or keep it empty to use the default name`)} :  <br/>
          <input disabled={scriptDetail.readonly} className='consolas' data-input-index="0" value={scriptDetail.alias} placeholder='script name' onChange={handleInputChange} />
        </div>
        <div>
          {router.query.id ? null 
            : (
              <select name="searchKey" id="searchKey"
                onChange={handleSelectChange}
              >
                <option value="">--{t(`Please choose an example`)}--</option>
                <option value="1">{t(`DOM eraser`)}</option>
                <option value="2">{t(`RegExp result replace eraser`)}</option>
                <option value="3">{t(`one file, two type eraser`)}</option>
              </select>
            )
          }
        </div>
        <div>
          <MonacoEditor 
            defaultValue={editorValue.value || editorValue.createScriptDefaultValue}
            value={editorValue.value || editorValue.createScriptDefaultValue}
            ></MonacoEditor>
        </div>
        <div>
          <button disabled={scriptDetail.readonly || scriptDetail.submitting} onClick={handleBtnClick}>{router.query.id ? t(`Update`) : t(`Create Script Now`)}</button>
        </div>
      </section>
    </main>
  );
}

export default Market;