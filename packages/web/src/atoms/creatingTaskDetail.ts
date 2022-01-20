import { atom } from 'jotai'

let creatingTaskDetail = {
  endLocalMinuteString: '',
  startLocalMinuteString: '',
  cronSyntax: '0 0 * * * *',
  cronMsg: 'Please Input a cron syntax:',
  cronPassed: true,
}

export const creatingTaskDetailAtom = atom(creatingTaskDetail);
