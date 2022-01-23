import * as amqp from 'amqplib';

let connString = 'amqp://localhost'

async function testRabbitMQSend() {
  // https://rabbitmq.com/tutorials/tutorial-one-javascript.html
  // https://github.com/amqp-node/amqplib#promise-api-example
  // https://amqp-node.github.io/amqplib/channel_api.html#channel_assertQueue
  // https://github.com/amqp-node/amqplib/blob/gh-pages/channel_api.md

  // https://www.rabbitmq.com/tutorials/tutorial-two-javascript.html  VI
  // https://github.com/rabbitmq/rabbitmq-website/blob/66c4d8a9123e9e7a4f785b485e2b9834e572956d/site/tutorials/tutorial-two-javascript.md#message-acknowledgment  VI
  // https://github.com/rabbitmq/rabbitmq-website/blob/66c4d8a9123e9e7a4f785b485e2b9834e572956d/site/confirms.md (VI)

  // https://github.com/amqp-node/amqplib/tree/main/examples/tutorials (outdated)

  let conn = await amqp.connect(connString);
  let channel = await conn.createChannel();

  var queue = 'hello';
  var msg = 'Hello world';


  // await channel.deleteQueue(queue)
  await channel.assertQueue(queue, {
    durable: true,
  });

  channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
  console.log(" [x] Sent %s", msg);

  // DO NOT CLOSE the conn!!
  // await conn.close()

}
async function testRabbitMQReceive() {

  let conn = await amqp.connect(connString);
  let channel = await conn.createChannel();

  var queue = 'hello';

  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

  await channel.assertQueue(queue, {
    durable: true,
  });

  await channel.prefetch(4);
  await channel.consume(queue, function (message) {
    // console.log(message)
    if (message !== null) {
      console.log(" [x] Received %s", message.content.toString());
      // nack will cause loop.
      // channel.nack(message)
      return channel.ack(message)
    }
  }, {
    noAck: false
  })

  // DO NOT CLOSE the conn!!
  // await conn.close()

}

const exchange = 'testPptrTaskDelayExchange001';
const queue = 'testPptrTaskQueue001';
const queueBinding = 'testPptrBindingName';
async function testDelayedMQSend() {
  // https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/tree/3.9.0#installation
  // https://gist.github.com/mfressdorf/f46fdf266f35d8c525aea16719f837ac
  // https://github.com/amqp-node/amqplib/blob/gh-pages/channel_api.md#channelpublish
  // https://github.com/amqp-node/amqplib/blob/gh-pages/channel_api.md#channel_bindQueue
  // https://www.rabbitmq.com/getstarted.html
  let conn = await amqp.connect(connString);
  let channel = await conn.createChannel();
  await channel.assertExchange(exchange, 'x-delayed-message', { durable: true, arguments: { 'x-delayed-type': 'direct' } });

  // Publish message
  const headers = { 'x-delay': 10*1000 };
  let now = new Date();
  console.log('sent date:', now.toLocaleString())
  channel.publish(exchange, queueBinding, Buffer.from('hello world' + now), { headers });

}

async function testDelayedMQRecieve(){

  let conn = await amqp.connect(connString);
  let channel = await conn.createChannel();
  // assertExchange in consumer can be deleted in fact
  await channel.assertExchange(exchange, 'x-delayed-message', { durable: true, arguments: { 'x-delayed-type': 'direct' } });
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, queueBinding);

  await channel.prefetch(4);
  await channel.consume(queue, function (message) {
    // console.log(message)
    if (message !== null) {
      console.log(" [x] Received %s", message.content.toString(), new Date());
      channel.ack(message)
    }
  }, {
    noAck: false
  })
}

export { testRabbitMQSend, testRabbitMQReceive, testDelayedMQSend, testDelayedMQRecieve }