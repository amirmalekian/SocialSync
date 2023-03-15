import express from "express";
import { getPosts, addPost, deletePost } from "../controllers/post";
import { verifyUser } from "../middlewares/verifyToken";

const router = express.Router();

router.get("/", verifyUser, getPosts);
router.post("/", verifyUser, addPost);
router.delete("/:id", verifyUser, deletePost);

export default router;
