import type { Request, Response } from "express";
import { createNewProduct, getAllProducts } from "../services/products.service";
import { getCategoryById } from "../services/categories.service";

const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    res.json({
      status: true,
      data: products,
      message: "Products fetched successfully",
    });
  } catch (ex) {
    console.log(`* Error: ${ex}`);
    res.status(500).json({ message: "Internal server error" });
  }
  res.json({ message: "Getting products" });
};

const createProducts = async (req: Request, res: Response) => {
  try {
    const { name, price, description, categoryId } = req.body;
    if (!name || !price || !description || !categoryId) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const category = await getCategoryById(categoryId);
    if (!category) {
      res.status(400).json({ message: "Category not found" });
      return;
    }
    const product = await createNewProduct({
      name,
      price: price as number,
      description,
      categoryId
    });
    res.json({
      status: true,
      data: product,
      message: "Product created successfully",
    });
  } catch (ex) {
    console.log(`* Error: ${ex}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getProducts, createProducts };
