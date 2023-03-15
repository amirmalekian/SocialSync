import express from "express";
import { addComment, getComments, deleteComment } from "../controllers/comment";
import { verifyUser } from "../middlewares/verifyToken";

const router = express.Router();

router.get("/", getComments);
router.post("/", verifyUser, addComment);
router.delete("/:id", verifyUser, deleteComment);

export default router;
