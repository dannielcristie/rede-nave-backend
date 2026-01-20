import { Request, Response } from "express";
import { coursesService } from "../services/courses.services";

class CoursesController {
    async list(req: Request, res: Response) {
        try {
            const courses = await coursesService.listCourses();
            return res.json(courses);
        } catch (error: any) {
            return res.status(500).json({ error: "Erro ao buscar cursos." });
        }
    }

    async get(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            const course = await coursesService.getCourseBySlug(slug);
            return res.json(course);
        } catch (error: any) {
            if (error.message === "Curso não encontrado.") {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: "Erro ao buscar curso." });
        }
    }
}

export default new CoursesController();
