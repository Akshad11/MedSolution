// context/NotificationContext.tsx
"use client";

import { getNotifications, markNotificationRead } from "@/lib/authApi";
import { createContext, useContext, useEffect, useState } from "react";


const NotificationContext = createContext<any>(null);

export const NotificationProvider = ({ children }: any) => {
    const [notifications, setNotifications] = useState<any[]>([]);

    const load = async () => {
        const res = await getNotifications();
        setNotifications(res.data || []);
    };

    const markRead = async (id: string) => {
        await markNotificationRead(id);
        setNotifications((prev: any[]) =>
            prev.map((n) =>
                n._id === id ? { ...n, read: true } : n
            )
        );
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <NotificationContext.Provider
            value={{ notifications, reload: load, markRead }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () =>
    useContext(NotificationContext);
