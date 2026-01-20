import { Request, Response } from "express";
import { lessonsService } from "../services/lessons.services";

class LessonsController {
    async get(req: Request, res: Response) {
        try {
            const { id } = req.params;
            // Assume isAuthenticated middleware adds user to req (req.user)
            // We need to extend Request type or use (req as any).user for now
            const userId = (req as any).user?.userId;

            if (!userId) {
                // If public/preview, userId might be undefined. 
                // But for now let's enforce auth for the /lessons/:id endpoint as per spec implies private consumption
                // If it is a preview lesson, maybe we allow? 
                // For now, let's assume valid token.
                return res.status(401).json({ error: "Não autorizado." });
            }

            const lesson = await lessonsService.getLesson(id, userId);
            return res.json(lesson);
        } catch (error: any) {
            if (error.message === "Aula não encontrada.") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Você não tem acesso a esta aula.") {
                return res.status(403).json({ error: error.message });
            }
            return res.status(500).json({ error: "Erro ao buscar aula." });
        }
    }
}

export default new LessonsController();
