import express from "express";
import { getStories, addStory, deleteStory } from "../controllers/story";
import { verifyUser } from "../middlewares/verifyToken";

const router = express.Router();

router.get("/", verifyUser, getStories);
router.post("/", verifyUser, addStory);
router.delete("/:id", verifyUser, deleteStory);

export default router;
