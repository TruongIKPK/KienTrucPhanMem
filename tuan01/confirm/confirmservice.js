const express = require("express");
const amqp = require("amqplib");

const app = express();
app.use(express.json());

const RABBITMQ_URL = "amqp://user:password@rabbitmq:5672";
const QUEUE_PAYMENT = "payment_queue";
const DEAD_LETTER_QUEUE = "order_queue.dlq";

let channel;

async function connectWithRetry() {
  try {
    console.log("Consumer connecting...");
    const conn = await amqp.connect(RABBITMQ_URL);
    channel = await conn.createChannel();

    await channel.assertQueue(DEAD_LETTER_QUEUE, { durable: true });

    await channel.assertQueue(QUEUE_PAYMENT, {
      durable: true,
      deadLetterExchange: "",
      deadLetterRoutingKey: DEAD_LETTER_QUEUE,
    });
    
    channel.consume(
      QUEUE_PAYMENT,
      async (msg) => {
        if (!msg) return;

        const body = msg.content.toString();

        try {
          const data = JSON.parse(body);

          console.log(``);
          
          if (!data.orderId || !data.paymentId) {
            throw new Error("Missing orderId or paymentId");
          }

          console.log(`Đã nhận được thông báo từ Service Payment: ${data.orderId} với mã thanh toán: ${data.paymentId}`);

          await new Promise(resolve => setTimeout(resolve, 3000));

          channel.ack(msg);

          console.log("Đã gửi thông báo đến email của các khách hàng:", data.orderId, " với mã thanh toán:", data.paymentId);

        
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