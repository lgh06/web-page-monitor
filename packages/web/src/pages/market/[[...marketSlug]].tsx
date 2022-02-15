import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../../styles/modules/market.module.scss'
import Link from 'next/link'
import { useI18n,genClassNameAndString } from '../../helpers'
import Cookies from 'js-cookie'
import nextConfig from "../../../next.config"

const Market: NextPage = () => {
  // https://nextjs.org/docs/migrating/from-react-router#nested-routes
  const { t, locale, router } = useI18n();
  let [cn, cs] = genClassNameAndString(styles);
  let slugArr = router.query.marketSlug ? router.query.marketSlug : [];
  console.log(JSON.stringify(slugArr));
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
        </div>
      </section>
      <section className='list'>

      </section>
    </main>
  );
}

export default Market;