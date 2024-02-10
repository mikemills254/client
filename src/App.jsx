import { Route, Routes, Navigate } from "react-router-dom";
import Inbox from "./Pages/Inbox";
import Urgent from "./Pages/Urgent";
import Home from "./Pages/Home";
import { io } from "socket.io-client";

export default function App() {
    const socket = io.connect("http://localhost:9000");
    console.log(socket)
    return (
        <div className="w-screen h-screen flex flex-row">
        <Routes>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/urgent_messages" element={<Urgent />} />
            <Route path="/your_inbox" element={<Inbox />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        </div>
    );
}
