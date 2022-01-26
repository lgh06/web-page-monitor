import { simpleMode } from "./simpleMode.mjs";
import * as amqp from 'amqplib';
import { CONFIG } from "./CONFIG.mjs";

const exchange = 'testPptrTaskDelayExchange001';
const queue = 'testPptrTaskQueue001';
const queueBinding = 'testPptrBindingName';
let connString = CONFIG.mqConnString

async function main() {
  // TODO subscribe MQ
  // distinct different mode, then use different mjs to execute pptr

  let conn = await amqp.connect(connString);
  let channel = await conn.createChannel();
  // assertExchange in consumer can be deleted in fact
  await channel.assertExchange(exchange, 'x-delayed-message', { durable: true, arguments: { 'x-delayed-type': 'direct' } });
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, queueBinding);

  await channel.prefetch(4);
  await channel.consume(queue, async function (message) {
    let taskDetail;
    console.log('consuming')
    // console.log(message)
    if (message !== null) {
      let stringTaskDetail = message.content.toString();
      console.log(stringTaskDetail)
      try {
        taskDetail = JSON.parse(stringTaskDetail);
      } catch (error) {
        console.error(error);
        return channel.ack(message)
      }
      if (taskDetail.mode === 'simp') {
        try {
          let [result, err] = await simpleMode(taskDetail);
          console.log(result, err);
        } catch (error) {
          console.error(error);
        } finally {
          channel.ack(message)
        }
      }
    }
  }, {
    noAck: false
  })

}

main();

