"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
    createReceptionists,
    EditReceptionists,
    exportUsers,
    getReceptionists,
    UserDelete,
} from "@/lib/authApi";
import UniversalDataTable from "@/components/shared/UniversalDataTable";
import { User, Section } from "@/types/user";
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
    username: "",
    password: "",
};

/* ================== COMPONENT ================== */

export default function ReceptionistsPage() {
    const [data, setData] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState<User | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const { locations } = useShareData();

    const { showToast, ToastView } = useAppToast();

    /* ========== EDIT FORM DATA ========== */

    const editReceptionistForm = edit
        ? {
            name: edit.name || "",
            surname: edit.surname || "",
            gender: edit.gender || "Male",
            date_of_birth: edit.date_of_birth
                ? edit.date_of_birth.slice(0, 10)
                : "",
            email: edit.email || "",
            phone_no: edit.phone_no || "",
            address: edit.address || "",
            location: edit.location || "",
            username: edit.username || "",
            password: "",
        }
        : emptyForm;

    /* ========== SECTIONS ========== */

    const receptionistSections: Section[] = [
        {
            title: "Personal Information",
            fields: [
                { type: "text", name: "name", label: "First Name", required: true },
                { type: "text", name: "surname", label: "Surname", required: true },
                {
                    type: "select",
                    name: "gender",
                    label: "Gender",
                    options: ["Male", "Female"],
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
                    colSpan: true,
                    required: true,
                },
                {
                    type: "email",
                    name: "email",
                    label: "Email Address",
                    colSpan: true,
                    required: false,
                }
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
            ],
        },
    ];

    /* ========== LOAD DATA ========== */

    const load = async () => {
        try {
            const res = await getReceptionists("receptionist", search);
            const filtered = res.data.filter((u: User) => u.enabled === true);
            setData(filtered);
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
            await UserDelete(edit._id);
            showToast("deleted", "Receptionist deleted successfully");
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
                await EditReceptionists(edit._id, payload);
                showToast("edited", "Receptionist updated successfully");
            } else {
                await createReceptionists({ ...form, role: "receptionist" });
                showToast("added", "Receptionist created successfully");
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
                title="Receptionists"
                search={search}
                setSearch={setSearch}
                onAdd={() => setOpen(true)}
                onExport={async () => {
                    const res = await exportUsers("receptionist");
                    const url = window.URL.createObjectURL(res.data);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "receptionists.csv";
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
                        render: (r: User) => `${r.name || ""} ${r.surname || ""}`,
                    },
                    { key: "username", label: "Username" },
                    {
                        key: "phone_no",
                        label: "Phone",
                        render: (r: User) => r.phone_no || "",
                    },
                    {
                        key: "location",
                        label: "Location",
                        render: (r: User) => r.location || "",
                    },
                    {
                        key: "enabled",
                        label: "Status",
                        render: (r: User) => (
                            <span
                                className={`px-2 py-1 rounded-full text-xs ${r.enabled
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-600"
                                    }`}
                            >
                                {r.enabled ? "Active" : "Disabled"}
                            </span>
                        ),
                    },
                ]}
                onEdit={(rec: User) => {
                    setEdit(rec);
                    setOpen(true);
                }}
                onDelete={(rec: User) => {
                    setEdit(rec);
                    setDeleteOpen(true);
                }}
            />

            {/* ===== DELETE MODAL ===== */}
            <ConfirmDeleteModal
                open={deleteOpen}
                title="Delete Receptionist"
                message={`Are you sure you want to delete ${edit?.name || "this receptionist"
                    }? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteOpen(false)}
            />

            {/* ===== ADD / EDIT DRAWER ===== */}
            <AddEditDrawer<any>
                open={open}
                title={edit ? "Edit Receptionist" : "Add Receptionist"}
                submitText={edit ? "Update" : "Create"}
                initialForm={edit ? editReceptionistForm : emptyForm}
                sections={receptionistSections}
                onClose={() => {
                    setOpen(false);
                    setEdit(null);
                }}
                onSubmit={handleSubmit}
            />
        </>
    );
}
