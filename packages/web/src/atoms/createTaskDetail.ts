import { atom } from 'jotai'

let createTaskDetail = {
  endLocalMinuteString: '',
  startLocalMinuteString: '',
  cronSyntax: '0 0 10,22 * * *',
  cronMsg: 'Please Input a cron syntax:',
  cronPassed: true,
  mode: 'simp',
  pageURL: 'https://news.qq.com/',
  pageURLMsg: 'please input a url start with https:// or http://',
  pageURLPassed: true,
  cssSelector: 'body'
}

export const createTaskDetailAtom = atom(createTaskDetail);
