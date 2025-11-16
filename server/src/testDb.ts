import { connectDB } from "./config/db";

const start = async () => {
  await connectDB();
  process.exit(0);
};

start();