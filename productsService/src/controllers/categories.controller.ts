import type { Request, Response } from "express";
import { createNewCategory, getAllCategories } from "../services/categories.service";

const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    res.json({ status: true, data: categories, message: "Categories fetched" });
  } catch (ex) {
    console.log(`* Error: ${ex}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const category = await createNewCategory(name);
    res.json({ status: true, data: category, message: "Category created" });
  } catch (ex) {
    console.log(`* Error: ${ex}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getCategories, createCategory };
