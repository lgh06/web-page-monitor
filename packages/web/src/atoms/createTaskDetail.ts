import { atom } from 'jotai'

let createTaskDetail = {
  endLocalMinuteString: '',
  startLocalMinuteString: '',
  cronSyntax: '0 0 * * * *',
  cronMsg: 'Please Input a cron syntax:',
  cronPassed: true,
}

export const createTaskDetailAtom = atom(createTaskDetail);
