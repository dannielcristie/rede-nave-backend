import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", isAuthenticated, authController.me);

export default router;
