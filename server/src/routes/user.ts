import { Router } from "express";
import { getMe, updateMe } from "../Controllers/User.Controller";
import { authRequired } from "../middleware/Auth";

const router = Router();

router.get("/me", authRequired, getMe);
router.put("/me", authRequired, updateMe);

export default router;
