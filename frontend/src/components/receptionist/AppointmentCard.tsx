"use client";

import { useState } from "react";
import {
    ChevronDown,
    Stethoscope,
    Calendar,
    Clock,
    Layers,
    Plus,
    User,
    Edit,
    IndianRupee,
    Receipt,
    Trash2,
} from "lucide-react";
import { Appointment, Status } from "@/types/user";

/* ================= Colors ================= */

const STATUS_COLORS: Record<string, string> = {
    Waiting: "bg-amber-100 border-amber-300",
    Optometrist: "bg-sky-100 border-sky-300",
    Occupied: "bg-orange-100 border-orange-300",
    Drops: "bg-violet-100 border-violet-300",
    "Ready for Payment": "bg-fuchsia-100 border-fuchsia-300",
    Completed: "bg-emerald-100 border-emerald-300",
};

const btnBase =
    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95";

const btnOrange = `${btnBase} bg-orange-500 text-white hover:bg-orange-600`;
const btnBlue = `${btnBase} bg-sky-500 text-white hover:bg-sky-600`;
const btnPurple = `${btnBase} bg-violet-500 text-white hover:bg-violet-600`;
const btnGreen = `${btnBase} bg-emerald-500 text-white hover:bg-emerald-600`;
const btnRed = `${btnBase} bg-rose-500 text-white hover:bg-rose-600`;

/* ================= Main ================= */

export default function AppointmentCard({
    appointment,
    statuses,
    role,
    onStatusChange,
    onEdit,
    onAddService,
    onViewBill,
    onDelete,
}: {
    appointment: Appointment;
    statuses: Status[];
    role: "receptionist" | "doctor";
    onStatusChange: (id: string, statusId: string) => void;
    onEdit?: (a: Appointment) => void;
    onAddService?: (a: Appointment) => void;
    onViewBill?: (a: Appointment) => void;
    onDelete?: (a: Appointment) => void;
}) {
    const [open, setOpen] = useState(false);

    if (!appointment) return null;

    const total =
        appointment.lines?.reduce((sum, l) => sum + (l.amount || 0), 0) || 0;

    const statusName = appointment.status?.name || "Waiting";
    const specialization = appointment.doctor?.specialization;

    const flags = {
        isCompleted: statusName === "Completed",
        isOccupied: statusName === "Occupied",
        isWaiting: statusName === "Waiting",
        isReady: statusName === "Ready for Payment",
        isOptometrist: statusName === "Optometrist",
        isDrops: statusName === "Drops",
        isOphtha: specialization === "Ophthalmology",
    };

    const getStatusId = (name: string) =>
        statuses.find((s) => s.name === name)?._id || "";

    return (
        <div className="w-full rounded-xl border border-gray-400 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden">
            <Header
                appointment={appointment}
                open={open}
                setOpen={setOpen}
                statusName={statusName}
                role={role}
                flags={flags}
                getStatusId={getStatusId}
                onStatusChange={onStatusChange}
                onViewBill={onViewBill}
                onDelete={onDelete}
            />

            <Accordion open={open}>
                <Info
                    appointment={appointment}
                    role={role}
                    flags={flags}
                    onEdit={onEdit}
                />

                <Services
                    lines={appointment.lines || []}
                    total={total}
                    role={role}
                    flags={flags}
                    onAddService={() => onAddService?.(appointment)}
                />
            </Accordion>
        </div>
    );
}

/* ================= Header ================= */

