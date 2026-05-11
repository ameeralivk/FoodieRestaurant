import { io } from "socket.io-client";

const Socket = io("https://foodie.ameeralivk.buzz", {
  transports: ["websocket"],
  autoConnect: true,
});

export default Socket;

// import { io } from "socket.io-client";

// const Socket = io("http://localhost:3000", {
//   transports: ["websocket"],
//   autoConnect: true,
// });

// export default Socket
