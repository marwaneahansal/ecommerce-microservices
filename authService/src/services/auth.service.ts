import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

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

const generateAccessToken = async (user: User) => {
    const secret = process.env.JWT_SECRET;
    return jwt.sign({ id: user.id, name: user.name }, secret, { expiresIn: "15m" });
}

const findUserByToken = async (token: string) => {
    try {
        const secret = process.env.JWT_SECRET;
        const decoded: any = jwt.verify(token, secret);
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
            },
        });
        return user;
    } catch (error) {
        console.log(`Error:  ${error}`);
        return null;
    }
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

export { createUser, findUserByEmail, comparePassword, generateAccessToken, findUserByToken };