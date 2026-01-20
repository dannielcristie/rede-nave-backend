import { Request, Response } from "express";
import { AuthService } from "../services/auth.services";

const service = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
    const { name, email, password, role, cpf, phone, bio, address } = req.body;

      const result = await service.register({ name, email, password, role, cpf, phone, bio, address });
      return res.json(result);
    } catch (e: any) {
      return res
        .status(400)
        .json({ error: e.message });
    };
  };


  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await service.login(email, password);

      res.json(result)
    } catch (e: any) {
      return res
        .status(400)
        .json({ error: e.message });
    };
  };

  async me(req: Request, res: Response) {
    try {
      const user = await service.me(req.user!.userId);
      return res.json({ user });
    } catch (e: any) {
      return res.status(404).json({ error: e.message });
    }
  };

};