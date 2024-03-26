import { NextFunction, Request, Response } from "express";
import { amqpConnect } from "../utils/amqp";

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const data = {
    message: "IsAuthenticated",
    token: req.headers.authorization,
    consumer: "products",
  }
  const channel = await amqpConnect();
  channel.sendToQueue("auth", Buffer.from(JSON.stringify(data)));
  let isAuthenticated = false;
  await channel.consume("products", (message) => {
    if (message) {
      const data = JSON.parse(message.content.toString());
      channel.ack(message);
      isAuthenticated = data.isAuthenticated;
    }
  });
  if (!isAuthenticated) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

export { isAuthenticated };