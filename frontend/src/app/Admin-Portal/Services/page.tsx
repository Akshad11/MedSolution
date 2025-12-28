"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Section, Service } from "@/types/user";
import {
    createService,
    deleteService,
    getServices,
    updateService,
} from "@/lib/authApi";
import UniversalDataTable from "@/components/shared/UniversalDataTable";
import { useAppToast } from "@/app/hooks/useAppToast";
import { useShareData } from "@/context/ShareDataContext";
import AddEditDrawer from "@/components/shared/AddEditEntityDrawer";

/* ================== HELPERS ================== */

const getErrorMessage = (error: any) =>
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong";

/* ================== CONSTANTS ================== */

const emptyForm = {
    name: "",
    amount: "",
    enabled: true,
    doctor: "",
};

/* ================== COMPONENT ================== */

export default function ServicesPage() {
    const [data, setData] = useState<Service[]>([]);
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState<Service | null>(null);

    const { doctors } = useShareData();
    const { showToast, ToastView } = useAppToast();

    /* ================= LOAD ================= */

    const load = async () => {
        try {
            const res = await getServices();
            setData(res.data || []);
        } catch (error: any) {
            showToast("error", getErrorMessage(error));
        }
    };

    useEffect(() => {
        load();
    }, []);

    /* ================= TABLE ================= */

    const columns = [
        { key: "name", label: "Service Name" },
        {
            key: "amount",
            label: "Amount",
            render: (row: Service) => `₹${row.amount}`,
        },
        {
            key: "doctor",
            label: "Doctor",
            render: (row: Service) => row.doctor?.name || "N/A",
        },
        {
            key: "enabled",
            label: "Status",
            render: (row: Service) => (
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${row.enabled
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                        }`}
                >
                    {row.enabled ? "Active" : "Disabled"}
                </span>
            ),
        },
    ];

    /* ================= FORM SECTIONS ================= */

    const serviceSections: Section[] = [
        {
            title: "Service Info",
            fields: [
                {
                    type: "text",
                    name: "name",
                    label: "Service Name",
                    required: true,
                },
                {
                    type: "text",
                    name: "amount",
                    label: "Amount",
                    required: true,
                },
                {
                    type: "select",
                    name: "doctor",
                    label: "Doctor",
                    options: doctors,
                    displayKeys: ["name", "specialization"],
                    displayValueKey: "name",
                    valueKey: "_id",
                    required: true,
                },
            ],
        },
    ];

    /* ================= HANDLERS ================= */

    const handleAdd = () => {
        setEdit(null);
        setOpen(true);
    };

    const handleEdit = (row: Service) => {
        setEdit(row);
        setOpen(true);
    };

    const handleSubmit = async (form: any) => {
        try {
            const payload = {
                ...form,
                amount: Number(form.amount),
            };

            if (edit) {
                await updateService(edit._id, payload);
                showToast("edited", "Service updated successfully");
            } else {
                await createService(payload);
                showToast("added", "Service created successfully");
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

            <AdminHeader title="Services" onAdd={handleAdd} />

            <UniversalDataTable<Service>
                data={data}
                columns={columns}
                onEdit={handleEdit}
                onDelete={async (row) => {
                    try {
                        await deleteService(row._id);
                        showToast("deleted", "Service deleted successfully");
                        load();
                    } catch (error: any) {
                        showToast("error", getErrorMessage(error));
                    }
                }}
            />

            {/* ================= ADD / EDIT DRAWER ================= */}
            <AddEditDrawer<any>
                open={open}
                title={edit ? "Edit Service" : "Add Service"}
                submitText={edit ? "Update" : "Create"}
                initialForm={
                    edit
                        ? {
                            name: edit.name || "",
                            amount: String(edit.amount || ""),
                            enabled: edit.enabled ?? true,
                            doctor: edit.doctor || "",
                        }
                        : emptyForm
                }
                sections={serviceSections}
                onClose={() => {
                    setOpen(false);
                    setEdit(null);
                }}
                onSubmit={handleSubmit}
            />
        </>
    );
}
