"use client";

import { useEffect, useState } from "react";
import {
    CalendarCheck,
    Users,
    IndianRupee,
    BarChart3,
    Stethoscope,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAppToast } from "@/app/hooks/useAppToast";
import { getAppointments } from "@/lib/authApi";
import { Appointment } from "@/types/user";
import Link from "next/link";
import socket from "@/lib/socket";

export default function DoctorDashboard() {
    const { user } = useAuth();
    const { ToastView } = useAppToast();
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const today = new Date().toISOString().slice(0, 10);

    useEffect(() => {
        const load = async () => {
            const res = await getAppointments();
            setAppointments(res.data || []);
        };
        load();
    }, []);

    useEffect(() => {
        socket.on("new-appointment", (data) => {
            // showToast("info", `🔔 ${data.message} (${data.serialNo})`);
            // loadAppointments(); // refresh list
        });

        return () => {
            socket.off("new-appointment");
        };
    }, []);
    const myAppointments = appointments.filter(
        (a) => a.doctor?._id === user?._id
    );

    const todayAppointments = myAppointments.filter(
        (a) => a.date?.slice(0, 10) === today
    );

    const completed = myAppointments.filter(
        (a) => a.status?.name === "Completed"
    );

    const totalEarning = completed.reduce((sum, a) => {
        const total =
            a.lines?.reduce((s, l) => s + (l.amount || 0), 0) || 0;
        return sum + total;
    }, 0);

    return (
        <div className="p-6 md:p-10 space-y-8 bg-gray-50 min-h-screen">
            <ToastView />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome, Dr. {user?.name} 👋
                    </h1>
                    <p className="text-sm text-gray-600">
                        Here’s your overview for today
                    </p>
                </div>

                <Link
                    href="/doctors/reports"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow"
                >
                    <BarChart3 size={18} />
                    View Reports
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    title="Today's Appointments"
                    value={todayAppointments.length}
                    icon={<CalendarCheck />}
                    color="bg-blue-600"
                />
                <StatCard
                    title="Total Patients"
                    value={myAppointments.length}
                    icon={<Users />}
                    color="bg-emerald-600"
                />
                <StatCard
                    title="Completed"
                    value={completed.length}
                    icon={<Stethoscope />}
                    color="bg-purple-600"
                />
                <StatCard
                    title="Earnings"
                    value={`₹${totalEarning}`}
                    icon={<IndianRupee />}
                    color="bg-orange-600"
                />
            </div>

            {/* Today’s Queue */}
            <div className="bg-white rounded-2xl shadow p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Today’s Appointments
                </h2>

                {todayAppointments.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        No appointments scheduled for today.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {todayAppointments.slice(0, 5).map((a) => (
                            <div
                                key={a._id}
                                className="flex items-center justify-between p-3 rounded-xl border bg-gray-50 hover:bg-gray-100 transition"
                            >
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {a.patient?.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {a.time} • {a.status?.name}
                                    </p>
                                </div>

                                <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                                    {a.serialNo}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-4 text-right">
                    <Link
                        href="/doctors/appointments"
                        className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                        View all →
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* ---------------- Reusable Stat Card ---------------- */

function StatCard({
    title,
    value,
    icon,
    color,
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-white shadow p-5 hover:shadow-lg transition group">
            <div
                className={`absolute -top-6 -right-6 w-20 h-20 rounded-full ${color} opacity-20 group-hover:scale-110 transition`}
            />
            <div className="flex items-center gap-4">
                <div
                    className={`w-12 h-12 rounded-xl ${color} text-white flex items-center justify-center shadow`}
                >
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}
