# `worker-scheduler`

> TODO: description  

## file-name or fileName?  
all files routed to a page or an API, should be `file_name.[ts|tsx]`.  
all files used as a component / lib / helper, without route, should be `fileName.[ts|tsx|js|mjs]`.  
an jotai atom config (initial) should be exported as `oneAtom` .  
a React component or a Next.js Page should us `ComponentName` or `PageName`

## Table / Collection design  
- task  

| task_id| user_id| created_time |next_execute_time| cron| worker_id(or hashed by task_id char code)| pptr_id  |  others(maybe) |
|---|---|---|---|---|---|---|---|
| global unique | global unique | timestamp |  timestamp |Cron patterns|    |  if null, any pptr can execute this task, randomly  |    |
| 1 |  1 |1642470077306| 1642470077306 |'00 00 00 * * *'   | 1  |  1 |  |

- task_status_history  


| task_id| pptr_id|  begin_time| end_time |status| text_hash | outer_html(VIP only) |  other(maybe) |
|---|---|---|---|---|---|---|---|
| global unique| if task pptr_id is null, here should be a pptr_id | timestamp | timestamp |  if success or have errror or exceed time limit | textContent, hashed, for easy compare |    |    |
| 1 | 2 |  1642470077306 |1642470077306| 1642470077306 |7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069   | `<div>Hello</div>`  |   |  




## Usage

```
const workerScheduler = require('worker-scheduler');

// TODO: DEMONSTRATE API
```
