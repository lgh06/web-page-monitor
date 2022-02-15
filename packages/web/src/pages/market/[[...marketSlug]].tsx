import type { NextPage } from 'next'
import { ChangeEvent, useEffect, MouseEvent } from 'react';

import { monacoEditorAtom } from '../../atoms';
import { useImmerAtom } from 'jotai/immer';

import Head from 'next/head'
import styles from '../../styles/modules/market.module.scss'
import Link from 'next/link'
import { useI18n,genClassNameAndString } from '../../helpers'
import Cookies from 'js-cookie'
import nextConfig from "../../../next.config"

import dynamic from 'next/dynamic'
const MonacoEditor = dynamic(
  () => import('../../components/monacoEditor'),
  { ssr: false }
)

let CreateSection = () =>{

}

const Market: NextPage = () => {
  // https://nextjs.org/docs/migrating/from-react-router#nested-routes
  const { t, locale, router } = useI18n();
  let [cn, cs] = genClassNameAndString(styles);
  const [editorValue] = useImmerAtom(monacoEditorAtom);

  let slugArr = router.query.marketSlug ? router.query.marketSlug : [];
  console.log(JSON.stringify(slugArr));

  async function handleBtnClick(ev: MouseEvent<HTMLButtonElement> ) {
    ev.preventDefault()
    console.log(editorValue);
    return true;
  }

  let createSection = (
    <section className='create'>
      <div>
        {t(`Please input a eraser name, or keep it empty to use the default name`)}
        <input type="text" placeholder='eraser name' />
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
        <Link href={slugArr.length ? '/market': '/market/create'}>
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