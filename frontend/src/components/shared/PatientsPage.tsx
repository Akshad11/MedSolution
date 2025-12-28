"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import PatientCard from "../PatientCard";
import { LocationNames, Patient, Section } from "@/types/user";
import {
    getLocation,
    getPatient,
    createPatient,
    deletePatient,
    EditPatient,
} from "@/lib/authApi";
import { useAppToast } from "@/app/hooks/useAppToast";
import AddEditModal from "@/components/shared/AddEditModal";
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";

/* ================== CONSTANTS ================== */

const emptyForm = {
    name: "",
    dateOfBirth: "",
    age: "",
    gender: "Male",
    contactNumber: "",
    email: "",
    bloodGroup: "",
    knownAllergies: "",
    notes: "",
    location: "",
};

export default function PatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [search, setSearch] = useState("");
    const [openAdd, setOpenAdd] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState<Patient | null>(null);
    const [locations, setLocations] = useState<LocationNames[]>([]);

    const { showToast, ToastView } = useAppToast();

    /* ========== EDIT FORM DATA ========== */

    const editForm = selected
        ? {
            name: selected.name || "",
            dateOfBirth: selected.dateOfBirth
                ? selected.dateOfBirth.slice(0, 10)
                : "",
            age: String(selected.age ?? ""),
            gender: selected.gender || "Male",
            contactNumber: selected.contactNumber || "",
            email: selected.email || "",
            bloodGroup: selected.bloodGroup || "",
            knownAllergies: selected.knownAllergies?.join(", ") || "",
            notes: selected.notes || "",
            location: selected.location || "",
        }
        : emptyForm;

    /* ========== FORM SECTIONS ========== */

    const patientSections: Section[] = [
        {
            title: "Personal Info",
            fields: [
                { type: "text", name: "name", label: "Full Name", required: true },
                {
                    type: "date",
                    name: "dateOfBirth",
                    label: "Date of Birth",
                    required: true,
                },
                { type: "number", name: "age", label: "Age", required: true },
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
            title: "Location",
            fields: [
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
            title: "Notes",
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

    /* ========== LOADERS ========== */

    const loadPatients = async () => {
        try {
            const res = await getPatient("patients", search);
            setPatients(res.data || []);
        } catch (error: any) {
            showToast("error", getErrorMessage(error));
        }
    };

    const loadLocations = async () => {
        try {
            const res = await getLocation();
            setLocations(res.data || []);
        } catch (error: any) {
            showToast("error", getErrorMessage(error));
        }
    };

    useEffect(() => {
        loadLocations();
        loadPatients();
    }, [search]);

    const filtered = patients;

    /* ========== DELETE ========== */

    const confirmDelete = async () => {
        if (!selected) return;
        try {
            await deletePatient(selected._id);
            showToast("deleted", "Patient deleted successfully");
            setDeleteOpen(false);
            setSelected(null);
            loadPatients();
        } catch (error: any) {
            showToast("error", getErrorMessage(error));
        }
    };

    return (
        <div className="space-y-6 p-4 md:p-10">
            <ToastView />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
                    <p className="text-sm text-gray-600">Manage registered patients</p>
                </div>

                <button
                    onClick={() => {
                        setSelected(null);     // ✅ clear any previous selection
                        setOpenAdd(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    <Plus size={18} />
                    Add Patient
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or phone..."
                    className="w-full pl-10 pr-4 py-2 text-gray-900 placeholder:text-gray-500 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            {/* Patient Cards */}
            <div className="space-y-3">
                {filtered.map((p) => (
                    <PatientCard
                        key={p._id}
                        patient={p}
                        onEdit={(pat: Patient) => {
                            setSelected(pat);
                            setEditOpen(true);
                        }}
                        onDelete={(patient: Patient) => {
                            setSelected(patient);
                            setDeleteOpen(true);
                        }}
                    />
                ))}

                {filtered.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        No patients found.
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            <ConfirmDeleteModal
                open={deleteOpen}
                title="Delete Patient"
                message={`Are you sure you want to delete ${selected?.name || "this patient"
                    }? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteOpen(false)}
            />

            {/* ➕ Add Patient Modal (Option 1: key-based remount) */}
            <AddEditModal
                key={openAdd ? "add-open" : "add-closed"}   // ✅ forces remount & reset
                open={openAdd}
                title="Add Patient"
                description="Enter patient details"
                submitText="Save Patient"
                initialForm={emptyForm}
                sections={patientSections}
                onClose={() => setOpenAdd(false)}
                onSubmit={async (form) => {
                    try {
                        await createPatient({
                            ...form,
                            age: Number(form.age),
                            knownAllergies: form.knownAllergies
                                ? form.knownAllergies
                                    .split(",")
                                    .map((a: string) => a.trim())
                                    .filter(Boolean)
                                : [],
                        });
                        showToast("added", "Patient added successfully");
                        setOpenAdd(false);
                        loadPatients();
                    } catch (error: any) {
                        showToast("error", getErrorMessage(error));
                    }
                }}
            />

            {/* ✏️ Edit Patient Modal */}
            <AddEditModal
                open={editOpen}
                title="Edit Patient"
                description="Update patient details"
                submitText="Update Patient"
                initialForm={editForm}
                sections={patientSections}
                onClose={() => {
                    setEditOpen(false);
                    setSelected(null);
                }}
                onSubmit={async (form) => {
                    if (!selected) return;
                    try {
                        await EditPatient(selected._id, {
                            ...form,
                            age: Number(form.age),
                            knownAllergies: form.knownAllergies
                                ? form.knownAllergies
                                    .split(",")
                                    .map((a: string) => a.trim())
                                    .filter(Boolean)
                                : [],
                        });
                        showToast("edited", "Patient updated successfully");
                        setEditOpen(false);
                        setSelected(null);
                        loadPatients();
                    } catch (error: any) {
                        showToast("error", getErrorMessage(error));
                    }
                }}
            />
        </div>
    );
}
