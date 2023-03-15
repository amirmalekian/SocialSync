import express from "express";
import {
  getRelationships,
  addRelationships,
  deleteRelationships,
} from "../controllers/relationship";
import { verifyUser } from "../middlewares/verifyToken";

const router = express.Router();

router.get("/", getRelationships);
router.post("/", verifyUser, addRelationships);
router.delete("/", verifyUser, deleteRelationships);

export default router;
