import "dotenv/config";
import app from "./app";
import { connectDB, sequelize } from "./config/db"; 
import "./models/User"; 

const PORT = 5000;

const start = async () => {
  try {
    await connectDB();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Couldnot start ", err);
    process.exit(1);
  }
};

start();
