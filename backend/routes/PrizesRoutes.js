import express from "express";
import { PrizeController } from "../controllers/CourseController.js";
import { isCompany } from "../middlewares/isInstructor.js";
import { verifyToken } from "../middlewares/verify-token.js";

const router = express.Router();

//router.get("/", verifyToken, isInstructor, PrizeController.Dashboard);

export {router as PrizesRoutes};
