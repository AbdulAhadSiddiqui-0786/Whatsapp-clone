import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/connectDB.js";
import apiRoutes from "./routes/api.js";

// Initial setup
dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // In production, restrict this to your frontend's domain
  },
});

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Custom middleware to attach socket.io to each request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use("/api", apiRoutes);

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log(`📡 Client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
