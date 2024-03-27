import express from "express";
import { createOrder, getOrders } from "./controllers/orders.controller";

const router = express.Router();

router.get("/", getOrders);

router.post("/", createOrder);

export { router }