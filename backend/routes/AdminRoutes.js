import express from "express";
import { AdminController } from "../controllers/AdminController.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { verifyToken } from "../middlewares/verify-token.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, AdminController.Dashboard);
router.post("/create-user", verifyToken, isAdmin, AdminController.CreateUser);
router.get("/user/:id", verifyToken, isAdmin, AdminController.getUserById);
router.patch("/user/edit/:id", verifyToken, isAdmin, AdminController.UpdateUser);
router.delete("/user/delete/:id", verifyToken, isAdmin, AdminController.DeleteUser);

export { router as AdminRoutes };
