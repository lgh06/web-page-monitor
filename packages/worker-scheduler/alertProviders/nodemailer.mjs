import * as nm from "nodemailer";
import { CONFIG } from "../CONFIG.mjs";
import { getDB } from "../lib/index.mjs";
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import mjml2html from 'mjml'


Handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});


// alertDebounce in milliseconds
// const defaultAlertDebounce = 1000 * 60 * 60 * 3; // 3 hours
// const minAlertDebounce = 1000 * 60 * 60 * 1 // 1 hour
const defaultAlertDebounce = 1000 * 60 * 3; // dev 3 minutes
const minAlertDebounce = 1000 * 60 * 2 // dev 2 minutes
const __dirname = (() => {let x = path.dirname(decodeURI(new URL(import.meta.url).pathname)); return path.resolve( (process.platform == "win32") ? x.substr(1) : x ); })();
let hbsTpl = fs.readFileSync( path.resolve(__dirname, 'nodemailer-tpl-alert.hbs'), 'utf8');
const template = Handlebars.compile(hbsTpl);
let mjmlTpl = fs.readFileSync( path.resolve(__dirname, 'nodemailer-tpl-mjml.mjml'), 'utf8');

/**
 * 
 * @param {WithId<Document>} prevDoc 
 * @param {WithId<Document>} doc 
 * @param {*} taskDetail 
 */
async function alertFormatter({prevDoc, doc, taskDetail}) {
  console.log('inside alertFormatter');
  let hbsOutput = template({ prevDoc, doc, taskDetail });
  let mjmlOutput = mjml2html(mjmlTpl)
  console.log(mjmlOutput.errors);


  let result = {
    content: 'Task id: ' + taskDetail._id + ' has Changed. 任务有变动，请去网页监控系统查看。',
    htmlContent : `${mjmlOutput.html}`,
  };
  return result;
}

async function alertSender({content, htmlContent, taskDetail}) {
  // console.log(content);
  // create reusable transporter object using the default SMTP transport
  // https://nodemailer.com/about/
  // https://nodemailer.com/app/
  let transporter = nm.createTransport({
    host: CONFIG.nodemailer.host,
    port: CONFIG.nodemailer.port,
    secure: CONFIG.nodemailer.secure, // true for 465, false for other ports
    auth: CONFIG.nodemailer.auth,
  });

  // send mail with defined transport object
  try {
    let domain = taskDetail.pageURL.replace(/^https?:\/\//,'').replace(/^www\./, '').split('/')[0];
    let info = await transporter.sendMail({
      from: CONFIG.nodemailer.from, // sender address
      to: taskDetail.userInfo.email || "hnnk@qq.com", // list of receivers
      subject: `网页变动通知-Web Site Changes Alert-${domain}`, // Subject line
      text: content || "Hello world?", // plain text body
      html: htmlContent || content || "<b>Hello world?</b>", // html body
    });
    
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error(error)
    return {
      err: 'mail send failed',
      success: false,
      prevAlertTime: 0,
    };
  }finally{

  }
  return {
    err: null,
    success: true,
    prevAlertTime: Date.now(),
  }

}

async function exec({prevDoc, doc, taskDetail}) {
  let alertDebounce = defaultAlertDebounce;
  if(taskDetail && taskDetail.extra &&  taskDetail.extra.alertDebounce){
    alertDebounce = parseInt(taskDetail.extra.alertDebounce, 10);
  }
  // defaultAlertDebounce is 3 hours.
  // min alertDebounce is 1 hour.
  if( Number.isNaN(alertDebounce) || alertDebounce < minAlertDebounce){
    alertDebounce = defaultAlertDebounce;
  }
  console.log('inside provider nodemailer exec');
  if(!CONFIG.nodemailer.host) return null;
  // let db = await getDB();
  let { content, htmlContent} = await alertFormatter({prevDoc, doc, taskDetail});
  let alertResult;
  // debounce the alert
  if(taskDetail.tmpCache && taskDetail.tmpCache.prevAlertTime && (Date.now() - taskDetail.tmpCache.prevAlertTime < alertDebounce)){

  }else{
    alertResult = await alertSender({content, htmlContent, taskDetail});
  }
  return alertResult;
}

// TODO find a place to save one task's last notify time
// give ability to save previous notify time


// main().catch(console.error);


let nodemailer = {
  name: 'nodemailer',
  alertFormatter,
  alertSender,
  exec,
}

export { nodemailer, nodemailer as default };