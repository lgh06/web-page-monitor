import { atomWithReset } from 'jotai/utils'
import { sampleFunctionCreateTask, sampleFunctionCreateScript } from '@webest/web-page-monitor-helper';


let monacoEditor = {
  createTaskDefaultValue: sampleFunctionCreateTask,
  createScriptDefaultValue: sampleFunctionCreateScript,
  value: '',
}

export const monacoEditorAtom = atomWithReset(monacoEditor);
