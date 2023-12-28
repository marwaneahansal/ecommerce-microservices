import { Request, Response } from "express";
import { comparePassword, createUser, findUserByEmail, generateAccessToken } from "../services/auth.service";

const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, name, password } = req.body;
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        await createUser(name, email, password);
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log(`Error:  ${error}`);
        res.status(500).json({ message: "Internal server error during user registration" });
    }
};

const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const existingUser = await findUserByEmail(email);
        if (!existingUser) {
            return res.status(404).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await comparePassword(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const accessToken = await generateAccessToken(existingUser);
        res.status(200)
            .header('Authorization', accessToken)
            .json({ message: "User logged in successfully" });
    } catch (error) {
        console.log(`Error:  ${error}`);
        res.status(500).json({ message: "Internal server error during user login" });
    }

};

export { registerUser, loginUser };