"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
    createPatient,
    deletePatient,
    EditPatient,
    getLocation,
    getPatient,
} from "@/lib/authApi";
import UniversalDataTable from "@/components/shared/UniversalDataTable";
import { useAppToast } from "@/app/hooks/useAppToast";
import { LocationNames, Patient, Section } from "@/types/user";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
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
    dateOfBirth: "",
    age: "",
    gender: "Male",
    contactNumber: "",
    email: "",
    location: "",
    bloodGroup: "",
    knownAllergies: "",
    notes: "",
};

/* ================== COMPONENT ================== */

export default function PatientsPage() {
    const [data, setData] = useState<Patient[]>([]);
    const [locations, setLocations] = useState<LocationNames[]>([]);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState<Patient | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const { showToast, ToastView } = useAppToast();

    /* ========== EDIT FORM DATA ========== */

    const editPatientForm = edit
        ? {
            name: edit.name || "",
            dateOfBirth: edit.dateOfBirth
                ? edit.dateOfBirth.slice(0, 10)
                : "",
            age: String(edit.age || ""),
            gender: edit.gender || "Male",
            contactNumber: edit.contactNumber || "",
            email: edit.email || "",
            location: edit.location || "",
            bloodGroup: edit.bloodGroup || "",
            knownAllergies: edit.knownAllergies?.join(", ") || "",
            notes: edit.notes || "",
        }
        : emptyForm;

    /* ========== SECTIONS ========== */

    const patientSections: Section[] = [
        {
            title: "Personal Information",
            fields: [
                { type: "text", name: "name", label: "Full Name", required: true },
                {
                    type: "date",
                    name: "dateOfBirth",
                    label: "Date of Birth",
                    required: true,
                },
                { type: "text", name: "age", label: "Age", required: true },
                {
                    type: "select",
                    name: "gender",
                    label: "Gender",
                    options: ["Male", "Female"],
                    required: true,
                },
                {
                    type: "text",
                    name: "contactNumber",
                    label: "Contact Number",
                    required: true,
                },
                { type: "email", name: "email", label: "Email" },
            ],
        },
        {
            title: "Address Details",
            fields: [
                {
                    type: "select",
                    name: "location",
                    label: "Location",
                    options: locations.map((loc) => loc.name),
                    required: true,
                },
            ],
        },
        {
            title: "Medical Information",
            fields: [
                {
                    type: "text",
                    name: "notes",
                    label: "Notes",
                    colSpan: true,
                },
            ],
        },
    ];

    /* ========== LOAD DATA ========== */

    const loadPatients = async () => {
        try {
            const res = await getPatient("patients", search);
            setData(res.data);
        } catch (error: any) {
            showToast("error", getErrorMessage(error));
        }
    };

    const loadLocations = async () => {
        try {
            const res = await getLocation();
            setLocations(res.data);
        } catch (error: any) {
            showToast("error", getErrorMessage(error));
        }
    };

    useEffect(() => {
        loadLocations();
        loadPatients();
    }, [search]);

    /* ========== DELETE ========== */

    const confirmDelete = async () => {
        if (!edit) return;
        try {
            await deletePatient(edit._id);
            showToast("deleted", "Patient deleted successfully");
            setDeleteOpen(false);
            setEdit(null);
            loadPatients();
        } catch (error: any) {
            showToast("error", getErrorMessage(error));
        }
    };

    /* ========== SUBMIT ========== */

    const handleSubmit = async (form: any) => {
        try {
            const payload = {
                ...form,
                age: Number(form.age),
                knownAllergies: form.knownAllergies
                    ? form.knownAllergies
                        .split(",")
                        .map((a: string) => a.trim())
                        .filter(Boolean)
                    : [],
                address: { Location: form.location },
            };

            if (edit) {
                await EditPatient(edit._id, payload);
                showToast("edited", "Patient updated successfully");
            } else {
                await createPatient(payload);
                showToast("added", "Patient created successfully");
            }

            setOpen(false);
            setEdit(null);
            loadPatients();
        } catch (error: any) {
            showToast("error", getErrorMessage(error));
        }
    };

    return (
        <>
            <ToastView />

            <AdminHeader
                title="Patients"
                search={search}
                setSearch={setSearch}
                onAdd={() => setOpen(true)}
                onExport={() => { }}
            />

            {/* ===== TABLE ===== */}
            <UniversalDataTable
                data={data}
                columns={[
                    { key: "name", label: "Name" },
                    { key: "contactNumber", label: "Contact" },
                    { key: "gender", label: "Gender" },
                    { key: "location", label: "Location" },
                ]}
                onEdit={(patient: Patient) => {
                    setEdit(patient);
                    setOpen(true);
                }}
                onDelete={(patient: Patient) => {
                    setEdit(patient);
                    setDeleteOpen(true);
                }}
            />

            {/* ===== DELETE MODAL ===== */}
            <ConfirmDeleteModal
                open={deleteOpen}
                title="Delete Patient"
                message={`Are you sure you want to delete ${edit?.name || "this patient"
                    }? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteOpen(false)}
            />

            {/* ===== ADD / EDIT DRAWER ===== */}
            <AddEditDrawer<any>
                open={open}
                title={edit ? "Edit Patient" : "Add Patient"}
                submitText={edit ? "Update" : "Create"}
                initialForm={edit ? editPatientForm : emptyForm}
                sections={patientSections}
                onClose={() => {
                    setOpen(false);
                    setEdit(null);
                }}
                onSubmit={handleSubmit}
            />
        </>
    );
}
