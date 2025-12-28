"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Service = {
    _id: string;
    name: string;
    amount: number;
};

type Props = {
    open: boolean;
    services: Service[];
    onClose: () => void;
    onSubmit: (data: {
        service: string;
        amount: number;
        note: string;
    }) => Promise<void>;
};

export default function AddServiceModal({
    open,
    services,
    onClose,
    onSubmit,
}: Props) {
    const [service, setService] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            setService("");
            setAmount(0);
            setNote("");
        }
    }, [open]);

    // ✅ Auto fill amount when service changes
    useEffect(() => {
        const svc = services.find((s) => s._id === service);
        if (svc) {
            setAmount(svc.amount);
        }
    }, [service, services]);

    if (!open) return null;

    const submit = async () => {
        if (!service) return;
        setLoading(true);
        try {
            await onSubmit({ service, amount, note });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white w-full max-w-lg mx-4 rounded-xl shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <h2 className="text-lg font-semibold">Add Service</h2>
                    <button onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                    {/* Service */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Service
                        </label>
                        <select
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="">Select service</option>
                            {services.map((s) => (
                                <option key={s._id} value={s._id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Amount
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Note
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-5 py-4 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={submit}
                        disabled={loading || !service}
                        className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Add"}
                    </button>
                </div>
            </div>
        </div>
    );
}
