import express from "express";
import { register, logIn, logOut } from "../controllers/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", logIn);
router.post("/logout", logOut);

export default router;
