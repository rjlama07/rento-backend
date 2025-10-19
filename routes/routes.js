import { Router } from "express";
import {
  registerController,
  loginController,
  refreshTokenController,
  logoutController,
  getUserProfileController,
} from "../controller/userController.js";
import { authenticateToken } from "../auth/auth.js";

const router = Router();

router.get("/", (req, res) => {
  return res.json("Hello");
});

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/refreshToken", refreshTokenController);
router.post("/logout", logoutController);
router.get("/profile", authenticateToken, getUserProfileController);

export default router;
