import { UserController } from "../controllers/UserController.js";
import express from "express";
import { verifyToken } from "../middlewares/verify-token.js";
const router = express.Router();
import { imageUploader } from "../middlewares/imageUploader.js";

// register
router.post("/register", UserController.Register);
// login 
router.post("/login", UserController.Login);
// logout
router.post("/logout", UserController.Logout);
// check user
router.get("/check-user", UserController.checkUser); 
//profile
router.get("/profile/:id", verifyToken, UserController.getUserById);
// edit profile
router.patch("/profile/edit/:id", verifyToken, imageUploader.single("image"), UserController.Update);
// delete profile
router.delete("/profile/delete/:id", verifyToken, UserController.Delete);
// refresh user token
router.get("/refresh", UserController.refreshUserToken);

export {router as UserRoutes};