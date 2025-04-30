import express from "express";
import { AdminController } from "../controllers/AdminController.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { verifyToken } from "../middlewares/verify-token.js";

const router = express.Router();

// Admin Dashboard
router.get("/", verifyToken, isAdmin, AdminController.Dashboard);
router.post("/create-user", verifyToken, isAdmin, AdminController.CreateUser);
router.get("/user/:id", verifyToken, isAdmin, AdminController.getUserById);
router.patch("/user/edit/:id", verifyToken, isAdmin, AdminController.UpdateUser);
router.delete("/user/delete/:id", verifyToken, isAdmin, AdminController.DeleteUser);

// Courses managment
//router.get("/courses", verifyToken, isAdmin, AdminController.Courses);
// Prizes managment
//router.get("/prizes", verifyToken, isAdmin, AdminController.Prizes);

export { router as AdminRoutes };
