import { io } from "socket.io-client";

const Socket = io("http://localhost:3000", {
  transports: ["websocket"],
  autoConnect: true,
});

export default Socket