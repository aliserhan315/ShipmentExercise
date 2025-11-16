import Shipment, { ShipmentStatus } from "../models/Shipment";

interface CreateShipmentInput {
  waybill: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
}

interface UpdateShipmentInput {
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  status?: ShipmentStatus;
}

export const ShipmentService = {
  async createShipment(userId: number, input: CreateShipmentInput) {
    const existing = await Shipment.findOne({ where: { waybill: input.waybill } });
    if (existing) {
      throw new Error("Waybill already exists");
    }

    const shipment = await Shipment.create({
      waybill: input.waybill,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerAddress: input.customerAddress,
      userId,
    });

    return shipment;
  },

  async listShipments(userId: number, query: { status?: string; search?: string }) {
    const where: any = { userId };

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      const s = `%${query.search}%`;
      where["$or"] = [
        { waybill: query.search },
        { customerName: { $like: s } }, 
      ];
    }

    const shipments = await Shipment.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return shipments;
  },

  async getShipmentById(userId: number, id: number) {
    const shipment = await Shipment.findOne({ where: { id, userId } });
    if (!shipment) {
      throw new Error("Shipment not found");
    }
    return shipment;
  },

  async updateShipment(userId: number, id: number, data: UpdateShipmentInput) {
    const shipment = await Shipment.findOne({ where: { id, userId } });
    if (!shipment) {
      throw new Error("Shipment not found");
    }

    if (typeof data.customerName === "string") {
      shipment.customerName = data.customerName.trim();
    }
    if (typeof data.customerPhone === "string") {
      shipment.customerPhone = data.customerPhone.trim();
    }
    if (typeof data.customerAddress === "string") {
      shipment.customerAddress = data.customerAddress.trim();
    }
   
    if (data.status) {
      shipment.status = data.status;
    }

    await shipment.save();
    return shipment;
  },

  async cancelShipment(userId: number, id: number) {
    const shipment = await Shipment.findOne({ where: { id, userId } });
    if (!shipment) {
      throw new Error("Shipment not found");
    }

    shipment.status = "CANCELED";
    await shipment.save();

    return shipment;
  },
};
