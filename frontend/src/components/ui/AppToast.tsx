"use client";

import { CheckCircle, XCircle, Info, Trash2, Pencil, Plus } from "lucide-react";

export type AppToastType =
    | "success"
    | "error"
    | "info"
    | "added"
    | "edited"
    | "deleted";

type Props = {
    type: AppToastType;
    message?: string;
    onClose: () => void;
};

const config = {
    success: { icon: CheckCircle, cls: "bg-green-100 text-green-700" },
    error: { icon: XCircle, cls: "bg-red-100 text-red-700" },
    info: { icon: Info, cls: "bg-blue-100 text-blue-700" },
    added: { icon: Plus, cls: "bg-emerald-100 text-emerald-700" },
    edited: { icon: Pencil, cls: "bg-yellow-100 text-yellow-700" },
    deleted: { icon: Trash2, cls: "bg-red-100 text-red-700" },
};

export default function AppToast({ type, message, onClose }: Props) {
    const Icon = config[type].icon;

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow border ${config[type].cls}`}
        >
            <Icon size={18} />
            <p className="text-sm font-medium">
                {message || "Action completed"}
            </p>
            <button
                onClick={onClose}
                className="ml-auto font-bold opacity-60 hover:opacity-100"
            >
                ✕
            </button>
        </div>
    );
}
