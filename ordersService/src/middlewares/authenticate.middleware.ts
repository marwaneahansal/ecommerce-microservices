import type { Request, Response, NextFunction } from "express";
import { amqpConnect } from "../utils/amqp";
import { User } from "@prisma/client";

declare global {
  namespace Express {
      interface Request {
          currentUser?: Omit<User, "password">;
      }
  }
}

const generateUuid = () => Math.random().toString() + Math.random().toString();

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = {
    message: "IsAuthenticated",
    token: req.headers.authorization,
  };
  const { channel, connection } = await amqpConnect();
  const correlationId = generateUuid();
  let isUserAuthenticated = false;
  let user;

  channel.sendToQueue("auth", Buffer.from(JSON.stringify(data)), {
    correlationId,
    replyTo: "orders",
  });

  await channel.consume(
    "orders",
    (message) => {
      if (message?.properties.correlationId === correlationId) {
        const data = JSON.parse(message!.content.toString());
        isUserAuthenticated = data.isAuthenticated;
        user = data.user;
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
  req.currentUser = user;
  next();
};

export { isAuthenticated };
