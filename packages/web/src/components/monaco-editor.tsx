import { NextComponentType } from "next/types";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import { useEffect } from "react";
import { sampleFunction } from '@webest/web-page-monitor-helper';
const nodeTypes = (require as any).context('!!raw-loader!@types/node/', true, /\.d.ts$/);
const puppeteerTypes = require('!!raw-loader!puppeteer-core/lib/types.d.ts');


const MonacoEditor: NextComponentType = () => {
  const monaco = useMonaco();

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


      nodeTypes.keys().forEach((key: string) => {
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          nodeTypes(key).default,
          'node_modules/@types/node/' + key.substr(2)
        );
      });

      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        puppeteerTypes.default
          .replace('import { ChildProcess } from \'child_process\';', '')
          .replace(/export /g, 'declare '),
        'node_modules/puppeteer-core/lib/types.d.ts',
      );
      console.log("here is the monaco instance:", monaco.languages.typescript.typescriptDefaults.getExtraLibs());
    }
  }, [monaco]);

  return (
    <div style={{ backgroundColor: '#eee' }}>
      <Editor
        height="40vh"
        defaultLanguage="typescript"
        defaultValue={sampleFunction}
        options={{
          minimap: { enabled: false },
          renderWhitespace: 'all',
          scrollBeyondLastLine: false,
        }}
      />
    </div>);
}

export { MonacoEditor, MonacoEditor as default };