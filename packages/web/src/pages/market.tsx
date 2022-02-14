import type { NextPage } from 'next'
import Head from 'next/head'
// import Image from 'next/image'
import styles from '../styles/modules/Home.module.scss'
import Link from 'next/link'
import { useI18n } from '../helpers'
import Cookies from 'js-cookie'
import nextConfig from "../../next.config"

const Market: NextPage = () => {
  return (
    <main>
      <div>
        <button>Create a eraser</button>
      </div>
      <div>
        <input type="text" placeholder='Please Input a domain or URL to search' />
        <button>Search a eraser</button>
      </div>
    </main>
  );
}

export default Market;