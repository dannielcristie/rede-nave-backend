import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/jwt.utils";

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header)
    return res.status(401).json({ error: "Sem token" });

  const [, token] = header.split(" ");

  try {
    const decoded = verifyJWT(token);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    next()
  } catch {
    return res.status(401)
      .json({ error: "token invalido." });
  };

};
