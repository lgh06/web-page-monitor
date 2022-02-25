// for pm2 
// https://github.com/Unitech/pm2/issues/3657  
// https://stackoverflow.com/questions/31579509/can-pm2-run-an-npm-start-script
// https://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
  "apps":[
    {
      "name": "web",
      "script": "node_modules/next/dist/bin/next",
      "args": "start -p 3002",
      "instances" : 4,
      "exec_mode" : "cluster"
    }
  ]
}