import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import shipmentRoutes from "./routes/shipment";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/shipments", shipmentRoutes);

export default app;
