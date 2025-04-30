import express from "express";
import { InstructorController } from "../controllers/InstructorController.js";
import { isInstructor } from "../middlewares/isInstructor.js";
import { verifyToken } from "../middlewares/verify-token.js";

const router = express.Router();

router.get("/", verifyToken, isInstructor, InstructorController.Dashboard);

export {router as InstructorRoutes};
