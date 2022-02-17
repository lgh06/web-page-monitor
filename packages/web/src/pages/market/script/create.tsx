import type { NextPage } from 'next'
import { ChangeEvent, useEffect, MouseEvent } from 'react';
// @ts-ignore
import { ESMLoader } from "@webest/web-page-monitor-esm-loader"

import { monacoEditorAtom, createScriptDetailAtom, userInfoAtom } from '../../../atoms';
import { useImmerAtom } from 'jotai/immer';

import Head from 'next/head'
import styles from '../../../styles/modules/market.module.scss'
import Link from 'next/link'
import { useI18n,genClassNameAndString, fetchAPI, useAPI } from '../../../helpers'
import Cookies from 'js-cookie'
import nextConfig from "../../../../next.config"

import dynamic from 'next/dynamic'
const MonacoEditor = dynamic(
  () => import('../../../components/monacoEditor'),
  { ssr: false }
)

const Market: NextPage = () => {
  // https://nextjs.org/docs/migrating/from-react-router#nested-routes
  const { t, locale, router } = useI18n();
  let [cn, cs] = genClassNameAndString(styles);
  const [editorValue] = useImmerAtom(monacoEditorAtom);
  const [userInfo] = useImmerAtom(userInfoAtom);
  const [scriptDetail, setScriptDetail] = useImmerAtom(createScriptDetailAtom);


  // update input date when first entry
  async function firstInit() {
    setScriptDetail((v) => {
      v.alias = (Math.floor(Date.now())).toString(36).toUpperCase();
    })
  }
  useEffect(() => {
    firstInit();
  },[router.query]);

  async function handleBtnClick(ev: MouseEvent<HTMLButtonElement> ) {
    ev.preventDefault()
    console.log(editorValue);
    console.log(scriptDetail.alias)
    console.log(userInfo)
    if(!editorValue.value){
      alert(t('Please modify the example code!'));
      return
    }

    let customScriptModule = await ESMLoader(editorValue.value, window);
    let resp = await fetchAPI('/market/script', {
      scriptDetail:{
        alias: scriptDetail.alias,
        value: editorValue.value,
        userId: userInfo._id,
        urlRegExpArr: customScriptModule.urlRegExpArr,
      }
    })
    // TODO
    console.log(resp)
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

  return (
    <main>
      <div>
        <Link href={ '/market/script/list'}>
          <a>{ t(`Go back to Market home`)}</a>
        </Link>
      </div>
      <section className='create'>
        <div>
          {t(`Please input a script name, or keep it empty to use the default name`)}
          <input className='consolas' data-input-index="0" value={scriptDetail.alias} placeholder='script name' onChange={handleInputChange} />
        </div>
        <div>
          <MonacoEditor defaultValue={editorValue.createScriptDefaultValue}></MonacoEditor>
        </div>
        <div>
          <button onClick={handleBtnClick}>{t(`Create Script Now`)}</button>
        </div>
      </section>
    </main>
  );
}

export default Market;