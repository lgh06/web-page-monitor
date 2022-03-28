import { atomWithReset } from 'jotai/utils'

let createTaskDetail = {
  // used on edit
  _id: null,
  endLocalMinuteString: '',
  endMaxLocalMinuteString: '',
  endTime: 0,
  startLocalMinuteString: '',
  cronSyntax: '0 20 9,18 * * *', // 0 0 10,22 * * *
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
    eraserArr: [],
    waitForSelector: '',
  },
  // used on list
  taskList: [],
  // used when submitting, prevent multiple submit
  submitting: false,
}

export const createTaskDetailAtom = atomWithReset(createTaskDetail);
