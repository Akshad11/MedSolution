"use client";

import { useEffect, useMemo, useState } from "react";
import {
    CalendarCheck,
    CheckCircle,
    IndianRupee,
    ClipboardList,
    Stethoscope,
} from "lucide-react";
import { getAppointments } from "@/lib/authApi";
import { Appointment } from "@/types/user";
import { useAppToast } from "@/app/hooks/useAppToast";
import { useAuth } from "@/context/AuthContext";

export default function DoctorReportsPage() {
    const { ToastView, showToast } = useAppToast();
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const today = new Date().toISOString().slice(0, 10);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getAppointments();
                setAppointments(res.data || []);
            } catch (err: any) {
                showToast("error", err?.message || "Failed to load reports");
            }
        };
        load();
    }, []);

    /* ================= FILTER ONLY MY APPOINTMENTS ================= */

    const myAppointments = useMemo(() => {
        return appointments.filter(
            (a) => a.doctor?._id === user?._id
        );
    }, [appointments, user]);

    const todayAppointments = myAppointments.filter(
        (a) => a.date?.slice(0, 10) === today
    );

    const completed = myAppointments.filter(
        (a) => a.status?.name === "Completed"
    );

    const totalRevenue = completed.reduce((sum, a) => {
        const total =
            a.lines?.reduce((s, l) => s + (l.amount || 0), 0) || 0;
        return sum + total;
    }, 0);

    const statusCounts = useMemo(() => {
        const map: Record<string, number> = {};
        myAppointments.forEach((a) => {
            const name = a.status?.name || "Unknown";
            map[name] = (map[name] || 0) + 1;
        });
        return map;
    }, [myAppointments]);

    return (
        <div className="p-6 md:p-10 space-y-8 bg-gray-50 min-h-screen">
            <ToastView />

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    My Reports
                </h1>
                <p className="text-sm text-gray-600">
                    Overview of your patients & earnings
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    title="Total Patients"
                    value={myAppointments.length}
                    icon={<ClipboardList />}
                    color="bg-blue-600"
                />
                <StatCard
                    title="Today's Patients"
                    value={todayAppointments.length}
                    icon={<CalendarCheck />}
                    color="bg-emerald-600"
                />
                <StatCard
                    title="Completed"
                    value={completed.length}
                    icon={<CheckCircle />}
                    color="bg-purple-600"
                />
                <StatCard
                    title="My Revenue"
                    value={`₹${totalRevenue}`}
                    icon={<IndianRupee />}
                    color="bg-orange-600"
                />
            </div>

            {/* Status Breakdown */}
            <div className="bg-white rounded-2xl shadow p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Status Breakdown
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {Object.entries(statusCounts).map(([status, count]) => (
                        <div
                            key={status}
                            className="rounded-xl border bg-gray-50 p-4 text-center hover:shadow transition"
                        >
                            <p className="text-sm text-gray-500">{status}</p>
                            <p className="text-xl font-bold text-gray-900">
                                {count}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Completed */}
            <div className="bg-white rounded-2xl shadow p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Recent Completed Appointments
                </h2>

                {completed.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        No completed appointments yet.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600">
                                    <th className="text-left px-3 py-2">
                                        Serial
                                    </th>
                                    <th className="text-left px-3 py-2">
                                        Patient
                                    </th>
                                    <th className="text-left px-3 py-2">
                                        Date
                                    </th>
                                    <th className="text-left px-3 py-2">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {completed.slice(0, 10).map((a) => {
                                    const total =
                                        a.lines?.reduce(
                                            (s, l) => s + (l.amount || 0),
                                            0
                                        ) || 0;

                                    return (
                                        <tr
                                            key={a._id}
                                            className="border-t hover:bg-gray-50"
                                        >
                                            <td className="px-3 py-2 font-semibold">
                                                {a.serialNo}
                                            </td>
                                            <td className="px-3 py-2">
                                                {a.patient?.name}
                                            </td>
                                            <td className="px-3 py-2">
                                                {a.date?.slice(0, 10)}
                                            </td>
                                            <td className="px-3 py-2 font-semibold text-green-600">
                                                ₹{total}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
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