function Header({
    appointment,
    open,
    setOpen,
    statusName,
    role,
    flags,
    getStatusId,
    onStatusChange,
    onViewBill,
    onDelete,
}: any) {
    const {
        isCompleted,
        isOccupied,
        isWaiting,
        isReady,
        isOptometrist,
        isDrops,
        isOphtha,
    } = flags;

    return (
        <div
            onClick={() => setOpen(!open)}
            className={`
        flex flex-wrap items-center justify-between gap-3
        p-4 cursor-pointer transition-all duration-300 border-l-4
        ${STATUS_COLORS[statusName] || "bg-gray-50 border-gray-200"}
        ${open ? "shadow-md" : "hover:shadow-sm"}
      `}
        >
            {/* Left */}
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center font-semibold text-[11px] shadow">
                    {appointment.serialNo}
                </div>

                <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                        {appointment.type} - {appointment.patient?.name || "Unknown"} - <StatusBadge status={statusName} />
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(appointment.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock size={12} /> {appointment.time}
                        </span>
                        {appointment.doctor && (
                            <span className="flex items-center gap-1">
                                <Stethoscope size={12} /> {appointment.doctor.name}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                {isWaiting && (
                    <>
                        <ActionBtn
                            className={btnOrange}
                            onClick={() =>
                                onStatusChange(
                                    appointment._id,
                                    getStatusId("Occupied")
                                )
                            }
                            label="Occupied"
                        />
                        {onDelete && (
                            <ActionBtn
                                className={btnRed}
                                onClick={() => onDelete(appointment)}
                                icon={<Trash2 size={14} />}
                            />
                        )}
                    </>
                )}

                {isReady && (
                    <ActionBtn
                        className={btnGreen}
                        onClick={() =>
                            onStatusChange(
                                appointment._id,
                                getStatusId("Completed")
                            )
                        }
                        label="Complete"
                    />
                )}

                {role === "doctor" && isOccupied && isOphtha && (
                    <>
                        <ActionBtn
                            className={btnBlue}
                            onClick={() =>
                                onStatusChange(
                                    appointment._id,
                                    getStatusId("Optometrist")
                                )
                            }
                            label="Optometrist"
                        />
                        <ActionBtn
                            className={btnPurple}
                            onClick={() =>
                                onStatusChange(
                                    appointment._id,
                                    getStatusId("Drops")
                                )
                            }
                            label="Drops"
                        />
                    </>
                )}

                {(isOptometrist || isDrops) && role === "doctor" && isOphtha && (
                    <>
                        <ActionBtn
                            className={btnOrange}
                            onClick={() =>
                                onStatusChange(
                                    appointment._id,
                                    getStatusId("Occupied")
                                )
                            }
                            label="Back"
                        />
                        <ActionBtn
                            className={btnPurple}
                            onClick={() =>
                                onStatusChange(
                                    appointment._id,
                                    getStatusId("Ready for Payment")
                                )
                            }
                            label="Ready"
                        />
                    </>
                )}

                {role === "doctor" && isOccupied && !isOphtha && (
                    <ActionBtn
                        className={btnPurple}
                        onClick={() =>
                            onStatusChange(
                                appointment._id,
                                getStatusId("Ready for Payment")
                            )
                        }
                        label="Ready"
                    />
                )}

                {isCompleted && onViewBill && (
                    <ActionBtn
                        className="px-3 py-1.5 rounded-lg bg-white border text-emerald-700 text-xs font-semibold"
                        onClick={() => onViewBill(appointment)}
                        icon={<Receipt size={14} />}
                        label="Bill"
                    />
                )}

                <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${open ? "rotate-180" : ""
                        }`}
                />
            </div>
        </div>
    );
}

/* ================= Small UI ================= */

function StatusBadge({ status }: { status: string }) {
    const COLORS: Record<string, string> = {
        Waiting: "bg-amber-100 text-amber-800 border border-amber-300",
        Optometrist: "bg-sky-100 text-sky-800 border border-sky-300",
        Occupied: "bg-orange-100 text-orange-800 border border-orange-300",
        Drops: "bg-violet-100 text-violet-800 border border-violet-300",
        "Ready for Payment": "bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-300",
        Completed: "bg-emerald-100 text-emerald-800 border border-emerald-300",
    };

    return (
        <span
            className={`
                inline-flex items-center gap-1
                mt-1 px-3 py-0.5
                rounded-full text-[11px] font-semibold
                ${COLORS[status] || "bg-gray-100 text-gray-800 border border-gray-300"}
            `}
        >
            {status}
        </span>
    );
}


function ActionBtn({
    onClick,
    label,
    icon,
    className,
}: {
    onClick: () => void;
    label?: string;
    icon?: React.ReactNode;
    className: string;
}) {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            className={className}
        >
            {icon}
            {label && <span className="ml-1">{label}</span>}
        </button>
    );
}

/* ================= Accordion ================= */

function Accordion({
    open,
    children,
}: {
    open: boolean;
    children: React.ReactNode;
}) {
    return (
        <div
            className={`grid overflow-hidden transition-all duration-500 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
        >
            <div className="overflow-hidden">
                <div className="p-4 bg-white border-t space-y-5 text-xs">
                    {children}
                </div>
            </div>
        </div>
    );
}

/* ================= Info ================= */

function Info({
    appointment,
    role,
    flags,
    onEdit,
}: any) {
    return (
        <div className="flex flex-wrap justify-between items-center gap-3 bg-gray-50 rounded-lg p-3">
            <div className="space-y-2">
                <Row icon={<User size={14} />} label="Patient">
                    {appointment.patient?.name || "Unknown"}
                </Row>
                <Row icon={<Stethoscope size={14} />} label="Doctor">
                    {appointment.doctor?.name || "Not Assigned"}
                </Row>
            </div>

            {!flags.isCompleted && flags.isWaiting && onEdit && (
                <button
                    onClick={() => onEdit(appointment)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 text-white text-xs hover:bg-blue-700 transition"
                >
                    <Edit size={14} /> Edit
                </button>
            )}
        </div>
    );
}

function Row({
    icon,
    label,
    children,
}: {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-2">
            <span className="mt-0.5 text-blue-600">{icon}</span>
            <div>
                <p className="text-[10px] uppercase text-gray-500">{label}</p>
                <p className="font-semibold text-gray-900">{children}</p>
            </div>
        </div>
    );
}

/* ================= Services ================= */

function Services({
    lines,
    total,
    role,
    flags,
    onAddService,
}: any) {
    return (
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between font-semibold">
                <div className="flex items-center gap-2">
                    <Layers size={14} /> Services
                </div>

                {role === "doctor" && flags.isOccupied && onAddService && (
                    <button
                        onClick={onAddService}
                        className="inline-flex items-center gap-1 text-sky-600 text-xs font-semibold hover:text-sky-700 transition"
                    >
                        <Plus size={14} /> Add
                    </button>
                )}
            </div>

            {lines.map((l: any) => (
                <div
                    key={l._id}
                    className="flex justify-between items-center"
                >
                    <span>{l.service?.name}</span>
                    <span className="flex items-center gap-1">
                        <IndianRupee size={12} /> {l.amount}
                    </span>
                </div>
            ))}

            <div className="flex justify-between items-center border-t pt-2 font-semibold">
                <span>Total</span>
                <span className="flex items-center gap-1 text-blue-600">
                    <IndianRupee size={12} /> {total}
                </span>
            </div>
        </div>
    );
}
