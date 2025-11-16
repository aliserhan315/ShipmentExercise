import type { Response } from "express";
import { success, errorresponse } from "../utils/response";
import { ShipmentService } from "../Services/Shipment.Service";
import type { AuthRequest } from "../middleware/Auth";

export const createShipment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return errorresponse(res, "Unauthorized", 401);
    }

    const shipment = await ShipmentService.createShipment(req.user.id, req.body);
    return success(res, shipment, "Shipment created", 201);
  } catch (e: any) {
    if (e.message === "Waybill already exists") {
      return errorresponse(res, e.message, 400);
    }
    console.error(e);
    return errorresponse(res);
  }
};

export const listShipments = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return errorresponse(res, "Unauthorized", 401);
    }

    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    const shipments = await ShipmentService.listShipments(req.user.id, {
      status,
      search,
    });

    return success(res, shipments, "Shipments fetched");
  } catch (e) {
    console.error(e);
    return errorresponse(res);
  }
};

export const getShipment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return errorresponse(res, "Unauthorized", 401);
    }

    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return errorresponse(res, "Invalid shipment id", 400);
    }

    const shipment = await ShipmentService.getShipmentById(req.user.id, id);
    return success(res, shipment, "Shipment details");
  } catch (e: any) {
    if (e.message === "Shipment not found") {
      return errorresponse(res, e.message, 404);
    }
    console.error(e);
    return errorresponse(res);
  }
};

export const updateShipment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return errorresponse(res, "Unauthorized", 401);
    }

    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return errorresponse(res, "Invalid shipment id", 400);
    }

    const shipment = await ShipmentService.updateShipment(req.user.id, id, req.body);
    return success(res, shipment, "Shipment updated");
  } catch (e: any) {
    if (e.message === "Shipment not found") {
      return errorresponse(res, e.message, 404);
    }
    console.error(e);
    return errorresponse(res);
  }
};

export const cancelShipment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return errorresponse(res, "Unauthorized", 401);
    }

    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return errorresponse(res, "Invalid shipment id", 400);
    }

    const shipment = await ShipmentService.cancelShipment(req.user.id, id);
    return success(res, shipment, "Shipment canceled");
  } catch (e: any) {
    if (e.message === "Shipment not found") {
      return errorresponse(res, e.message, 404);
    }
    console.error(e);
    return errorresponse(res);
  }
};
