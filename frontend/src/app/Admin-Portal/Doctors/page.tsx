"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
    createDoctor,
    EditDoctor,
    exportUsers,
    getDoctors,
    UserDelete,
} from "@/lib/authApi";
import UniversalDataTable from "@/components/shared/UniversalDataTable";
import { Doctor, Section } from "@/types/user";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { useAppToast } from "@/app/hooks/useAppToast";
import AddEditDrawer from "@/components/shared/AddEditEntityDrawer";
import { useShareData } from "@/context/ShareDataContext";

/* ================== HELPERS ================== */

const getErrorMessage = (error: any) =>
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong";

/* ================== CONSTANTS ================== */

const emptyForm = {
    name: "",
    surname: "",
    gender: "Male",
    date_of_birth: "",
    phone_no: "",
    address: "",
    location: "",
    email: "",
    username: "",
    password: "",
    specialization: "",
    availability: "Available",
};

/* ================== COMPONENT ================== */

export default function DoctorsPage() {
    const [data, setData] = useState<Doctor[]>([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState<Doctor | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const { locations } = useShareData();
    const { showToast, ToastView } = useAppToast();

    /* ========== EDIT FORM DATA ========== */

    const editDoctorForm = edit
        ? {
            name: edit.user?.name || "",
            surname: edit.user?.surname || "",
            gender: edit.user?.gender || "Male",
            date_of_birth: edit.user?.date_of_birth
                ? edit.user.date_of_birth.slice(0, 10)
                : "",
            phone_no: edit.user?.phone_no || "",
            email: edit.user?.email || "",
            address: edit.user?.address || "",
            location: edit.user?.location || "",
            username: edit.user?.username || "",
            password: "",
            specialization: edit.specialization || "",
            availability: edit.availability || "Available",
        }
        : emptyForm;

    /* ========== SECTIONS ========== */

    const doctorSections: Section[] = [
        {
            title: "Personal Information",
            fields: [
                { type: "text", name: "name", label: "First Name", required: true },
                { type: "text", name: "surname", label: "Surname", required: true },
                {
                    type: "select",
                    name: "gender",
                    label: "Gender",
                    options: ["Male", "Female", "Other"],
                    required: true,
                },
                {
                    type: "date",
                    name: "date_of_birth",
                    label: "Date of Birth",
                    required: true,
                },
                {
                    type: "text",
                    name: "phone_no",
                    label: "Phone Number",
                    required: true,
                    colSpan: true,
                },
                {
                    type: "email",
                    name: "email",
                    label: "Email Address",
                    colSpan: true,
                    required: true,
                },
            ],
        },
        {
            title: "Address Details",
            fields: [
                {
                    type: "text",
                    name: "address",
                    label: "Full Address",
                    colSpan: true,
                },
                {
                    type: "select",
                    name: "location",
                    label: "Location",
                    options: locations.map((loc) => loc.name),
                    colSpan: true,
                    required: true,
                },
            ],
        },
        {
            title: "Professional Details",
            fields: [
                {
                    type: "select",
                    name: "specialization",
                    label: "Specialization",
                    options: ["Ophthalmology", "Dermatology"],
                    required: true,
                },
            ],
        },
        {
            title: "Account Credentials",
            fields: [
                {
                    type: "text",
                    name: "username",
                    label: "Username",
                    required: true,
                },

                ...(edit
                    ? []
                    : [
                        {
                            type: "password" as const,
                            name: "password",
                            label: "Password",
                            required: true,
                        },
                    ]),

                {
                    type: "select",
                    name: "role",
                    label: "Role",
                    options: ["doctor"],
                    required: true,
                    defaultOption: { label: "Doctor", value: "doctor" },
                },
            ],
        },
    ];


    /* ========== LOAD DATA ========== */

    const load = async () => {
        try {
            const res = await getDoctors("doctor", search);
            setData(res.data);
        } catch (error: any) {
            showToast("error", getErrorMessage(error));
        }
    };

    useEffect(() => {
        load();
    }, [search]);

    /* ========== DELETE ========== */

    const confirmDelete = async () => {
        if (!edit) return;
        try {
            await UserDelete(edit.user._id);
            showToast("deleted", "Doctor deleted successfully");
            setDeleteOpen(false);
            setEdit(null);
            load();
        } catch (error: any) {
            showToast("error", getErrorMessage(error));
        }
    };

    /* ========== SUBMIT ========== */

    const handleSubmit = async (form: any) => {
        try {
            if (edit) {
                const payload = { ...form };
                if (!payload.password) delete payload.password;
                await EditDoctor(edit._id, payload);
                showToast("edited", "Doctor updated successfully");
            } else {
                await createDoctor({ ...form, role: "doctor" });
                showToast("added", "Doctor created successfully");
            }
            setOpen(false);
            setEdit(null);
            load();
        } catch (error: any) {
            showToast("error", getErrorMessage(error));
        }
    };

    return (
        <>
            <ToastView />

            <AdminHeader
                title="Doctors"
                search={search}
                setSearch={setSearch}
                onAdd={() => setOpen(true)}
                onExport={async () => {
                    const res = await exportUsers("doctor");
                    const url = window.URL.createObjectURL(res.data);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "doctors.csv";
                    a.click();
                }}
            />

            {/* ===== TABLE ===== */}
            <UniversalDataTable
                data={data}
                columns={[
                    {
                        key: "name",
                        label: "Name",
                        render: (doc: Doctor) =>
                            `${doc.user?.name || ""} ${doc.user?.surname || ""}`,
                    },
                    {
                        key: "phone",
                        label: "Phone",
                        render: (doc: Doctor) => doc.user?.phone_no || "",
                    },
                    {
                        key: "specialization",
                        label: "Specialization",
                        render: (doc: Doctor) => doc.specialization || "",
                    },
                    {
                        key: "location",
                        label: "Location",
                        render: (doc: Doctor) => doc.user?.location || "",
                    },
                    {
                        key: "enabled",
                        label: "Status",
                        render: (doc: Doctor) => (
                            <span
                                className={`px-2 py-1 rounded-full text-xs ${doc.user?.enabled
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-600"
                                    }`}
                            >
                                {doc.user?.enabled ? "Active" : "Disabled"}
                            </span>
                        ),
                    },
                ]}
                onEdit={(doc: Doctor) => {
                    setEdit(doc);
                    setOpen(true);
                }}
                onDelete={(doc: Doctor) => {
                    setEdit(doc);
                    setDeleteOpen(true);
                }}
            />

            {/* ===== DELETE MODAL ===== */}
            <ConfirmDeleteModal
                open={deleteOpen}
                title="Delete Doctor"
                message={`Are you sure you want to delete ${edit?.user?.name || "this doctor"
                    }? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteOpen(false)}
            />

            {/* ===== ADD / EDIT DRAWER ===== */}
            <AddEditDrawer<any>
                open={open}
                title={edit ? "Edit Doctor" : "Add Doctor"}
                submitText={edit ? "Update" : "Create"}
                initialForm={edit ? editDoctorForm : emptyForm}
                sections={doctorSections}
                onClose={() => {
                    setOpen(false);
                    setEdit(null);
                }}
                onSubmit={handleSubmit}
            />
        </>
    );
}
