const amqp = require('amqplib');
const config = require('../../config');

async function start() {
  const connection = await amqp.connect(config.rabbitmq.url);
  const channel = await connection.createChannel();
  const queue = 'critic-queue'; // Receiving queue

  await channel.assertQueue(queue, { durable: false });

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const idea = msg.content.toString();

      // Implement your critique logic here
      const critique = critiqueIdea(idea); 

      // Send critique to the next agent (e.g., 'refiner-queue')
      // ...
      // Send critique to the refiner-queue
        await channel.assertQueue('refiner-queue', { durable: false });
            channel.sendToQueue('refiner-queue', Buffer.from(JSON.stringify({
                idea: idea,
                critique: critique
        })));

      channel.ack(msg);
    }
  });
}

function critiqueIdea(idea) {
  // Placeholder for your evaluation logic
  const score = Math.random(); // Random score for now
  const feedback = score > 0.5 ? "This idea has potential!" : "Needs further refinement.";
  return `${feedback} (Score: ${score.toFixed(2)})`;
}

start();