"use client";

import { useEffect, useMemo, useState } from "react";
import AppointmentList from "@/components/receptionist/AppointmentList";
import StatusTabs from "@/components/receptionist/StatusTabs";
import DateRangeFilter from "@/components/receptionist/DateRangeFilter";
import { STATUS_FLOW } from "@/components/data";
import { useAppToast } from "@/app/hooks/useAppToast";
import {
    appointmentslinesByService,
    getAppointments,
    updateAppointmentStatus,
    createAppointment,
    updateAppointment,
} from "@/lib/authApi";
import { Appointment, Section } from "@/types/user";
import { useShareData } from "@/context/ShareDataContext";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/ui/Loading";
import AddServiceModal from "@/components/shared/AddServiceModal";
import AddEditModal from "@/components/shared/AddEditModal";
import { Plus } from "lucide-react";
import NotificationTab from "@/components/shared/NotificationTab";

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

const emptyDoctorAppointmentForm: Appointment = {
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
    lines: [],
    paymentMethod: "",
};

export default function DoctorAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [activeStatuses, setActiveStatuses] = useState<string[]>([]);
    const [range, setRange] = useState(getWeekRange());

    const [isOpen, setOpen] = useState(false); // add service
    const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

    const [AddOpen, setAddOpen] = useState(false); // add appointment
    const [editOpen, setEditOpen] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<Appointment | null>(null);

    const { showToast, ToastView } = useAppToast();
    const { statuses, services, loading, patients } = useShareData();
    const { user } = useAuth();

    /* ================= LOAD ================= */

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

    /* ================= FILTER ================= */

    const toggleStatus = (key: string) => {
        setActiveStatuses((prev) =>
            prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
        );
    };

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

            const isMine = a.doctor?._id === user?.roleID;

            return inStatus && inDate && isMine;
        });
    }, [appointments, activeStatuses, range, user]);

    /* ================= UPDATE STATUS ================= */

    const updateStatus = async (id: string, statusId: any) => {
        try {
            await updateAppointmentStatus(id, statusId.status);
            const statusObj = statuses.find((s) => s._id === statusId.status);
            setAppointments((prev) =>
                prev.map((a) =>
                    a._id === id ? { ...a, status: statusObj } : a
                )
            );
            showToast("edited", "Status updated");
        } catch (err: any) {
            showToast("error", err?.message || "Failed to update status");
        }
    };

    /* ================= ADD SERVICE ================= */

    const handleAddService = (appt: Appointment) => {
        setSelectedAppt(appt);
        setOpen(true);
    };

    const handleFormSubmit = async (form: any) => {
        if (!selectedAppt) return;

        try {
            await appointmentslinesByService({
                service: form.service,
                amount: Number(form.amount),
                note: form.note,
                doctor: user?.roleID,
                appointmentId: selectedAppt._id,
            });

            showToast("added", "Service added successfully");
            setOpen(false);
            setSelectedAppt(null);
            loadAppointments();
        } catch (err: any) {
            showToast("error", err?.message || "Failed to add service");
        }
    };

    /* ================= ADD / EDIT ================= */

    const appointmentSections: Section[] = [
        {
            title: "Appointment Info",
            fields: [
                {
                    type: "select",
                    name: "patient",
                    label: "Patient",
                    options: patients || [],
                    displayKeys: ["name", "gender"],
                    displayValueKey: "name",
                    valueKey: "_id",
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
                    displayKeys: ["name"],
                    displayValueKey: "name",
                    valueKey: "_id",
                },
                { type: "date", name: "date", label: "Date" },
                { type: "time", name: "time", label: "Time" },
            ],
        },
    ];

    const editForm: Appointment = selectedEdit
        ? {
            serialNo: selectedEdit.serialNo,
            patient: selectedEdit.patient?._id || "",
            doctor: selectedEdit.doctor?._id || "",
            type: selectedEdit.type,
            date: selectedEdit.date.slice(0, 10),
            time: selectedEdit.time,
            status: selectedEdit.status?._id || "",
            _id: selectedEdit._id,
            createdAt: selectedEdit.createdAt,
            enabled: selectedEdit.enabled,
            header: selectedEdit.header,
            lines: selectedEdit.lines,
            paymentMethod: selectedEdit.paymentMethod,
        }
        : emptyDoctorAppointmentForm;

    const handleEditAppointment = (a: Appointment) => {
        setSelectedEdit(a);
        setEditOpen(true);
    };

    if (loading) return <Loading />;

    return (
        <div className="space-y-6 p-4 md:p-10 bg-gray-50 min-h-screen">
            <ToastView />

            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                    My Appointments
                </h1>
                <p className="text-sm text-gray-600">
                    Manage your patient queue
                </p>
                <button
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow"
                    onClick={() => setAddOpen(true)}
                >
                    <Plus size={18} />
                    Add Appointment
                </button>
                <NotificationTab />
            </div>

            {/* Filters */}
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

            {/* List */}
            <AppointmentList
                handleViewBill={() => { }}
                data={filtered}
                statuses={statuses}
                Currentrole="doctor"
                onUpdate={(id, statusId) => updateStatus(id, statusId)}
                handleAddService={handleAddService}
                handleEdit={handleEditAppointment}
            />

            {/* Add Service Modal */}
            <AddServiceModal
                open={isOpen}
                services={services.filter(
                    (s) => s.doctor?._id === user?.roleID
                )}
                onClose={() => {
                    setOpen(false);
                    setSelectedAppt(null);
                }}
                onSubmit={handleFormSubmit}
            />

            {/* Add Appointment */}
            <AddEditModal
                open={AddOpen}
                title="Add Appointment"
                description="Create a new appointment"
                submitText="Save Appointment"
                initialForm={emptyDoctorAppointmentForm}
                sections={appointmentSections}
                onClose={() => setAddOpen(false)}
                onSubmit={async (form: Appointment) => {
                    try {
                        await createAppointment({
                            ...form,
                            doctor: user?.roleID,
                        });
                        showToast("added", "Appointment created");
                        setAddOpen(false);
                        loadAppointments();
                    } catch (err: any) {
                        showToast("error", err?.message || "Failed to create appointment");
                    }
                }}
            />

            {/* Edit Appointment */}
            <AddEditModal
                open={editOpen}
                title="Edit Appointment"
                description="Update appointment details"
                submitText="Update Appointment"
                initialForm={editForm}
                sections={appointmentSections}
                onClose={() => {
                    setEditOpen(false);
                    setSelectedEdit(null);
                }}
                onSubmit={async (form: Appointment) => {
                    if (!selectedEdit) return;
                    try {
                        await updateAppointment(selectedEdit._id, {
                            ...form,
                            doctor: user?.roleID, // ensure still self
                        });
                        showToast("edited", "Appointment updated");
                        setEditOpen(false);
                        loadAppointments();
                    } catch (err: any) {
                        showToast("error", err?.message || "Failed to update appointment");
                    }
                }}
            />
        </div>
    );
}
