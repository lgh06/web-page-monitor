import * as nm from "nodemailer";
import { CONFIG } from "../CONFIG.mjs";
import { getDB } from "../lib/index.mjs";


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
  console.log(content);
  // create reusable transporter object using the default SMTP transport
  // https://nodemailer.com/about/
  // https://nodemailer.com/app/
  let transporter = nm.createTransport({
    host: CONFIG.nodemailer.host,
    port: CONFIG.nodemailer.port,
    secure: CONFIG.nodemailer.secure, // true for 465, false for other ports
    auth: {
      user: CONFIG.nodemailer.user, // generated ethereal user
      pass: CONFIG.nodemailer.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  try {
    let info = await transporter.sendMail({
      from: CONFIG.nodemailer.from, // sender address
      to: taskDetail.userInfo.email || "hnnk@qq.com", // list of receivers
      subject: `网页变动通知-Web Site Changes Alert-${taskDetail.pageURL}`, // Subject line
      text: content || "Hello world?", // plain text body
      html: htmlContent || content || "<b>Hello world?</b>", // html body
    });
    
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error(error)
  }finally{

  }
  return {
    err: null,
    success: true,
    prevAlertTime: Date.now(),
  }

}

async function exec({prevDoc, doc, taskDetail}){
  console.log('inside provider nodemailer exec');
  if(CONFIG.nodemailer.host) return null;
  let db = await getDB();
  let { content, htmlContent} = await alertFormatter({prevDoc, doc, taskDetail});
  let alertResult;
  // debounce the alert
  if(taskDetail.tmpCache && taskDetail.tmpCache.prevAlertTime && (Date.now() - taskDetail.tmpCache.prevAlertTime < 1000 * 60 * 30)){

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