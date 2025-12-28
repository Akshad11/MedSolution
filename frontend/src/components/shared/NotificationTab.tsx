// components/shared/NotificationTab.tsx
"use client";

import { Bell } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

export default function NotificationTab() {
    const { notifications, markRead } = useNotifications();

    const unread = notifications.filter((n: any) => !n.read);

    return (
        <div className="relative">
            <button className="flex items-center gap-2">
                <Bell />
                {unread.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2">
                        {unread.length}
                    </span>
                )}
            </button>

            <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg max-h-96 overflow-y-auto z-50">
                {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500">
                        No notifications
                    </p>
                ) : (
                    notifications.map((n: any) => (
                        <div
                            key={n._id}
                            className={`p-3 border-b cursor-pointer ${n.read ? "bg-white" : "bg-blue-50"
                                }`}
                            onClick={() => markRead(n._id)}
                        >
                            <p className="font-medium text-sm">{n.title}</p>
                            <p className="text-xs text-gray-600">
                                {n.message}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
