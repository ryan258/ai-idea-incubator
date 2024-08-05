const amqp = require('amqplib');
const fetch = require('node-fetch');
const config = require('../../config');

async function start() {
  const connection = await amqp.connect(config.rabbitmq.url);
  const channel = await connection.createChannel();
  const queue = 'idea-queue';

  await channel.assertQueue(queue, { durable: false });

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const prompt = msg.content.toString();

      const response = await fetch(config.ollama.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: config.ollama.modelName,
          prompt: prompt
        })
      });

      const data = await response.json();
      const generatedIdea = data.response;
      console.log(generatedIdea);

      // Send generatedIdea to the critic-queue
await channel.assertQueue('critic-queue', { durable: false });
channel.sendToQueue('critic-queue', Buffer.from(generatedIdea));

      channel.ack(msg);
    }
  });
}

start();