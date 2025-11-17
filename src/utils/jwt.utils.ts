import jwt, {SignOptions} from "jsonwebtoken";
import { Role } from "@prisma/client";

export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
}

const SECRET = process.env.JWT_SECRET!;

const EXPIRES_IN: SignOptions["expiresIn"] = (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || '1d';

export function signJWT(payload: JWTPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
};

export function verifyJWT(token:string){
  return jwt.verify(token, SECRET) as JWTPayload;
};