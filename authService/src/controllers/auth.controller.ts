import { Request, Response } from "express";
import {
  comparePassword,
  createUser,
  destroyRefreshToken,
  findUserByEmail,
  findUserByToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshExpiration,
} from "../services/auth.service";

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
    res
      .status(500)
      .json({ message: "Internal server error during user registration" });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      return res.status(404).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await comparePassword(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = await generateAccessToken(existingUser);
    const refreshToken = await generateRefreshToken(existingUser);
    res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      })
      .header("Authorization", accessToken)
      .json({ message: "User logged in successfully" });
  } catch (error) {
    console.log(`Error:  ${error}`);
    res
      .status(500)
      .json({ message: "Internal server error during user login" });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(403).json({ message: "Access denied, token missing!" });
  }
  try {
    if (await verifyRefreshExpiration(refreshToken)) {
      await destroyRefreshToken(refreshToken);
      return res.status(403).json({ message: "Access denied, token expired!" });
    }
    const existingUser = await findUserByToken(refreshToken);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const accessToken = await generateAccessToken(existingUser);
    res
      .status(200)
      .header("Authorization", accessToken)
      .json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log(`Error:  ${error}`);
    res
      .status(500)
      .json({ message: "Internal server error during token refresh" });
  }
};

export { registerUser, loginUser, refreshToken };
