import express from "express";
import cors from "cors";
import env from "dotenv";
import { router } from "./routes";
import cookieParser from "cookie-parser";
import amqp from "amqplib";
import { isAuthenticated } from "./utils/isAuthenticated";

let channel;

const amqpConnect = async () => {
  const connection = await amqp.connect(process.env.AMQP_URL);
  channel = await connection.createChannel();
  await channel.assertQueue("auth", {
    durable: false,
  });
  channel.prefetch(1);
  return channel;
};

env.config();

amqpConnect().then(async (channel) => {
  await channel.consume("auth", async (message) => {
    if (message) {
      const data = JSON.parse(message.content.toString());
      if (data.message === "IsAuthenticated") {
        const resData = await isAuthenticated(data.token);
        channel.sendToQueue(
          message.properties.replyTo,
          Buffer.from(JSON.stringify(resData)),
          {
            correlationId: message.properties.correlationId,
          }
        );
        channel.ack(message);
      }
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
