import { DataTypes,Model,Optional } from "sequelize";
import { sequelize } from "../config/db";
import User from "./User";

interface SessionAttributes {
    id: number;
    userId: number;
    refreshToken: string;
    expiresAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
  
type SessionCreationAttributes = Optional<
  SessionAttributes,
  "id"  | "createdAt" | "updatedAt"
>;

class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
    public id!: number;
    public userId!: number;
    public refreshToken!: string;
    public expiresAt!: Date;
    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;
}
Session.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "sessions",
    timestamps: true,
  }
);

User.hasMany(Session, { foreignKey: "userId", as: "sessions" });
Session.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Session;

