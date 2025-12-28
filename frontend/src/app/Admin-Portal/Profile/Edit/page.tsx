"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getAdminByID, updateUser } from "@/lib/authApi";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
    const { user } = useAuth();
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        surname: "",
        phone_no: "",
        gender: "",
        date_of_birth: "",
        address: "",
        location: ""
    });

    useEffect(() => {
        if (!user?.id) return;

        const loadProfile = async () => {
            const res = await getAdminByID(user.id);
            const data = res.data;

            setForm({
                name: data.name || "",
                surname: data.surname || "",
                phone_no: data.phone_no || "",
                gender: data.gender || "",
                date_of_birth: data.date_of_birth
                    ? data.date_of_birth.split("T")[0]
                    : "",
                address: data.address || "",
                location: data.location || ""
            });
        };

        loadProfile();
    }, [user]);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        await updateUser(user!.id, form);
        router.push("/Admin-Portal/Profile");
    };

    return (
        <div className="max-w-3xl mx-auto text-gray-800">
            <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>

            <div className="bg-white rounded-xl shadow p-6 space-y-6">
                <Input label="First Name" name="name" value={form.name} onChange={handleChange} />
                <Input label="Surname" name="surname" value={form.surname} onChange={handleChange} />
                <Input label="Phone Number" name="phone_no" value={form.phone_no} onChange={handleChange} />
                <Input label="Gender" name="gender" value={form.gender} onChange={handleChange} />
                <Input label="Date of Birth" type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} />
                <Input label="Location" name="location" value={form.location} onChange={handleChange} />
                <Input label="Address" name="address" value={form.address} onChange={handleChange} />

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 rounded-lg bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

function Input({
    label,
    ...props
}: {
    label: string;
    [key: string]: any;
}) {
    return (
        <div>
            <label className="block text-sm text-gray-600 mb-1">{label}</label>
            <input
                {...props}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
        </div>
    );
}
