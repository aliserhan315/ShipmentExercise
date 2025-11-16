import jwt from "jsonwebtoken";
import type { NextFunction, Response, Request } from "express";
import { errorresponse  } from "../utils/response";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export interface JwtPayload {
  id: number;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authRequired = (req: AuthRequest, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return errorresponse(res, "Unauthorized", 401);
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    return errorresponse(res, "Invalid or expired token", 401);
  }
};

export const authOptional = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) return next();

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = payload;
  } catch {
 
  }

  next();
};
