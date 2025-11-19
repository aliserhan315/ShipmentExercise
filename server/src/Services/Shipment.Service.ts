import Shipment, { ShipmentStatus } from "../models/Shipment";
import { WeatherService } from "./WeatherService";

export interface CreateShipmentInput {
  waybill: string;
  customerName: string;
  customerPhone: string;
  city: string;
  country: string;
  street: string;
  building: string;
}

export interface UpdateShipmentInput {
  customerName?: string;
  customerPhone?: string;
  city?: string;
  country?: string;
  street?: string;
  building?: string;
  status?: ShipmentStatus;
}

export const ShipmentService = {
  async createShipment(userId: number, input: CreateShipmentInput) {
    const existing = await Shipment.findOne({
      where: { waybill: input.waybill },
    });

    if (existing) {
      throw new Error("Waybill already exists");
    }

    const shipment = await Shipment.create({
      waybill: input.waybill.trim(),
      customerName: input.customerName.trim(),
      customerPhone: input.customerPhone.trim(),
      city: input.city.trim(),
      country: input.country.trim(),
      street: input.street.trim(),
      building: input.building.trim(),
      userId,
    });

    try {
      const weather = await WeatherService.getWeatherForCityAndCountry(
        input.city,
        input.country
      );
      if (weather) {
        shipment.weatherSnapshot = weather;
        await shipment.save();
      }
    } catch {
    }

    return shipment;
  },

  async listShipments(
    userId: number,
    query: { status?: string; search?: string }
  ) {
    const where: any = { userId };

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      const s = `%${query.search}%`;
      where["$or"] = [
        { waybill: query.search },
        { customerName: { $like: s } },
        { city: { $like: s } },
        { country: { $like: s } },
        { street: { $like: s } },
        { building: { $like: s } },
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

  async updateShipment(
    userId: number,
    id: number,
    data: UpdateShipmentInput
  ) {
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
    if (typeof data.city === "string") {
      shipment.city = data.city.trim();
    }
    if (typeof data.country === "string") {
      shipment.country = data.country.trim();
    }
    if (typeof data.street === "string") {
      shipment.street = data.street.trim();
    }
    if (typeof data.building === "string") {
      shipment.building = data.building.trim();
    }

    if (data.city || data.country) {
      try {
        const weather = await WeatherService.getWeatherForCityAndCountry(
          shipment.city,
          shipment.country
        );
        if (weather) {
          shipment.weatherSnapshot = weather;
        }
      } catch {
      }
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
