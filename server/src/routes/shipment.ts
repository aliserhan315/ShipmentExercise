import { Router } from "express";
import {  createShipment,  listShipments,  getShipment,  updateShipment,  cancelShipment,} from "../Controllers/Shipment.Controller";
import { authRequired ,authOptional} from "../middleware/Auth";

const router = Router();

router.post("/", authOptional, createShipment);
router.get("/", authRequired, listShipments);
router.get("/:id", authRequired, getShipment);
router.patch("/:id", authRequired, updateShipment);
router.delete("/:id", authRequired, cancelShipment);

export default router;
