const express = require("express");
const amqp = require("amqplib");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const app = express();
app.use(express.json());

// JWT authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }
  jwt.verify(token, JWT_SERCRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

const RABBITMQ_URL = "amqp://user:password@rabbitmq:5672";
const QUEUE = "order_queue";
const DEAD_LETTER_QUEUE = "order_queue.dlq";

JWT_SERCRET = "46ab626775d46e35c4df6dbca5ced71ea2cf3a5ed41f46324f2c3ef68538eb11";


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

      console.log("Order Service đã được kế nối tới RabbitMQ");

      break;
    } catch {
      console.log("Waiting for RabbitMQ...");
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

app.post("/createorder", authenticateToken, async (req, res) => {
  const { orderId } = req.body;
  console.log("Đã nhận được đơn hàng:", orderId);
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

    console.log("Đã gửi đơn hàng đến service payment:", data.orderId);
    
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

app.post("/login", async (req, res) => {
  const { username, password } = req.body; 
  const mockUser = {
    id: 1,
    username: "testuser",
    passwordHash: await bcrypt.hash("password123", 10)
  };
  if (username !== mockUser.username) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const passwordMatch = await bcrypt.compare(password, mockUser.passwordHash);
  if (!passwordMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: mockUser.id }, JWT_SERCRET, { expiresIn: "1h" });
  res.json({ token });
});

connectRabbitMQ();

app.listen(3000, () => {
  console.log("Order Service API listening on port 3000");
});
