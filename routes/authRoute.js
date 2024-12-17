import express from "express";
import jwt from "jsonwebtoken"
import { login, verifyuserToken } from "../controllers/authController.js";
const authRouter = express.Router();


authRouter.post("/login", login)
authRouter.get("/verify", verifyuserToken)

export default authRouter