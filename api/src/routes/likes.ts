import express from "express";
import { getLikes, addLike, deleteLike } from "../controllers/like";
import { verifyUser } from "../middlewares/verifyToken";

const router = express.Router();

router.get("/", getLikes);
router.post("/", verifyUser, addLike);
router.delete("/", verifyUser, deleteLike);

export default router;
