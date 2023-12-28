import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "dotenv";
import { prismaExclude } from "../utils/helpers";

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

const generateAccessToken = async (user: Omit<User, 'password'>) => {
    const secret = process.env.JWT_SECRET;
    return jwt.sign({ id: user.id, name: user.name }, secret, { expiresIn: process.env.JWT_ACCESS_EXPIRATION });
}

const generateRefreshToken = async (user: User) => {
    const secret = process.env.JWT_SECRET;
    const refreshToken = jwt.sign({ id: user.id, name: user.name }, secret, { expiresIn: process.env.JWT_REFRESH_EXPIRATION });
    await prisma.session.create({
        data: {
            sessionToken: refreshToken,
            expiresAt: new Date(Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRATION!)),
            user: {
                connect: {
                    id: user.id,
                },
            },
        },
    });
    return refreshToken;
};

const verifyRefreshExpiration = async (refreshToken: string) => {
    const session = await prisma.session.findUnique({
        where: {
            sessionToken: refreshToken,
        },
    });
    if (!session) {
        return false;
    }
    return new Date() > session.expiresAt;
}

const destroyRefreshToken = async (refreshToken: string) => {
    await prisma.session.delete({
        where: {
            sessionToken: refreshToken,
        },
    });
}

const findUserByToken = async (token: string) => {
    try {
        const secret = process.env.JWT_SECRET;
        const decoded: any = jwt.verify(token, secret);
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
            },
            select: prismaExclude("User", ["password"]),
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

export { createUser, findUserByEmail, comparePassword,
        generateAccessToken, generateRefreshToken,
        findUserByToken, verifyRefreshExpiration, destroyRefreshToken };