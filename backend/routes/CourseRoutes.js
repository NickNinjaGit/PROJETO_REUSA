import express from "express";
import { CourseController } from "../controllers/CourseController.js";
import { isInstructor } from "../middlewares/isInstructor.js";
import { verifyToken } from "../middlewares/verify-token.js";

const router = express.Router();

//router.get("/", verifyToken, isInstructor, CourseController.Dashboard);

export {router as CourseRoutes};
