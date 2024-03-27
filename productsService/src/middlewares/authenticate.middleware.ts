import { NextFunction, Request, Response } from "express";
import { amqpConnect } from "../utils/amqp";

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  // TODO: fix this middleware
  // console.log("-------------");
  const data = {
    message: "IsAuthenticated",
    token: req.headers.authorization,
    consumer: "products",
  }
  const channel = await amqpConnect();
  let isSent = channel.sendToQueue("auth", Buffer.from(JSON.stringify(data)));
  // console.log("* isSent: ", isSent)
  let isUserAuthenticated = true; //! default value is true for now
  await channel.consume("products", (message) => {
    if (message) {
      const data = JSON.parse(message.content.toString());
      channel.ack(message);
      isUserAuthenticated = data.isAuthenticated;
      // console.log(`* isAuthenticated 1: ${isUserAuthenticated}`);
    }
  });
  // console.log(`* isAuthenticated 2: ${isUserAuthenticated}`);
  if (!isUserAuthenticated) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

export { isAuthenticated };