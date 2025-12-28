"use client";

import { useEffect, useState } from "react";
import {
    UserPlus,
    CalendarPlus,
    Bell,
    Users,
    CalendarCheck,
    Clock
} from "lucide-react";
import socket from "@/lib/socket";

type Notification = {
    id: string;
    message: string;
};

export default function ReceptionistDashboard() {
    const [notifications] = useState<Notification[]>([
        { id: "1", message: "New appointment booked for 10:30 AM" },
        { id: "2", message: "Patient John Doe arrived" },
        { id: "3", message: "Payment pending for Room 2" },
    ]);

    useEffect(() => {
        socket.on("ready-for-payment", (data) => {
            // showToast(
            //     "info",
            //     `💰 ${data.serialNo} ready for payment by Dr. ${data.doctor}`
            // );
            // loadAppointments();
        });

        return () => {
            socket.off("ready-for-payment");
        };
    }, []);
    const todayAppointments = [
        { id: "a1", name: "John Doe", time: "10:30 AM", doctor: "Dr. Smith", status: "Waiting" },
        { id: "a2", name: "Anna Lee", time: "11:00 AM", doctor: "Dr. Brown", status: "Occupied" },
        { id: "a3", name: "Mark Wood", time: "12:15 PM", doctor: "Dr. Smith", status: "Ready for Payment" },
    ];

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

            {/* ===== Header ===== */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Receptionist Dashboard
                    </h1>
                    <p className="text-sm text-gray-500">
                        Manage patients and appointments efficiently
                    </p>
                </div>

                {/* Notifications */}
                <div className="relative group">
                    <div className="relative cursor-pointer">
                        <Bell className="w-6 h-6 text-gray-700" />
                        {notifications.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
                                {notifications.length}
                            </span>
                        )}
                    </div>

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        <div className="p-3 border-b font-medium text-gray-700">
                            Notifications
                        </div>
                        <ul className="max-h-60 overflow-y-auto">
                            {notifications.map((n) => (
                                <li
                                    key={n.id}
                                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                                >
                                    {n.message}
                                </li>
                            ))}
                            {notifications.length === 0 && (
                                <li className="px-4 py-3 text-sm text-gray-500">
                                    No new notifications
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* ===== Quick Actions ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    className="flex items-center justify-center gap-3 bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition shadow"
                >
                    <UserPlus />
                    <span className="font-medium">Add Patient</span>
                </button>

                <button
                    className="flex items-center justify-center gap-3 bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition shadow"
                >
                    <CalendarPlus />
                    <span className="font-medium">Add Appointment</span>
                </button>
            </div>

            {/* ===== Stats ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    title="Today's Appointments"
                    value={todayAppointments.length}
                    icon={<CalendarCheck />}
                />
                <StatCard
                    title="Patients Waiting"
                    value={todayAppointments.filter(a => a.status === "Waiting").length}
                    icon={<Clock />}
                />
                <StatCard
                    title="Total Patients Today"
                    value={12}
                    icon={<Users />}
                />
            </div>

            {/* ===== Today's Appointments ===== */}
            <div className="bg-white rounded-xl shadow border">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Today's Appointments
                    </h2>
                </div>
                <div className="divide-y">
                    {todayAppointments.map((a) => (
                        <div
                            key={a.id}
                            className="flex items-center justify-between p-4 hover:bg-gray-50"
                        >
                            <div>
                                <p className="font-medium text-gray-900">{a.name}</p>
                                <p className="text-sm text-gray-500">
                                    {a.time} • {a.doctor}
                                </p>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${a.status === "Waiting"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : a.status === "Occupied"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-green-100 text-green-700"
                                    }`}
                            >
                                {a.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

function StatCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-xl shadow border p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gray-100 text-gray-700">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-xl font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    );
}
