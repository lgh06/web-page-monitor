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


  return (
    <main>
      <div>
        <Link href={'/market/create'}>
          <a {...cn('@btn btn')}>Create a eraser</a>
        </Link>
      </div>
      <div>
        <input type="text" placeholder='Please Input a domain or URL to search' />
        <button>Search a eraser</button>
      </div>
      <section className='create'>
        <div>
          t(`Please input`)
          <input type="text" />
        </div>
        <div>
          <MonacoEditor defaultValue={editorValue.createEraserDefaultValue}></MonacoEditor>
        </div>
        <div>
          <button onClick={handleBtnClick}></button>
        </div>
      </section>
      <section className='list'>

      </section>
    </main>
  );
}

export default Market;