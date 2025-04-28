// server.ts
import "dotenv/config";
import app from "./app";
import mongoose from "mongoose";
import { Server } from "http";
import "dotenv/config";

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/fake_so";
const port = process.env.PORT ? parseInt(process.env.PORT) : 8000;

let server: Server;

async function startServer() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");

    server = app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server started at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Error starting server:", err);
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", () => {
  if (server) {
    server.close(() => {
      console.log("🛑 Server closed.");
    });
  }
  mongoose.disconnect()
    .then(() => {
      console.log("🗃️ MongoDB disconnected.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Error disconnecting MongoDB:", err);
      process.exit(1);
    });
});
