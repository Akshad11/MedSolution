"use client";

import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import { getAdminByID } from "@/lib/authApi";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [admin, setAdmin] = useState<User | null>(null);

    useEffect(() => {
        if (!user?.id) return;

        const loadAdmin = async () => {
            const res = await getAdminByID(user.id);
            setAdmin(res.data);
        };

        loadAdmin();
    }, [user]);

    if (!user || !admin) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto text-gray-800">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">My Profile</h1>
                    <p className="text-sm text-gray-600">
                        View your account information
                    </p>
                </div>

                {/* ✅ Edit Button */}
                <button
                    onClick={() => router.push("/Admin-Portal/Profile/Edit")}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                >
                    Edit Profile
                </button>
            </div>

            <div className="bg-white rounded-xl shadow p-6 space-y-8">
                {/* Header */}
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl">
                        {admin.name?.[0] ?? "A"}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">
                            {admin.name} {admin.surname}
                        </h2>
                        <p className="text-sm text-gray-600">
                            {user.role?.name}
                        </p>
                    </div>
                </div>

                {/* Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <ProfileField label="Username" value={admin.username} />
                    <ProfileField label="Phone Number" value={admin.phone_no} />
                    <ProfileField label="Gender" value={admin.gender} />
                    <ProfileField
                        label="Date of Birth"
                        value={
                            admin.date_of_birth
                                ? new Date(admin.date_of_birth).toLocaleDateString()
                                : "-"
                        }
                    />
                    <ProfileField label="Location" value={admin.location} />
                    <ProfileField label="Address" value={admin.address} />
                </div>
            </div>
        </div>
    );
}

function ProfileField({ label, value }: { label: string; value?: string }) {
    return (
        <div>
            <p className="text-gray-500 mb-1">{label}</p>
            <p className="font-medium text-gray-900">{value || "-"}</p>
        </div>
    );
}
