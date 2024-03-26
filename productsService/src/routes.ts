import express from "express";
import { createProducts, getProducts } from "./controllers/products.controller";
import { createCategory, getCategories } from "./controllers/categories.controller";
import { isAuthenticated } from "./middlewares/authenticate.middleware";

const router = express.Router();

router.get("/", isAuthenticated, getProducts);
router.post("/", isAuthenticated, createProducts);
router.get('/categories', isAuthenticated, getCategories);
router.post('/categories', isAuthenticated, createCategory);

export { router };
