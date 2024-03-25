import express from "express";
import { createProducts, getProducts } from "./controllers/products.controller";
import { createCategory, getCategories } from "./controllers/categories.controller";

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProducts);
router.get('/categories', getCategories);
router.post('/categories', createCategory);

export { router };
