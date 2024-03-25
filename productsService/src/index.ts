import express from "express";
import cors from "cors";
import env from "dotenv";
import { PrismaClient } from "@prisma/client";
import { router } from "./routes";

env.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log("Listening on port: " + PORT);
});
