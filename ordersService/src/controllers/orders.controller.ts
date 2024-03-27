import type { Request, Response } from "express";
import { createNewOrder, getAllOrders } from "../services/ordres.services";

const getOrders = async (req: Request, res: Response) : Promise<Response> => {
  try {
    const orders = await getAllOrders();
    if (!orders) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.json({
      status: true,
      data: orders,
      message: "Orders retrieved successfully",
    });
  } catch (error) {
    console.log(`* Error: ${error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

const createOrder = async (req: Request, res: Response) : Promise<Response> => {
  try {
    const { products } = req.body;
    // TODO: check for products ids
    const order = await createNewOrder(products);
    if (!order) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.json({
      status: true,
      data: order,
      message: "Order created successfully",
    });
  } catch (error) {
    console.log(`* Error: ${error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


export { getOrders, createOrder }
