import * as nm from "nodemailer";
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
    htmlContent : `<pre>${JSON.stringify(prevDoc)}</pre><pre>${JSON.stringify(doc)}</pre><pre>${JSON.stringify(taskDetail)}</pre>`,
  };
  return result;
}

async function alertSender({content, htmlContent, taskDetail}) {
  console.log(content);
  // create reusable transporter object using the default SMTP transport
  // https://nodemailer.com/about/
  // https://nodemailer.com/app/
  let transporter = nm.createTransport({
    host: "localhost",
    port: 10260,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'project.1', // generated ethereal user
      pass: 'secret.1', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Alert 通知" <alert@webmonitoralertoversea.codeshu.com>', // sender address
    to: taskDetail.userInfo.email || "hnnk@qq.com", // list of receivers
    subject: `网页变动通知 - Web Site Changes Alert ${taskDetail.pageURL}`, // Subject line
    text: content || "Hello world?", // plain text body
    html: htmlContent || content || "<b>Hello world?</b>", // html body
  });
  
  console.log("Message sent: %s", info.messageId);
  return {
    err: null,
    success: true,
  }

}

async function exec({prevDoc, doc, taskDetail}){
  console.log('inside provider nodemailer exec');
  let db = await getDB();
  let { content, htmlContent} = await alertFormatter({prevDoc, doc, taskDetail});
  let alertResult = await alertSender({content, htmlContent, taskDetail});
  return alertResult;
}

// main().catch(console.error);


let nodemailer = {
  name: 'nodemailer',
  alertFormatter,
  alertSender,
  exec,
}

export { nodemailer, nodemailer as default };