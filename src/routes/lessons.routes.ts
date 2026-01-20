import { Router } from "express";
import lessonsController from "../controllers/lessons.controller";
import { isAuthenticated } from "../middlewares/auth.middleware"; // Assuming this exists or will be verified

const router = Router();

router.get("/:id", isAuthenticated, lessonsController.get);

export default router;
