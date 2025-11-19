import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";
import User from "./User";

export type ShipmentStatus =
  | "CREATED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELED";

export interface ShipmentAttributes {
  id: number;
  waybill: string;
  customerName: string;
  customerPhone: string;
  city: string;
  country: string;
  street: string;
  building: string;
  status: ShipmentStatus;
  userId: number;
  weatherSnapshot?: object | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ShipmentCreationAttributes = Optional<
  ShipmentAttributes,
  "id" | "status" | "weatherSnapshot" | "createdAt" | "updatedAt"
>;

class Shipment
  extends Model<ShipmentAttributes, ShipmentCreationAttributes>
  implements ShipmentAttributes
{
  public id!: number;
  public waybill!: string;
  public customerName!: string;
  public customerPhone!: string;
  public city!: string;
  public country!: string;
  public street!: string;
  public building!: string;
  public status!: ShipmentStatus;
  public userId!: number;
  public weatherSnapshot?: object | null;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
}

Shipment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    waybill: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    customerName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    customerPhone: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    building: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("CREATED", "IN_TRANSIT", "DELIVERED", "CANCELED"),
      allowNull: false,
      defaultValue: "CREATED",
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    weatherSnapshot: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "shipments",
    timestamps: true,
  }
);

User.hasMany(Shipment, { foreignKey: "userId", as: "shipments" });
Shipment.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Shipment;
