"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menu = [
    { label: "Dashboard", path: "/Admin-Portal" },
    { label: "Doctors", path: "/Admin-Portal/Doctors" },
    { label: "Receptionists", path: "/Admin-Portal/Receptionists" },
    { label: "Patients", path: "/Admin-Portal/Patients" },
    { label: "Services", path: "/Admin-Portal/Services" },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* 🔵 Mobile Header */}
            <header className="sm:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b flex items-center px-4">
                <button
                    onClick={() => setOpen(true)}
                    className="text-2xl text-gray-700"
                >
                    ☰
                </button>
                <span className="ml-3 font-semibold text-blue-600">
                    Clinic Admin
                </span>
            </header>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 sm:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar Drawer */}
            <aside
                className={`
          fixed top-0 left-0 z-50
          h-full w-64
          bg-white shadow-lg
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          sm:static sm:translate-x-0
        `}
            >
                {/* Sidebar Header (desktop only) */}
                <div className="hidden sm:block p-6 text-xl font-bold text-blue-600 border-b">
                    Clinic Admin
                </div>

                {/* Menu */}
                <nav className="px-4 py-6 space-y-1">
                    {menu.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            onClick={() => setOpen(false)}
                            className={`block rounded-lg px-4 py-2 text-sm font-medium transition
                ${pathname === item.path
                                    ? "bg-blue-100 text-blue-600"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
}
