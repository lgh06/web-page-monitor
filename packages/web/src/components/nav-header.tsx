
import type { NextPage } from 'next'
import Head from 'next/head'
// import Image from 'next/image'
import styles from '../styles/modules/nav-header.module.scss'
import Link from 'next/link'
import { useI18n, verifyJwt, logOut } from '../helpers'
import nextConfig from "../../next.config"
import { userInfoAtom } from '../atoms';
import { useImmerAtom } from 'jotai/immer'
import { useEffect, useState, FunctionComponent } from 'react'

type Props = {
  test?: string
}

const NavHeader: FunctionComponent<Props> = ({ test }) => {
  return <>
  hi
  </>
}

export { NavHeader, NavHeader as default }