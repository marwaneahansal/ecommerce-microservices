import { NextFunction, Request, Response } from "express";
import { amqpConnect } from "../utils/amqp";

const generateUuid = () => {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
};

//! RPC pattern
const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = {
    message: "IsAuthenticated",
    token: req.headers.authorization,
    consumer: "products",
  };
  const { channel, connection } = await amqpConnect();
  const correlationId = generateUuid();
  let isUserAuthenticated = false;

  channel.sendToQueue("auth", Buffer.from(JSON.stringify(data)), {
    correlationId,
    replyTo: "products",
  });

  await channel.consume(
    "products",
    (message) => {
      if (message?.properties.correlationId === correlationId) {
        const data = JSON.parse(message!.content.toString());
        isUserAuthenticated = data.isAuthenticated;
        setTimeout(function () {
          connection.close();
        }, 500);
      }
    },
    {
      noAck: true,
    }
  );

  if (!isUserAuthenticated) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

export { isAuthenticated };
