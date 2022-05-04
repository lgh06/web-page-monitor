import vm from 'vm';

async function runFuncInVm(paramObj){
  // console.log('inside runFuncInVm', paramObj)
  let { taskDetail, page, nodeFetch, fnString = "" } = paramObj;
  const TIMEOUT = 1000 * 1.5;
  let timr = null;
  
  
  if(String(fnString).includes('exec')){
    fnString += `;
    exec();`
  }else{
    return 'Error: exec function not found, at vm';
  }
  
  
  const result = await new Promise((resolve, reject) => {
      const sandbox = {
        setInterval,
        setTimeout,
        console,
        taskDetail,
        page,
        nodeFetch
        // ctx: this.ctx,
      };
  
      try {
        timr = setTimeout(() => {
          reject(new Error('Script execution timed out.'));
        }, TIMEOUT);
  
        vm.createContext(sandbox);
        const data = vm.runInContext(fnString, sandbox, {
          filename: taskDetail._id || Date.now().toString(36),
          timeout: TIMEOUT,
        });
        // data is a promise
        // console.log('inside vm_func_runner, data:', data);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    }).catch(err => {
    return err instanceof Error ? err : new Error(err.stack);
  });
  
  
  if (timr) {
    clearTimeout(timr);
    timr = null;
  }

  if (result instanceof Error) {
    // console.error('[ERROR]', result);
    throw new Error(result);
  } else {
    // console.log('[result]', result);
    return result;
  }
}

export { runFuncInVm }
