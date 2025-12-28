"use client";

import { useState } from "react";
import {
    Edit,
    Phone,
    Mail,
    MapPin,
    ChevronDown,
    StickyNote,
    Trash2,
} from "lucide-react";
import { Patient } from "@/types/user";

export default function PatientCard({
    patient,
    onEdit,
    onDelete,
}: {
    patient: Patient;
    onEdit: (p: Patient) => void;
    onDelete: (p: Patient) => void;
}) {
    const [open, setOpen] = useState(false);

    const initials = patient.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="w-full rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            {/* Header */}
            <div
                onClick={() => setOpen(!open)}
                className={`flex items-center justify-between p-3 sm:p-4 cursor-pointer transition ${open ? "bg-blue-50/50" : "hover:bg-blue-50/30"
                    }`}
            >
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center font-semibold text-sm shadow">
                        {initials}
                    </div>

                    {/* Name + Meta */}
                    <div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-tight">
                            {patient.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-600">
                            <span className="px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-700">
                                {patient.gender}
                            </span>
                            {patient.age && (
                                <span className="px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-700">
                                    {patient.age} yrs
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(patient);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs shadow hover:bg-blue-700 transition"
                    >
                        <Edit size={14} />
                        Edit
                    </button>

                    <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${open ? "rotate-180" : ""
                            }`}
                    />
                </div>
            </div>

            {/* Accordion */}
            <div
                className={`grid transition-all duration-500 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
            >
                <div className="overflow-hidden">
                    <div className="p-4 bg-white border-t space-y-3 text-xs">
                        {/* Top Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Info
                                icon={<Phone size={14} />}
                                label="Phone"
                                value={patient.contactNumber}
                            />
                            <Info
                                icon={<Mail size={14} />}
                                label="Email"
                                value={patient.email}
                            />
                        </div>

                        {/* Location + Notes Row */}
                        <div className="grid grid-cols-10 gap-3">
                            {/* Location - 30% */}
                            <div className="col-span-3">
                                <Info
                                    icon={<MapPin size={14} />}
                                    label="Location"
                                    value={patient.location}
                                />
                            </div>

                            {/* Notes - 70% */}
                            <div className="col-span-7">
                                <div className="h-full bg-yellow-50 rounded-lg p-3 flex gap-2">
                                    <StickyNote size={14} className="text-yellow-600 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wide text-yellow-600">
                                            Notes
                                        </p>
                                        <p className="font-medium text-yellow-900 text-xs">
                                            {patient.notes || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delete Button */}
                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={() => onDelete(patient)}
                                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-600 text-white text-xs shadow hover:bg-red-700 transition"
                            >
                                <Trash2 size={14} />
                                Delete Patient
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Info({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value?: string;
}) {
    return (
        <div className="flex items-start gap-2 bg-gray-50 rounded-lg p-3 h-full">
            <div className="text-blue-600 mt-0.5">{icon}</div>
            <div>
                <p className="text-[10px] uppercase tracking-wide text-gray-500">
                    {label}
                </p>
                <p className="font-semibold text-gray-900 text-xs">
                    {value || "-"}
                </p>
            </div>
        </div>
    );
}
