"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import StatusTabs from "@/components/receptionist/StatusTabs";
import DateRangeFilter from "@/components/receptionist/DateRangeFilter";
import AppointmentList from "@/components/receptionist/AppointmentList";
import { STATUS_FLOW } from "@/components/data";
import { useAppToast } from "@/app/hooks/useAppToast";
import { createAppointment, getAppointments, getDoctors, getPatient, updateAppointment, updateAppointmentStatus } from "@/lib/authApi";
import { Appointment, Doctor, Patient, Section } from "@/types/user";
import AddEditModal from "@/components/shared/AddEditModal";
import { ShareDataProvider, useShareData } from "@/context/ShareDataContext";

function getWeekRange() {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return {
        from: start.toISOString().slice(0, 10),
        to: end.toISOString().slice(0, 10),
    };
}

const emptyAppointmentForm: Appointment = {
    serialNo: "",
    patient: "",
    doctor: "",
    type: "Appointment",
    date: "",
    time: "",
    status: "",
    _id: "",
    createdAt: "",
    enabled: true,
    header: "",
    lines: [""],
    paymentMethod: ""
};

export default function ReceptionistAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [activeStatuses, setActiveStatuses] = useState<string[]>([]);
    const [selected, setSelected] = useState<Appointment | null>(null);
    const [range, setRange] = useState(getWeekRange());
    const { showToast, ToastView } = useAppToast();
    const [AddOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const { statuses, doctors, patients } = useShareData();


    const editForm: Appointment = selected
        ? {
            serialNo: selected.serialNo,
            patient: selected.patient?._id || "",
            doctor: selected.doctor?._id || "",
            type: selected.type,
            date: selected.date.slice(0, 10),
            time: selected.time,
            status: selected.status?._id || "",
            _id: selected._id,
            createdAt: selected.createdAt,
            enabled: selected.enabled,
            header: selected.header,
            lines: selected.lines,
            paymentMethod: selected.paymentMethod

        }
        : emptyAppointmentForm;

    const appointmentSections: Section[] = [
        {
            title: "Appointment Info",
            fields: [
                { type: "text", name: "serialNo", label: "Serial No", disabled: true },

                {
                    type: "select",
                    name: "patient",
                    label: "Patient",
                    options: patients,
                    displayKeys: ['name', 'gender', 'notes'],
                    displayValueKey: "name",
                    valueKey: '_id',
                },
                {
                    type: "select",
                    name: "doctor",
                    label: "Doctor",
                    options: doctors,
                    displayKeys: ['name', 'specialization'],
                    displayValueKey: "name",
                    valueKey: '_id',
                },
                {
                    type: "select",
                    name: "type",
                    label: "Type",
                    options: ["Appointment", "Walk-in"],
                },
                {
                    type: "select",
                    name: "status",
                    label: "Status",
                    options: statuses,
                    displayKeys: ['name'],
                    displayValueKey: "name",
                    valueKey: '_id',
                    disabled: AddOpen ? true : false,
                    defaultOption: AddOpen ? {
                        label: "Waiting",
                        value: statuses.find(s => s.name === "Waiting")?._id
                    } : undefined
                },
                { type: "date", name: "date", label: "Date" },
                { type: "time", name: "time", label: "Time" },
            ],
        },
    ];

    // 🔄 Load from API
    const loadAppointments = async () => {
        try {
            const res = await getAppointments();
            setAppointments(res.data || []);
        } catch (err: any) {
            showToast("error", err?.message || "Failed to load appointments");
        }
    };

    useEffect(() => {
        loadAppointments();
    }, []);

    const toggleStatus = (key: string) => {
        setActiveStatuses((prev) =>
            prev.includes(key)
                ? prev.filter((s) => s !== key)
                : [...prev, key]
        );
    };

    // ✅ Filter using new API shape
    const filtered = useMemo(() => {
        return appointments.filter((a) => {
            const statusName = a.status?.name || "";
            const dateStr = a.date?.slice(0, 10);

            const inStatus =
                activeStatuses.length === 0 ||
                activeStatuses.includes(statusName);

            const inDate =
                (!range.from || dateStr >= range.from) &&
                (!range.to || dateStr <= range.to);

            return inStatus && inDate;
        });
    }, [appointments, activeStatuses, range]);

    // 🔁 Update status only
    const updateAppointmentstatusByID = async (id: string, data: any) => {
        try {
            updateAppointmentStatus(id, data.status);
            showToast("edited", "Status updated");

            let statusObj = statuses.find(s => s._id === data.status);
            setAppointments((prev) =>
                prev.map((a) =>
                    a._id === id
                        ? { ...a, status: statusObj }
                        : a
                )
            );
        } catch (err: any) {
            showToast("error", getErrorMessage(err));
        }
    };

    const handleEditAppointment = (a: Appointment) => {
        setSelected(a)
        setEditOpen(true)
    }
    const handleAddService = (a: Appointment) => {

    }

    const handleViewBill = (a: Appointment) => {
        console.log("hello", a);

    }

    const deleteAppointment = async (a: Appointment) => {
        try {
            updateAppointmentStatus(a._id, statuses.find(s => s.name === "cancelled")?._id || "");
            showToast("deleted", "Appointment deleted");
            loadAppointments();
        } catch (err: any) {
            showToast("error", getErrorMessage(err));
        }
    };

    return (
        <div className="space-y-6 p-4 md:p-10 bg-gray-50 min-h-screen">
            <ToastView />

            {/* ===== Header ===== */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Appointments
                    </h1>
                    <p className="text-sm text-gray-600">
                        Manage today’s patient queue
                    </p>
                </div>

                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow"
                    onClick={(e) => { setAddOpen(true) }}>
                    <Plus size={18} />
                    Add Appointment
                </button>
            </div>

            {/* ===== Filters ===== */}
            <div className="bg-white rounded-xl shadow p-4 space-y-4">
                <StatusTabs
                    statuses={STATUS_FLOW}
                    active={activeStatuses}
                    onToggle={toggleStatus}
                />

                <DateRangeFilter
                    from={range.from}
                    to={range.to}
                    onChange={setRange}
                />
            </div>

            {/* ===== List ===== */}
            <AppointmentList
                data={filtered}
                statuses={statuses}
                onUpdate={updateAppointmentstatusByID}
                handleAddService={handleAddService}
                handleEdit={handleEditAppointment}
                Currentrole="receptionist"
                handleViewBill={handleViewBill}
                HandleDelete={deleteAppointment}
            />
            <AddEditModal
                open={AddOpen}
                title="Add Appointment"
                description="Create a new appointment"
                submitText="Save Appointment"
                initialForm={emptyAppointmentForm}
                sections={appointmentSections}
                onClose={() => setAddOpen(false)}
                onSubmit={async (form: Appointment) => {
                    await createAppointment(form);
                    showToast("added", "Appointment created");
                    setAddOpen(false);
                    loadAppointments();
                }}
            />

            <AddEditModal
                open={editOpen}
                title="Edit Appointment"
                description="Update appointment details"
                submitText="Update Appointment"
                initialForm={editForm}
                sections={appointmentSections}
                onClose={() => {
                    setEditOpen(false);
                    setSelected(null);
                }}
                onSubmit={async (form: Appointment) => {
                    if (!selected) return;
                    await updateAppointment(selected._id, form);
                    showToast("edited", "Appointment updated");
                    setEditOpen(false);
                    loadAppointments();
                }}
            />
        </div>
    );
}
