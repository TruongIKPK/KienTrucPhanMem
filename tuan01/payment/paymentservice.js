const express = require("express");
const amqp = require("amqplib");

const app = express();
app.use(express.json());

const RABBITMQ_URL = "amqp://user:password@rabbitmq:5672";
const QUEUE_ORDER = "order_queue";
const DEAD_LETTER_QUEUE = "order_queue.dlq";

let channel;

async function connectRabbitMQ() {
  while (true) {
    try {
      const conn = await amqp.connect(RABBITMQ_URL);
      channel = await conn.createChannel();
      await channel.assertQueue(QUEUE_ORDER, {
        durable: true,
        deadLetterExchange: "",      // Default Exchange
        deadLetterRoutingKey: DEAD_LETTER_QUEUE,
      });

      console.log("Producer connected to RabbitMQ");
      break;
    } catch {
      console.log("Waiting for RabbitMQ...");
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

async function connectWithRetry() {
  try {
    const conn = await amqp.connect(RABBITMQ_URL);
    channel = await conn.createChannel();

    await channel.assertQueue(DEAD_LETTER_QUEUE, { durable: true });

    await channel.assertQueue(QUEUE_ORDER, {
      durable: true,
      deadLetterExchange: "",
      deadLetterRoutingKey: DEAD_LETTER_QUEUE,
    });

    channel.consume(
      QUEUE_ORDER,
      async (msg) => {
        if (!msg) return;

        const body = msg.content.toString();
        console.log("Đã nhận được thông báo từ Service ORDER:", body);

        try {
          const data = JSON.parse(body);

          if (!data.orderId) {
            throw new Error("Missing orderId");
          }
          await new Promise(resolve => setTimeout(resolve, 3000));
          channel.ack(msg);
        } catch (err) {
          console.log("Send to DLQ", msg);
          channel.nack(msg, false, false);
        }
      },
      { noAck: false }
    );

  } catch (err) {
    console.log("Consumer failed, retry in 3s...");
    setTimeout(connectWithRetry, 3000);
  }
}

connectWithRetry();
connectRabbitMQ();

app.listen(3001, () => {
  console.log("Producer API listening on port 3000");
});
