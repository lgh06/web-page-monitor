# `worker-scheduler`


## file-name or fileName?  
all files routed to a page or an API, should be `file_name.[ts|tsx]`.  
all files used as a component / lib / helper, without route, should be `fileName.[ts|tsx|js|mjs]`.  
an jotai atom config (initial) should be exported as `oneAtom` .  
a React component or a Next.js Page should us `ComponentName` or `PageName`

## Table / Collection design  
- task  

```javascript
// comment and examples
{
  // global unique, task_id
  _id: 1,
  // global unique, reference a user_id
  userId: ObjectId(1),
  // timestamp, if _id is generated by ObjectId,
  // then created_time can be omitted
  createdTime: 1642470077306,
  // timestamp
  nextExecuteTime: 1642470077306,
  // Date, converted from endLocalMinuteString 
  endTime: 1642470077306, // ** frontend as int, save as Date in DB
  // Cron pattern / syntax
  cronSyntax: '00 00 00 * * *',
  // simp or geek. 
  // see packages\web\src\atoms\createTaskDetail.ts for details
  mode: 'simp',
  pageURL: 'https://news.qq.com/',
  cssSelector: 'body',
  extra:{
    // pageChange "1" wordShowUp "2"
    detectMode: "1",
    detectWord: "招聘", // must be set when detectMode is 2
    alertProvider: 'nodemailer',
    alertDebounce: '',
    alias: '', // task alias name to prevent email spam
    minLength: 0, // pptr's result minLength, if less, treat this result as an error.
    // TODO
    // domEraser id and resultEraser id
  },
  // worker_id(or hashed by task_id char code)
  workerId: null,
  // if null, any pptr can execute this task, randomly
  pptrId: null,
  // other fields maybe
  other: null,
}
```

- taskHistory  


| task_id| pptr_id|  begin_time| end_time |status| text_hash | outer_html(VIP only) |  other(maybe) |
|---|---|---|---|---|---|---|---|
| global unique| if task pptr_id is null, here should be a pptr_id | timestamp | timestamp |  if success or have errror or exceed time limit | textContent, hashed, for easy compare |    |    |
| 1 | 2 |  1642470077306 |1642470077306| 1642470077306 |7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069   | `<div>Hello</div>`  |   |  


```javascript
{
  _id: '',
  beginTime: 0, // nextExecuteTime in cron syntax
  finishTime: new Date(), // ** generated as Date, store as Date in DB.
  err: 'errors returned from pptr',
  // textContent hash
  textHash: '',
  textContent: '',
  taskId: ObjectId(1), // id for task table
  checked: 1, // if already checked by diff checker
}

```


## Concepts and Flow  
`worker-scheduler.mjs` is the entry.  

- First,  it will create a interval to check `task` table's cron pattern every 5 minutes then update `task` table's 
`nextExecuteTime` field.  
Inside that `cronTaskChecker.mjs`,  tasks will be distributed to one queue of **RabbitMQ** with a MQ plugin called `rabbitmq-delayed-message-exchange` plugin.  
Then `pptr` execute one task then return task histories to another queue of RabbitMQ.  

- Second, `resultSaver` will save histories got from RabbitMQ.  
For every task returned by `pptr`, we will use `taskHistoryChecker.mjs` to check if one task's history(pptr result) changes.  
If we found one result's hash changed, then distribute this info ( which contains prevDoc, doc, taskDetail ) to `diffNotifier.mjs`.    

- Third, `modeChecker`.  (TODO, or see if need to combine with step 4)  


- 4th, check taskDetail's `alertProvider` property to send alerts by different alertProviders. (like mail, HTTP POST, phone call)  

> TODO 
> 1. a task with a wordShowThenMailProvider prop, will use that provider check if have changes and whether to send alert or not.  


