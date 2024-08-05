const amqp = require('amqplib');
const config = require('./config');

async function send() {
  try {
    const connection = await amqp.connect(config.rabbitmq.url);
    const channel = await connection.createChannel();

    const queue = 'test-queue'; // Name of the queue
    const message = 'Hello World!';

    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(message));

    console.log(" [x] Sent '%s'", message);

    setTimeout(function() { 
      connection.close(); 
      process.exit(0) 
    }, 500);

  } catch (error) {
    console.error("Error:", error);
  }
}

send();