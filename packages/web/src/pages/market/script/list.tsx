import type { NextPage } from 'next'
import { ChangeEvent, useEffect, MouseEvent, useMemo } from 'react';

import { monacoEditorAtom, createScriptDetailAtom, userInfoAtom } from '../../../atoms';
import { useImmerAtom } from 'jotai/immer';

import Head from 'next/head'
import styles from '../../../styles/modules/market.module.scss'
import Link from 'next/link'
import { useI18n,genClassNameAndString, fetchAPI, useAPI, useHeadTitle } from '../../../helpers'
import {  ScriptList } from '../../../components/scriptList';
import Cookies from 'js-cookie'
import nextConfig from "../../../../next.config"
import type { Row } from "react-table"

const Market: NextPage = () => {
  // https://nextjs.org/docs/migrating/from-react-router#nested-routes
  const { t, router, locale } = useI18n();
  let [cn, cs] = genClassNameAndString(styles);
  const [userInfo] = useImmerAtom(userInfoAtom);
  const [scriptDetail, setScriptDetail] = useImmerAtom(createScriptDetailAtom);
  let headTitle = useHeadTitle('Script Market');


  // update input date when first entry
  async function firstInit() {
    let scriptList: any = [];
    // TODO pagination
    scriptList = await fetchAPI(`/market/script?userId=${userInfo._id}`) 
    setScriptDetail((v) => {
      if(scriptList.length){
        v.scriptList = scriptList;
      }
      v.publicScriptList = []
    });
  }
  useEffect(() => {
    firstInit();
  },[router.query]);

  async function handleBtnSearch(ev: MouseEvent<HTMLButtonElement> ) {
    if(!scriptDetail.searchKey){
      alert(t('Please select a search field:'));
    }
    let publicScriptList: any = [];
    // TODO pagination
    publicScriptList = await fetchAPI(`/market/script?${scriptDetail.searchKey}=${scriptDetail.searchValue}`) 
    setScriptDetail((v) => {
      v.publicScriptList = publicScriptList;
    });
  }

  async function handleBtnDelete(ev: MouseEvent<HTMLButtonElement> ) {
    ev.preventDefault();
    let element = ev.target;
    let rowId = (element as any).dataset.rowId;
    let confirmed = confirm(t('Are you sure to delete this script') + '?');
    if(!confirmed){
      return;
    }
    let resp = await fetchAPI(`/market/script?id=${rowId}`, null , 'DELETE')
    window.location.reload();
    return false;
  }
  function handleSelectChange(ev: ChangeEvent<HTMLSelectElement>) {
    let selectEle = ev.target;
    console.log(selectEle.value);
    setScriptDetail(v =>{
      v.searchKey = selectEle.value;
    })
  }

  function handleInputChange(ev: ChangeEvent<HTMLInputElement>){
    let inputEle = ev.target;
    console.log(inputEle.value);
    setScriptDetail(v =>{
      v.searchValue = inputEle.value;
    })
  }

  let meColumns = useMemo(() => [
    {
      Header: 'ID',
      accessor: '_id',
    },
    {
      Header: t('domains applied to'),
      accessor: 'domainArr',
    },
    {
      Header: t('Edit / Delete'),
      id: 'editOrView',
      Cell: ({ row: {original: or} }) => {
        return (<div style={{
          display: 'flex',
        }}>
          <Link prefetch={false} href={'/market/script/edit?id=' + or._id}>
            <a className='btn'>{t(`Edit`)}</a>
          </Link>
          <button data-row-id={or._id} onClick={handleBtnDelete} style={{marginLeft: '10px'}}>{t(`Delete`)}</button>
        </div>
        )
      }
    },
  ],[locale]);

  let publicColumns = useMemo(() => [
    {
      Header: t('alias'),
      accessor: 'alias',
    },
    {
      Header: t('domains applied to'),
      accessor: 'domainArr',
    },
    {
      Header: t('View'),
      id: 'editOrView',
      Cell: ({ row: {original: or} }) => {
        return (<div style={{
          display: 'flex',
        }}>
          <Link prefetch={false} href={'/market/script/edit?id=' + or._id}>
            <a className='btn'>{t(`View`)}</a>
          </Link>
        </div>
        )
      }
    },
  ],[locale]);

  return (
    <main>
      {headTitle}
      <div>
        <Link prefetch={false} href="/task/edit_simp">
          <a>{t('Back to create task simple mode')}</a>
        </Link>
        &nbsp;&nbsp;
        {
          (scriptDetail.scriptList.length && scriptDetail.scriptList.length) < 3 ? (
            <>
              <Link prefetch={false} href={'/market/script/edit'}>
                <a>{t(`Create a script`)}</a>
              </Link>&nbsp;&nbsp;&nbsp;&nbsp;
            </>
          ) : null
        }
        
      </div>
      <h3>
        {t(`Scripts created by you`)} :
      </h3>
      <ScriptList 
        columns={ meColumns }  
        data={scriptDetail.scriptList}
      ></ScriptList>
      <h3>
      {t(`Public Scripts`)} : 
      </h3>
      <div>
        <select name="searchKey" id="searchKey"
          onChange={handleSelectChange}
        >
          <option value="">--{t(`Please choose an field to search`)}--</option>
          <option value="id">{t(`script id`)}</option>
          <option value="alias">{t(`script alias`)}</option>
          <option value="domain">{t(`domain`)}</option>
        </select>
        <input type="text" placeholder={t('Please Input')} 
          onChange={handleInputChange}
        />
        <button disabled={!(scriptDetail.searchKey && scriptDetail.searchValue)} onClick={handleBtnSearch}>{t(`Search a public script`)}</button>
      </div>
      <ScriptList 
        columns={ publicColumns }  
        data={scriptDetail.publicScriptList}
      ></ScriptList>
    </main>
  );
}

export default Market;