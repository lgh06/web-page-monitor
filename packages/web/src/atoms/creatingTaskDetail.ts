import { atom } from 'jotai'

let creatingTaskDetail = {
  endLocalMinuteString: '',
  cronSyntax: '0 0 * * * *',
  cronMsg: '',
}

export const creatingTaskDetailAtom = atom(creatingTaskDetail);
