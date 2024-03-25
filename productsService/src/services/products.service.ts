import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Product = {
  name: string;
  price: number;
  description: string;
  categoryId: string;
};

const getAllProducts = async () => {
  return await prisma.product.findMany(
    {
      include: {
        category: true,
      }
    }
  );
};

const createNewProduct = async (data: Product) => {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
      description: data.description,
      category: {
        connect: {
          id: data.categoryId,
        },
      }
    },
    include: {
      category: true,
    }
  });
  return product;
};

export { getAllProducts, createNewProduct };
