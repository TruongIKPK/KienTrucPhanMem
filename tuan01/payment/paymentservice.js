const express = require("express");
const amqp = require("amqplib");

const app = express();
app.use(express.json());

const RABBITMQ_URL = "amqp://user:password@rabbitmq:5672";
const QUEUE_ORDER = "order_queue";

const QUEUE_PAYMENT = "payment_queue";
const DEAD_LETTER_QUEUE = "order_queue.dlq";

let channel;

async function connectRabbitMQ() {
  while (true) {
    try {
      const conn = await amqp.connect(RABBITMQ_URL);
      channel = await conn.createChannel();
      await channel.assertQueue(QUEUE_PAYMENT, {
        durable: true,
        deadLetterExchange: "",
        deadLetterRoutingKey: DEAD_LETTER_QUEUE,
      });

      console.log("Payment Service đã được kế nối tới RabbitMQ");

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
        try {
          const data = JSON.parse(body);
          
          if (!data.orderId) {
            throw new Error("Missing orderId");
          }

          console.log("Đã nhận được thông báo từ Service Order:", data.orderId);

          console.log(`Đang xử lý thanh toán cho đơn hàng: ${data.orderId}`);

          await new Promise(resolve => setTimeout(resolve, 3000));

          const paymentId = `pay_${Math.floor(Math.random() * 1000)}`;

          console.log(`Thanh toán thành công cho đơn hàng: ${data.orderId}`);

          channel.ack(msg);

          channel.sendToQueue(QUEUE_PAYMENT, Buffer.from(JSON.stringify({ orderId: data.orderId, paymentId: paymentId, status: "paided" })), { persistent: true });

          console.log(`Đã gửi xác nhận cho đơn hàng: ${data.orderId} với paymentId: ${paymentId}`);

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
  console.log("Payment Service API listening on port 3001");
});
