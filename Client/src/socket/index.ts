import { io } from "socket.io-client";

const Socket = io("wss://moobiworld.shop/socket.io", {
  transports: ["websocket"],
  autoConnect: true,
});

export default Socket

// import { io } from "socket.io-client";

// const Socket = io("http://localhost:3000", {
//   transports: ["websocket"],
//   autoConnect: true,
// });

// export default Socket