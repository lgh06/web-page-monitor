import { atom } from 'jotai'
import { sampleFunctionCreateTask, sampleFunctionCreateScript } from '@webest/web-page-monitor-helper';


let monacoEditor = {
  createTaskDefaultValue: sampleFunctionCreateTask,
  createScriptDefaultValue: sampleFunctionCreateScript,
  value: '',
}

export const monacoEditorAtom = atom(monacoEditor);
