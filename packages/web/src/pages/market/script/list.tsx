import type { NextPage } from 'next'
import { ChangeEvent, useEffect, MouseEvent, useMemo } from 'react';
// @ts-ignore
import { ESMLoader } from "@webest/web-page-monitor-esm-loader"

import { monacoEditorAtom, createScriptDetailAtom, userInfoAtom } from '../../../atoms';
import { useImmerAtom } from 'jotai/immer';

import Head from 'next/head'
import styles from '../../../styles/modules/market.module.scss'
import Link from 'next/link'
import { useI18n,genClassNameAndString, fetchAPI, useAPI } from '../../../helpers'
import {  ScriptList } from '../../../components/scriptList';
import Cookies from 'js-cookie'
import nextConfig from "../../../../next.config"
import type { Row } from "react-table"

const Market: NextPage = () => {
  // https://nextjs.org/docs/migrating/from-react-router#nested-routes
  const { t, locale, router } = useI18n();
  let [cn, cs] = genClassNameAndString(styles);
  const [userInfo] = useImmerAtom(userInfoAtom);
  const [scriptDetail, setScriptDetail] = useImmerAtom(createScriptDetailAtom);


  // update input date when first entry
  async function firstInit() {
    let scriptList: any = [];
    // TODO pagination
    scriptList = await fetchAPI(`/market/script?userId=${userInfo._id}`) 
    setScriptDetail((v) => {
      if(scriptList.length){
        v.scriptList = scriptList;
      }
    });
  }
  useEffect(() => {
    firstInit();
  },[router.query]);

  async function handleBtnClick(ev: MouseEvent<HTMLButtonElement> ) {
    ev.preventDefault()

    return true;
  }

  async function handleBtnDelete(ev: MouseEvent<HTMLButtonElement> ) {
    ev.preventDefault();
    let element = ev.target;
    let rowId = (element as any).dataset.rowId;
    let confirmed = confirm(t('Are you sure to delete this script') + '?');
    console.log(rowId, confirmed)
    let resp = await fetchAPI(`/market/script?id=${rowId}`, null , 'DELETE')
    window.location.reload();
    return false;
  }
  function handleInputChange(ev: ChangeEvent<HTMLInputElement>) {
    let inputElement = ev.target;
    let index = inputElement.dataset.inputIndex;
    console.log(index, inputElement.value);

  }

  let meColumns = useMemo(() => [
    {
      Header: 'alias',
      accessor: 'alias',
    },
    {
      Header: 'urlRegExpArr',
      accessor: 'urlRegExpArr',
    },
    {
      Header: 'Edit / View / Delete',
      id: 'editOrView',
      Cell: ({ row: {original: or} }) => {
        return (<div style={{
          display: 'flex',
        }}>
          <Link href={'/market/script/edit?id=' + or._id}>
            <a className='btn'>{t(`Edit`)}</a>
          </Link>
          <button data-row-id={or._id} onClick={handleBtnDelete} style={{marginLeft: '10px'}}>{t(`Delete`)}</button>
        </div>
        )
      }
    },
  ],[]);

  return (
    <main>
      <div>
        {
          scriptDetail.scriptList.length < 3 ? (
            <>
              <Link href={'/market/script/edit'}>
                <a>{t(`Create a script`)}</a>
              </Link>&nbsp;&nbsp;&nbsp;&nbsp;
            </>
          ) : null
        }
        
        <Link href="/create_task_simp">
          <a>{t('Go to task create simple mode')}</a>
        </Link>
      </div>
      <div>
        Scripts created by you :
      </div>
      <section className='list'>
        <ScriptList 
          columns={ meColumns }  
          data={scriptDetail.scriptList}
        ></ScriptList>
      </section>
      <div>
        <input type="text" placeholder='Please Input a domain or URL to search' />
        <button>Search a public script</button>
      </div>
    </main>
  );
}

export default Market;