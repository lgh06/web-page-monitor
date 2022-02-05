import * as nm from "nodemailer";
import { CONFIG } from "../CONFIG.mjs";
import { getDB } from "../lib/index.mjs";


// alertDebounce in milliseconds
const defaultAlertDebounce = 1000 * 60 * 60 * 3; // 3 hours

/**
 * 
 * @param {WithId<Document>} prevDoc 
 * @param {WithId<Document>} doc 
 * @param {*} taskDetail 
 */
async function alertFormatter({prevDoc, doc, taskDetail}) {
  console.log('inside alertFormatter');
  let result = {
    content: JSON.stringify(prevDoc) + JSON.stringify(doc) + JSON.stringify(taskDetail),
    htmlContent : `变动前：<pre>${JSON.stringify(prevDoc)}</pre><br/>
    变动后：<pre>${JSON.stringify(doc)}</pre><br/>
    任务详情：<pre>${JSON.stringify(taskDetail)}</pre>`,
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
  if( Number.isNaN(alertDebounce) || alertDebounce < 3600 * 1000){
    alertDebounce = defaultAlertDebounce;
  }
  console.log('inside provider nodemailer exec');
  if(!CONFIG.nodemailer.host) return null;
  let db = await getDB();
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