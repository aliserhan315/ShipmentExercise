
import type { Response } from "express";
import { success, errorresponse } from "../utils/response";
import { UserService } from "../Services/User.Service";
import type { AuthRequest } from "../middleware/Auth";

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return errorresponse(res, "Unauthorized", 401);
    }
    const user = await UserService.getById(req.user.id);
    return success(res, user, "Current user");
  } catch (e: any) {
    if (e.message === "User not found") {
      return errorresponse(res, e.message, 404);
    }
    console.error(e);
    return errorresponse(res);
  }
};

export const updateMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return errorresponse(res, "Unauthorized", 401);
    }

    const user = await UserService.updateProfile(req.user.id, req.body);
    return success(res, user, "Profile updated");
  } catch (e: any) {
    if (e.message === "User not found") {
      return errorresponse(res, e.message, 404);
    }
    console.error(e);
    return errorresponse(res);
  }
};
