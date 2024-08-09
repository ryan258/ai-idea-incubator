const amqp = require('amqplib');
const config = require('./config');

async function start() {
  const connection = await amqp.connect(config.rabbitmq.url);
  const channel = await connection.createChannel();

  // --- Receive User Input (Example using command-line input) ---
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question('Enter your prompt: ', (prompt) => {
    // --- Initiate Pipeline ---
    channel.assertQueue('idea-queue', { durable: false });
    channel.sendToQueue('idea-queue', Buffer.from(prompt));

    console.log(`Sent prompt: ${prompt}`);

    // --- Handle Final Output ---
    channel.assertQueue('implementer-queue', { durable: false });
    channel.consume('implementer-queue', (msg) => {
      const implementationPlan = msg.content.toString();
      console.log("Received Implementation Plan:", implementationPlan);
      channel.ack(msg);
      readline.close();
    }, { noAck: false });
  });
}

start();