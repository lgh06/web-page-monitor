// https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html#types-in-modules
export namespace  CronTime {
  function getNextTimes (cron: string): Array<number>;
  function toLocalISOString(oneDate: Date, plusMinutes = 0):string;
} 

