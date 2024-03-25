import { Category, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllCategories = async () => {
  return await prisma.category.findMany();
};

const createNewCategory = async (name: string) => {
  const category = await prisma.category.create({
    data: {
      name: name,
    },
  });
  return category;
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });
  return category;
};

export { createNewCategory, getAllCategories, getCategoryById };
