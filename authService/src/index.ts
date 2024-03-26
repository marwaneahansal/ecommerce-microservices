import express from "express";
import cors from "cors";
import env from "dotenv";
import { router } from "./routes";
import cookieParser from "cookie-parser";
import amqp from "amqplib";

let channel;

const amqpConnect = async () => {
  const connection = await amqp.connect(process.env.AMQP_URL);
  channel = await connection.createChannel();
  await channel.assertQueue("auth");
  return channel;
};

env.config();

amqpConnect().then((channel) => {
  // Consume messages from the queue
  channel.consume("auth", (message) => {
    if (message) {
      console.log("Message recieved: ", message);
      const data = JSON.parse(message.content.toString());
      console.log("Data recieved: ", data);
      channel.ack(message);
    }
  });
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(router);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Listening on port: " + PORT);
});
