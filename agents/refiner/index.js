const amqp = require('amqplib');
const config = require('../../config');

async function start() {
  const connection = await amqp.connect(config.rabbitmq.url);
  const channel = await connection.createChannel();
  const queue = 'refiner-queue'; // Receiving queue

  await channel.assertQueue(queue, { durable: false });

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      const idea = data.idea;
      const critique = data.critique;

      // Implement your refinement logic here
      const refinedIdea = refineIdea(idea, critique);

      // Send refinedIdea to the implementer-queue
        await channel.assertQueue('implementer-queue', { durable: false });
        channel.sendToQueue('implementer-queue', Buffer.from(refinedIdea));

      channel.ack(msg);
    }
  });
}

function refineIdea(idea, critique) {
  // Placeholder for your refinement logic
  return `Refined Idea: ${idea} (Addressing critique: ${critique})`;
}

start();