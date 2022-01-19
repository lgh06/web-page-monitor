import { NextComponentType } from "next/types";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import { useEffect } from "react";
import { sampleFunction } from '@webest/web-page-monitor-helper';


const MonacoEditor: NextComponentType = () => {
  const monaco = useMonaco();

  useEffect(() => {

    if (monaco) {
      monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
      console.log("here is the monaco instance:", monaco);
    }
  }, [monaco]);
  
  return (
  <div style={{backgroundColor: '#eee'}}>
    <Editor
      height="40vh"
      defaultLanguage="javascript"
      defaultValue={sampleFunction}
    />
  </div>);
}

export { MonacoEditor, MonacoEditor as default };