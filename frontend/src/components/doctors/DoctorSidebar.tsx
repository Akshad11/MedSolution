"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    CalendarCheck,
    ClipboardList,
    LogOut,
    Menu,
    X,
    User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const menu = [
    {
        name: "Dashboard",
        href: "/doctors",
        icon: LayoutDashboard,
    },
    {
        name: "Appointments",
        href: "/doctors/appointments",
        icon: CalendarCheck,
    },
    {
        name: "Patients",
        href: "/doctors/patients",
        icon: User,
    },
    {
        name: "Reports",
        href: "/doctors/reports",
        icon: ClipboardList,
    },
];

export default function DoctorSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const [open, setOpen] = useState(false);      // mobile
    const [collapsed, setCollapsed] = useState(false); // desktop

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-gray-900 text-white flex items-center justify-between px-4 z-40">
                <button onClick={() => setOpen(true)}>
                    <Menu size={22} />
                </button>
                <span className="font-semibold">Doctor</span>
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm">
                    {user?.name?.[0] ?? "D"}
                </div>
            </div>

            {/* Overlay for mobile */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 z-50
          h-screen bg-gray-900 text-white
          flex flex-col
          transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
                    {!collapsed && (
                        <span className="text-lg font-semibold">Doctor</span>
                    )}

                    <div className="flex items-center gap-2">
                        {/* Collapse toggle (desktop) */}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden md:block text-gray-400 hover:text-white"
                        >
                            {collapsed ? <Menu size={18} /> : <X size={18} />}
                        </button>

                        {/* Close (mobile) */}
                        <button
                            onClick={() => setOpen(false)}
                            className="md:hidden text-gray-400 hover:text-white"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* User Info */}
                <div className="px-4 py-4 border-b border-gray-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold">
                        {user?.name?.[0] ?? "D"}
                    </div>
                    {!collapsed && (
                        <div>
                            <p className="text-sm font-medium">{user?.name}</p>
                            <p className="text-xs text-gray-400">Doctor</p>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {menu.map((item) => {
                        const active = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`
                  flex items-center gap-3
                  px-3 py-2.5 rounded-lg text-sm transition
                  ${active
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                    }
                `}
                            >
                                <Icon size={18} />
                                {!collapsed && (
                                    <span className="flex-1">{item.name}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="px-3 py-4 border-t border-gray-800">
                    <button
                        onClick={() => {
                            logout();
                            router.push("/login");
                        }}
                        className="
              flex items-center gap-3
              w-full px-3 py-2.5
              rounded-lg text-sm
              text-red-400
              hover:bg-gray-800 hover:text-red-300
            "
                    >
                        <LogOut size={18} />
                        {!collapsed && "Logout"}
                    </button>
                </div>
            </aside>
        </>
    );
}
