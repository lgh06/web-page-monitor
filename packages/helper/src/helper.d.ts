// https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html#types-in-modules
export namespace  CronTime {
  /**
   * get next 3 timestamps (13 digit, miliseconds) from cron syntax
   * UTC timestamp
   * @param {string} cron cron syntax,see https://github.com/kelektiv/node-cron/blob/5626867f67d80cce411d2b0f14f3a64063df99c6/lib/time.js#L148
   * @returns {Array} 3 timestamps (13 digit, miliseconds)
   */
  function getNextTimes (cron: string): Array<number>;
  /**
   * Calculate a ISO string in local time, minute, without end 'Z'
   * 
   * @param {Date} oneDate 
   * @param {number} plusMinutes 
   * @returns a string, in your timezone 2022-01-19T13:14
   */
  function toLocalISOString(oneDate: Date, plusMinutes = 0):string;
  /**
   * check if a timestampArr's first time is 6 minutes later.  
   * and check if time between them >= 5 minutes.
   * @param  timestampArr
   */
  function checkTimes(timestampArr:Array<number>):[true | false, errorMessage];

} 

