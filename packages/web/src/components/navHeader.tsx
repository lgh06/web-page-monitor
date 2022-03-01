
import type { NextPage } from 'next'
import Head from 'next/head'
// import Image from 'next/image'
import styles from '../styles/modules/navHeader.module.scss'
import Link from 'next/link'
import { useI18n, verifyJwt, logOut, genClassNameAndString } from '../helpers'
import nextConfig from "../../next.config"
import { userInfoAtom } from '../atoms';
import { useImmerAtom } from 'jotai/immer'
import { useEffect, useState, FunctionComponent } from 'react'

type Props = {
  test?: string
}
const [cn,cs] = genClassNameAndString(styles);

const NavHeader: FunctionComponent<Props> = ({ test }) => {
  const { t } = useI18n();
  const [userInfo] = useImmerAtom(userInfoAtom);
  return <>
  <div {...cn('nav-header')} >
    <div {...cn('wrap')}>
      <input type="checkbox" id="nav-button" />
      <label htmlFor="nav-button">Menu</label>
      <ul>
        <li>
          <Link href="/">
          <a>{t(`Home`)}</a>
          </Link>
        </li>
        {
          userInfo.email ? (<>
            <li>
              <Link href="/login"><a>{t(`User Center`)}</a></Link>
            </li>
            <li>
              <Link href="/create_task_simp"><a>{t(`Create a task in Simple Mode`)}</a></Link>
            </li>
            <li>
              <Link href="/market/script/list"><a>{t(`Script Market`)}</a></Link>
            </li>
          </>) : null
        }
        <li>
          <Link href="/faq">
            <a>{t(`FAQ`)}</a>
          </Link>
        </li>
      </ul>
    </div>
  </div>
  </>
}

export { NavHeader, NavHeader as default }