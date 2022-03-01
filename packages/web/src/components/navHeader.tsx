
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
  return <>
  <div {...cn('nav-header')} >
    <div {...cn('wrap')}>
          dasda

    </div>
  </div>
  </>
}

export { NavHeader, NavHeader as default }