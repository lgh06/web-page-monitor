import { atom } from 'jotai'

const creatingTaskDetail = {
  nowTimestamp: Date.now(),
  nowLocalMinuteString: '',
  cronSyntax: '0 0 * * * *',
}

export const creatingTaskDetailAtom = atom(creatingTaskDetail);
