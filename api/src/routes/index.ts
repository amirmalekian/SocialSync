import express from "express";
import authRoutes from "./auth";
import postRoutes from "./posts";
import commentRoutes from "./comments";
import likeRoutes from "./likes";
import userRoutes from "./users";
import relationshipRoutes from "./relationships";
import storyRoutes from "./stories";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/likes", likeRoutes);
router.use("/users", userRoutes);
router.use("/relationships", relationshipRoutes);
router.use("/stories", storyRoutes);

export default router;
