import type { NextPage } from 'next'
import { ChangeEvent, useEffect, MouseEvent } from 'react';

import { monacoEditorAtom, createEraserDetailAtom } from '../../../atoms';
import { useImmerAtom } from 'jotai/immer';

import Head from 'next/head'
import styles from '../../../styles/modules/market.module.scss'
import Link from 'next/link'
import { useI18n,genClassNameAndString } from '../../../helpers'
import Cookies from 'js-cookie'
import nextConfig from "../../../../next.config"

import dynamic from 'next/dynamic'
const MonacoEditor = dynamic(
  () => import('../../../components/monacoEditor'),
  { ssr: false }
)

let CreateSection = () =>{

}

const Market: NextPage = () => {
  // https://nextjs.org/docs/migrating/from-react-router#nested-routes
  const { t, locale, router } = useI18n();
  let [cn, cs] = genClassNameAndString(styles);
  const [editorValue] = useImmerAtom(monacoEditorAtom);
  const [eraserDetail, setEraserDetail] = useImmerAtom(createEraserDetailAtom);

  let slugArr = router.query.marketSlug ? router.query.marketSlug : [];
  console.log(JSON.stringify(slugArr));

  // update input date when first entry
  function updateDate() {
    setEraserDetail(v => {
      v.alias = (Math.floor(Date.now())).toString(36).toUpperCase()
    })
  }
  useEffect(() => {
    updateDate();
  },[router.query]);

  async function handleBtnClick(ev: MouseEvent<HTMLButtonElement> ) {
    ev.preventDefault()
    console.log(editorValue);
    return true;
  }
  function handleInputChange(ev: ChangeEvent<HTMLInputElement>) {
    let inputElement = ev.target;
    let index = inputElement.dataset.inputIndex;
    console.log(index, inputElement.value);
    if (index === '0') {
      setEraserDetail(v =>{
        v.alias = inputElement.value;
      })
    }
  }

  let createSection = (
    <section className='create'>
      <div>
        {t(`Please input a eraser name, or keep it empty to use the default name`)}
        <input className='consolas' data-input-index="0" value={eraserDetail.alias} placeholder='eraser name' onChange={handleInputChange} />
      </div>
      <div>
        <MonacoEditor defaultValue={editorValue.createEraserDefaultValue}></MonacoEditor>
      </div>
      <div>
        <button onClick={handleBtnClick}>{t(`Create Eraser Now`)}</button>
      </div>
    </section>
  )


  return (
    <main>
      <div>
        <Link href={slugArr.length ? '/market/eraser': '/market/eraser/create'}>
          <a>{slugArr.length ? t(`Go back to Market home`) : t(`Create a eraser`)}</a>
        </Link>
      </div>
      {slugArr.length ? null : (
        <div>
          <input type="text" placeholder='Please Input a domain or URL to search' />
          <button>Search a eraser</button>
        </div>
      )}
      {slugArr[0] === 'create' ? createSection : null}
      <section className='list'>

      </section>
    </main>
  );
}

export default Market;