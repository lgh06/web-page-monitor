import { atom } from 'jotai'
import { sampleFunction } from '@webest/web-page-monitor-helper/sampleFunction.mjs';


let monacoEditor = {
  createTaskDefaultValue: sampleFunction,
  value: '',
}

export const monacoEditorAtom = atom(monacoEditor);
