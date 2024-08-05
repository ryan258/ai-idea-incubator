module.exports = {
    ollama: {
      apiUrl: 'http://localhost:11434/api/generate',
      modelName: 'llama3.1:latest'
    },
    rabbitmq: {
      url: 'amqp://localhost:5672', // Default RabbitMQ URL
      username: 'guest',
      password: 'guest'
    }
  };