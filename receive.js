const amqp = require('amqplib');
const config = require('./config');

async function receive() {
  try {
    const connection = await amqp.connect(config.rabbitmq.url);
    const channel = await connection.createChannel();

    const queue = 'test-queue';

    await channel.assertQueue(queue, { durable: false });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(queue, (msg) => {
      console.log(" [x] Received %s", msg.content.toString());
    }, { noAck: true });

  } catch (error) {
    console.error("Error:", error);
  }
}

receive();