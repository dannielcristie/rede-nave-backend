import { Router } from "express";
import coursesController from "../controllers/courses.controller";

const router = Router();

router.get("/", coursesController.list);
router.get("/:slug", coursesController.get);

export default router;
