import type { Request, Response } from "express";
import { success, errorresponse } from "../utils/response";
import { AuthService } from "../Services/Auth.Service";

export const register = async (req: Request, res: Response) => {
  try {
    const out = await AuthService.register(req.body);
    return success(res, out, "User registered successfully", 201);
  } catch (e: any) {
    if (e.message === "Email already in use") {
      return errorresponse(res, e.message, 400);
    }
    console.error(e);
    return errorresponse(res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const out = await AuthService.login(req.body);
    return success(res, out, "Login successful");
  } catch (e: any) {
    if (e.message === "Invalid credentials") {
      return errorresponse(res, e.message, 401);
    }
    console.error(e);
    return errorresponse(res);
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const out = await AuthService.refresh({ refreshToken: req.body.refreshToken });
    return success(res, out, "Token refreshed");
  } catch (e) {
    return errorresponse(res, "Invalid refresh token", 401);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    await AuthService.logout({ refreshToken: req.body.refreshToken });
    return success(res, {}, "Logged out");
  } catch (e) {
    console.error(e);
    return errorresponse(res);
  }
};
