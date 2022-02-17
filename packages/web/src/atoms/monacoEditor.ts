import { atomWithReset } from 'jotai/utils'
import { sampleFunctionCreateTask, sampleFunctionCreateScript1 } from '@webest/web-page-monitor-helper';


let monacoEditor = {
  createTaskDefaultValue: sampleFunctionCreateTask,
  createScriptDefaultValue: sampleFunctionCreateScript1,
  value: '',
}

export const monacoEditorAtom = atomWithReset(monacoEditor);
