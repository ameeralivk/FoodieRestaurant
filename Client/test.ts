import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
});

socket.on("order:new", (data) => {
  console.log("🔥 New order received:", data);
});
