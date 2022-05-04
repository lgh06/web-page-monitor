import vm from 'vm';

async function runFnInVm(){
  const TIMEOUT = 1000 * 1.5;
  let timr = null;
  
  
  let fnString = `
async function exec(){
  console.log('exec a example task in custom mode: ', Date.now());
  return DDate.now()
}

exec();
  `;
  
  
  const result = await new Promise(
    (resolve, reject) => {
      const sandbox = {
        setInterval,
        setTimeout,
        console,
        // ctx: this.ctx,
      };
  
      try {
        timr = setTimeout(() => {
          reject(new Error('Script execution timed out.'));
        }, TIMEOUT);
  
        vm.createContext(sandbox);
        const data = vm.runInContext(fnString, sandbox, {
          // filename: id,
          timeout: TIMEOUT,
        });
  
        resolve(data);
      } catch (error) {
        reject(error);
      }
    },
  ).catch(err => {
    return err instanceof Error ? err : new Error(err.stack);
  });
  
  
  if (timr) {
    clearTimeout(timr);
    timr = null;
  }
  
  let resBody = {};
  
  if (result instanceof Error) {
    console.log('[ERROR]', result);
  
    resBody = {
      error: result.toString
        ? result.toString().replace(/Error: Error: /g, 'Error: ')
        : result,
    };
  } else {
    console.log('[Response]', result);
  
    resBody = result;
  }
}

runFnInVm();
