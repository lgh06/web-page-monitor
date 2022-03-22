
import type { NextPage } from 'next'
import Head from 'next/head'
// import Image from 'next/image'
import styles from '../styles/modules/navHeader.module.scss'
import Link from 'next/link'
import { useI18n, genClassNameAndString } from '../helpers'
import nextConfig from "../../next.config"
import { userInfoAtom } from '../atoms';
import { useImmerAtom } from 'jotai/immer'
import { useEffect, useState } from 'react'
import type { FunctionComponent } from 'react'

type Props = {
  test?: string
}
const [cn,cs] = genClassNameAndString(styles);

const NavHeader: FunctionComponent<Props> = ({ test }) => {
  const { t } = useI18n();
  const [userInfo] = useImmerAtom(userInfoAtom);
  return <>
  <header {...cn('nav-header')} >
    <div {...cn('wrap')}>
      <input type="checkbox" id="nav-button" />
      <label htmlFor="nav-button">{t(`Menu`)}</label>
      <ul>
        <li>
          <Link prefetch={false} href="/">
          <a>{t(`Home`)}</a>
          </Link>
        </li>
        {
          userInfo.email ? (<>
            <li>
              <Link prefetch={false} href="/login"><a>{t(`User Center`)}</a></Link>
            </li>
            <li>
              <Link prefetch={false} href="/task/list"><a>{t(`Task List`)}</a></Link>
            </li>
            <li>
              <Link prefetch={false} href="/market/script/list"><a>{t(`Script Market`)}</a></Link>
            </li>
          </>) : null
        }
        <li>
          <Link prefetch={false} href="/faq">
            <a>{t(`FAQ`)}</a>
          </Link>
        </li>
        <li>
          <Link prefetch={false} href="/about">
            <a>{t(`About`)}</a>
          </Link>
        </li>
      </ul>
    </div>
  </header>
  </>
}

export { NavHeader, NavHeader as default }