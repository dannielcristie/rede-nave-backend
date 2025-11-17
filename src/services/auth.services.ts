import prisma from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/hash.utils";
import { signJWT } from "../utils/jwt.utils";
import { Role } from "@prisma/client";




export class AuthService {
  async register(name: string, email: string, password: string, role: Role) {
    const exists = await prisma.user.findUnique({ where: { email } });

    if (exists) throw new Error("Email já registrado.");

    const password_hash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, password_hash, role },
    });

    const token = signJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  };

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });


    if (!user) throw new Error("credencial invalida.");

    const isValid = await comparePassword(password, user.password_hash);

    if (!isValid) throw new Error("credencial invalida.");

    const token = signJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    });


    return { token };


  };

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true }
    });
    if (!user) throw new Error("Usuário não encontrado.");
    return user;
  }

};