import { Router } from "express";
import coursesController from "../controllers/courses.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router.get("/my-courses", isAuthenticated, coursesController.myCourses);
router.get("/", coursesController.list);
router.get("/:slug", coursesController.get);

export default router;
