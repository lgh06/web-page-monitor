import { atom } from 'jotai'

let createTaskDetail = {
  endLocalMinuteString: '',
  endTime: 0,
  startLocalMinuteString: '',
  cronSyntax: '0 20,50 * * * *', // 0 0 10,22 * * *
  cronMsg: 'Please Input a cron syntax:',
  cronPassed: true,
  mode: 'simp',
  pageURL: 'https://news.qq.com/',
  pageURLMsg: 'please input a url start with https:// or http://',
  pageURLPassed: true,
  cssSelector: 'body',
  detectMode: '1',
  detectWord: '',
}

export const createTaskDetailAtom = atom(createTaskDetail);
