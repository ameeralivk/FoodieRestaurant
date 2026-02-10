

import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_BASE_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
