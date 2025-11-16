import express from "express";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import shipmentRoutes from "./routes/shipment";


const app = express();

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/shipments", shipmentRoutes);

export default app;
