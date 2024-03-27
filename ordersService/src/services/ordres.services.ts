import { Order, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Product = {
  id: string;
  quantity: number;
};

const getAllOrders = async () : Promise<Order[] | null> => {
  try {
    const orders = await prisma.order.findMany({
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

const createNewOrder = async (products: Product[]) : Promise<Order | null> => {
  try {
    // * for now get the first user found
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("User not found");
    const productsRecord = products.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      // price: 0, // * for now price is 0
    }));
    const order = await prisma.order.create({
      data: {
        userId: user.id,
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