import { Order, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Product = {
  id: string;
  quantity: number;
};

const getAllOrders = async (userId: string) : Promise<Order[] | null> => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return orders;
  } catch (error) {
    console.log(`* Error: ${error}`);
    return null;
  }
}

const createNewOrder = async (products: Product[], userId: string) : Promise<Order | null> => {
  try {
    const productsRecord = products.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
    }));
    const order = await prisma.order.create({
      data: {
        userId: userId,
        status: "PENDING",
        total: 0, // * for now total is 0
        items: {
          createMany: {
            data: productsRecord,
          },
        },
      },
    });
    return order;
  } catch (error) {
    console.log(`* Error: ${error}`);
    return null;
  }
};

export { getAllOrders ,createNewOrder }