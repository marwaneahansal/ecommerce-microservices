import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const findUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    return user;
}

const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
}

const createUser = async (name: string, email: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await prisma.user.create({
        data: {
            email: email,
            password: hashedPassword,
            name: name,
        },
    });
    return createdUser;
};

export { createUser, findUserByEmail, comparePassword };