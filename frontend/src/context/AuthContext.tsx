"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginApi } from "@/lib/authApi";
import { isTokenExpired } from "@/lib/jwt";
import { User } from "@/types/user";
import socket from "@/lib/socket";


type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser && !isTokenExpired(token)) {
            setUser(JSON.parse(storedUser));
        } else {
            localStorage.clear();
        }

        setLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        const data = await loginApi(username, password);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        document.cookie = `token=${data.token}; path=/`;

        setUser(data.user);
        socket.emit("join", {
            userId: data.user.id,
            role: data.user.role,
        });
        // ✅ redirect based on role
        if (data.user.role === "admin") router.push("/Admin-Portal");
        if (data.user.role === "doctor") router.push("/doctors");
        if (data.user.role === "receptionist") router.push("/Receptionist");
    };

    const logout = () => {
        localStorage.clear();
        document.cookie = "token=; Max-Age=0; path=/";
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
