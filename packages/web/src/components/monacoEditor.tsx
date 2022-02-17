import type { NextPage  } from "next/types";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import { useEffect, useRef } from "react";
// const nodeTypes = (require as any).context('!!raw-loader!@types/node/', true, /\.d.ts$/);
// const puppeteerTypes = require('!!raw-loader!puppeteer-core/lib/types.d.ts');
import { useImmerAtom } from 'jotai/immer';
import { monacoEditorAtom } from '../atoms';

interface Props {
  defaultValue: string;
  value: string;
}

const MonacoEditor: NextPage<Props> = ({defaultValue, value}) => {
  const monaco = useMonaco();
  const editorRef = useRef(null);
  const [editorValue, setEditorValue] = useImmerAtom(monacoEditorAtom);

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor; 
  }

  // @ts-ignore
  function handleEditorChange(value, event) {
    // console.log("here is the current model value:", value);
    setEditorValue(v => {
      v.value = value;
    })
  }

  // function showValue() {
    // @ts-ignore: Unreachable code error
    // alert(editorRef.current.getValue());
  // }

  useEffect(() => {

    if (monaco) {
      // monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

      // https://chrome.browserless.io/
      // https://github.com/browserless/debugger/blob/6e5fc27c8837ccba195907234709dd783fe62287/src/editor.ts#L204
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        allowNonTsExtensions: true,
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
      });


      // nodeTypes.keys().forEach((key: string) => {
      //   monaco.languages.typescript.typescriptDefaults.addExtraLib(
      //     nodeTypes(key).default,
      //     'node_modules/@types/node/' + key.substr(2)
      //   );
      // });

      // monaco.languages.typescript.typescriptDefaults.addExtraLib(
      //   puppeteerTypes.default
      //     .replace('import { ChildProcess } from \'child_process\';', '')
      //     .replace(/export /g, 'declare '),
      //   'node_modules/puppeteer-core/lib/types.d.ts',
      // );
      // console.log("here is the monaco instance:", monaco.languages.typescript.typescriptDefaults.getExtraLibs());
    }
  }, [monaco]);

  return (
    <div style={{ backgroundColor: '#eee' }}>
      <Editor
        height="500px"
        defaultLanguage="typescript"
        defaultValue={defaultValue}
        value={value}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          renderWhitespace: 'all',
          scrollBeyondLastLine: false,
          fontSize: 20,
        }}
      />
      {/* <button onClick={showValue}>Show value</button> */}
    </div>);
}

export { MonacoEditor, MonacoEditor as default };