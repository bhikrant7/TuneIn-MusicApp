import { io } from "socket.io-client";

const baseURL = import.meta.env.MODE === "development" ? "http://localhost:5000": "/"
const socket = io(baseURL, {
  autoConnect: false,
  withCredentials: true,
});

export default socket;