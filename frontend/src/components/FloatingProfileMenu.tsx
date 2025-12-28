"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function FloatingProfileMenu() {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { logout, user } = useAuth();

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div
            ref={ref}
            className="fixed bottom-6 right-6 z-50"
        >
            {/* Dropup Menu */}
            {open && (
                <div
                    className="
            absolute bottom-14 right-0
            w-44
            bg-white
            rounded-xl
            shadow-xl
            border
            overflow-hidden
            animate-fade-up
          "
                >
                    <button
                        onClick={() => {
                            setOpen(false);
                            router.push("/Admin-Portal/Profile");
                        }}
                        className="
              w-full text-left px-4 py-3
              text-sm
              text-gray-800
              hover:bg-gray-100
            "
                    >
                        👤 Profile
                    </button>

                    <button
                        onClick={() => {
                            logout();
                            router.push("/login");
                        }}
                        className="
              w-full text-left px-4 py-3
              text-sm text-red-600
              hover:bg-red-50
            "
                    >
                        🚪 Logout
                    </button>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setOpen(!open)}
                className="
          w-12 h-12
          rounded-full 
          bg-blue-600
          text-white
          flex items-center justify-center
          shadow-lg
          hover:bg-blue-700
          transition
        "
                title="Profile menu"
            >
                {user?.name?.[0] ?? "A"}
            </button>
        </div>
    );
}
