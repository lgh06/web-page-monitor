import { atom } from 'jotai'

let creatingTaskDetail = {
  endLocalMinuteString: '',
  cronSyntax: '0 0 * * * *',
}

export const creatingTaskDetailAtom = atom(creatingTaskDetail);
