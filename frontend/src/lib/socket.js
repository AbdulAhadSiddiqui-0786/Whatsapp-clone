import { io } from "socket.io-client";

const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
export const socket = io(URL, { autoConnect: true });

export function joinRoom(wa_id) { socket.emit("join", wa_id); }
export function leaveRoom(wa_id) { socket.emit("leave", wa_id); }
