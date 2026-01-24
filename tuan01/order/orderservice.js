const express = require("express");
const amqp = require("amqplib");

const app = express();
app.use(express.json());

const RABBITMQ_URL = "amqp://user:password@rabbitmq:5672";
const QUEUE = "order_queue";
const DEAD_LETTER_QUEUE = "order_queue.dlq";

let channel;

async function connectRabbitMQ() {
  while (true) {
    try {
      const conn = await amqp.connect(RABBITMQ_URL);
      channel = await conn.createChannel();
      await channel.assertQueue(QUEUE, {
        durable: true,
        deadLetterExchange: "",
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

app.post("/createorder", async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: "Loi khong nhan duoc orderId" });
  }

  const data = {
    orderId: orderId,
    timestamp: new Date()
  };

  try {
    if (!channel) {
      throw new Error("RabbitMQ channel not ready");
    }

    channel.sendToQueue(
      QUEUE,
      Buffer.from(JSON.stringify(data)),
      { persistent: true }
    );

    console.log("Đã gửi đơn hàng service payment:", data);

    console.log("-------------------------------------------------------------------------------------------------------");
    
    //GỬI THÀNH CÔNG
    return res.json({
      status: "thanh cong",
      message: "Don hang da duoc dua vao hang doi",
      dataSent: data
    });

  } catch (error) {
    console.error("Gui RabbitMQ that bai:", error);

    //GỬI THẤT BẠI
    return res.status(500).json({
      status: "gui that bai",
      message: "Khong gui duoc don hang"
    });
  }

});

connectRabbitMQ();

app.listen(3000, () => {
  console.log("Producer API listening on port 3000");
});
