import { atom } from 'jotai'
import { sampleFunctionCreateTask, sampleFunctionCreateEraser } from '@webest/web-page-monitor-helper';


let monacoEditor = {
  createTaskDefaultValue: sampleFunctionCreateTask,
  createEraserDefaultValue: sampleFunctionCreateEraser,
  value: '',
}

export const monacoEditorAtom = atom(monacoEditor);
