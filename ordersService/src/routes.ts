import express from "express";
import { createOrder, getOrders } from "./controllers/orders.controller";
import { isAuthenticated } from "./middlewares/authenticate.middleware";

const router = express.Router();

router.get("/", isAuthenticated, getOrders);

router.post("/", isAuthenticated, createOrder);

export { router }