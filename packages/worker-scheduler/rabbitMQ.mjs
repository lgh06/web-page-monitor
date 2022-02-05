import * as amqp from 'amqplib';
import { CronTime } from "@webest/web-page-monitor-helper";
import { CONFIG } from './CONFIG.mjs';


let connString = CONFIG.mqConnString


  // https://rabbitmq.com/tutorials/tutorial-one-javascript.html
  // https://github.com/amqp-node/amqplib#promise-api-example
  // https://amqp-node.github.io/amqplib/channel_api.html#channel_assertQueue
  // https://github.com/amqp-node/amqplib/blob/gh-pages/channel_api.md

  // https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html  VI
  // https://github.com/rabbitmq/rabbitmq-website/blob/66c4d8a9123e9e7a4f785b485e2b9834e572956d/site/tutorials/tutorial-two-javascript.md#message-acknowledgment  VI
  // https://github.com/rabbitmq/rabbitmq-website/blob/66c4d8a9123e9e7a4f785b485e2b9834e572956d/site/confirms.md (VI)

  // https://github.com/amqp-node/amqplib/tree/main/examples/tutorials (outdated)


const exchange = CONFIG.exchange;
const queue = CONFIG.queue;
const queueBinding = CONFIG.queueBinding;
async function delayedMQSend({delay = 300, taskDetail}, mqConn, mqChannel) {
  // https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/tree/3.9.0#installation
  // https://gist.github.com/mfressdorf/f46fdf266f35d8c525aea16719f837ac
  // https://github.com/amqp-node/amqplib/blob/gh-pages/channel_api.md#channelpublish
  // https://github.com/amqp-node/amqplib/blob/gh-pages/channel_api.md#channel_bindQueue
  // https://www.rabbitmq.com/getstarted.html
  let conn, channel;
  conn = mqConn || await amqp.connect(connString);
  channel = mqChannel || await conn.createChannel();
  await channel.assertExchange(exchange, 'x-delayed-message', { durable: true, arguments: { 'x-delayed-type': 'direct' } });

  // Publish message
  const headers = { 'x-delay': delay };
  let now = new Date();
  // console.log('sent date:', now.toLocaleString());
  if(typeof taskDetail === 'object'){
    let stringTaskDetail = JSON.stringify(taskDetail);
    // https://github.com/amqp-node/amqplib/blob/gh-pages/channel_api.md#channel_publish
    channel.publish(exchange, queueBinding, Buffer.from(stringTaskDetail), { headers, persistent : true, expiration : 86400000 });
  }

}

export { delayedMQSend }