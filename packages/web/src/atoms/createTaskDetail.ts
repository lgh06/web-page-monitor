import { atom } from 'jotai'

let createTaskDetail = {
  endLocalMinuteString: '',
  endMaxLocalMinuteString: '',
  endTime: 0,
  startLocalMinuteString: '',
  cronSyntax: '0 20,50 * * * *', // 0 0 10,22 * * *
  cronMsg: 'Please Input a cron syntax',
  cronPassed: true,
  mode: 'simp',
  pageURL: 'https://news.qq.com/',
  pageURLMsg: 'Please input a URL start with https:// or http://',
  pageURLPassed: true,
  cssSelector: 'body',
  extra: {
    alias: (Math.floor(Date.now())).toString(36).toUpperCase(),
    detectMode: '1',
    detectWord: '',
    alertProvider: '',
    alertDebounce: '',
  },
}

export const createTaskDetailAtom = atom(createTaskDetail);
