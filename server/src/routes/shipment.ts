import { Router } from "express";
import {  createShipment,  listShipments,  getShipment,  updateShipment,  cancelShipment,} from "../Controllers/Shipment.Controller";
import { authRequired } from "../middleware/Auth";

const router = Router();

router.post("/", authRequired, createShipment);
router.get("/", authRequired, listShipments);
router.get("/:id", authRequired, getShipment);
router.patch("/:id", authRequired, updateShipment);
router.delete("/:id", authRequired, cancelShipment);

export default router;
