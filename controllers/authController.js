import asyncHandler from "express-async-handler";
import { verifyToken } from "../utils/verifyToken.js";
import jwt from "jsonwebtoken";
export const login = asyncHandler(
    async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const payload = { username };


        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.json({
            message: 'Login successful',
            token,
        });
    }
);

export const verifyuserToken = asyncHandler(
    async (req, res) => {
        const token = req?.headers?.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: 'Token missing or invalid' });

        // Verify token
        const verifyUser = verifyToken(token);
        if (!verifyUser) return res.status(401).json({ message: 'Token missing or invalid' });
        res.json({
            message: 'You are authorized!',
            user: verifyUser.username,
        });

    }
)



