// import { Server } from "socket.io";
// import { Server as HttpServer } from "http";

// let io: Server;

// export const initSocket = (httpServer: HttpServer) => {
//   io = new Server(httpServer, {
//     cors: {
//       origin: process.env.FRONTEND_BASE_URL,
//       credentials: true,
//     },
//   });

//   // io.on("connection", (socket) => {
//   //   console.log("🔌 socket connected:", socket.id);

//   //   socket.on("disconnect", () => {
//   //     console.log("❌ socket disconnected:", socket.id);
//   //   });
//   // });

//   io.on("connection", (socket) => {
//     socket.on("join-restaurant", (restaurantId) => {
//       socket.join(restaurantId);
//       console.log(`Socket ${socket.id} joined restaurant ${restaurantId}`);
//     });
//   });

//   return io;
// };

// export const getIO = () => {
//   if (!io) {
//     throw new Error("Socket.io not initialized");
//   }
//   return io;
// };

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
    console.log("🔌 Connected:", socket.id);

    socket.on(
      "join-restaurant",
      ({
        restaurantId,
        role,
        userId,
      }: {
        restaurantId: string;
        role: string;
         userId?: string;
      }) => {
        // Common room (optional)
        socket.join(restaurantId);

        // Role-based rooms
        if (role === "chef") {
          socket.join(`${restaurantId}-chef`);
        }

        if (role === "staff") {
          socket.join(`${restaurantId}-staff`);
        }

        if (role === "user" && userId) {
          socket.join(`${userId}-user`);
          console.log(`Socket ${socket.id} joined user room ${userId}-user`);
        }

        console.log(`Socket ${socket.id} joined ${restaurantId}-${role}`);
      },
    );

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
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
