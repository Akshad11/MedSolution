import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "../config/db.js";

await connectDB();

const server = http.createServer(app);

// ✅ Socket.IO setup
export const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// ✅ Socket events
// io.on("connection", (socket) => {
//     console.log("🔌 Socket connected:", socket.id);

//     socket.on("join", ({ userId, role }) => {
//         if (userId) socket.join(userId);   // personal room
//         if (role) socket.join(role);       // role room (doctor / receptionist)
//         console.log(`➡️ joined rooms: ${userId}, ${role}`);
//     });

//     socket.on("disconnect", (reason) => {
//         console.log("❌ Socket disconnected:", socket.id, reason);
//     });
// });

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
