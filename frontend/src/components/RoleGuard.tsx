"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoleGuard({
    role,
    children,
}: {
    role: "admin" | "doctor" | "receptionist";
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || user?.role !== role)) {
            router.push("/login");
        }
    }, [user, loading]);

    if (loading) return null;
    if (!user) return null;

    return <>{children}</>;
}
