"use client";

import { useEffect, useMemo, useState } from "react";
import { TextInput } from "../TextInput";
import { Section } from "@/types/user";
import SearchableTableSelectInput from "../SearchableTableSelectInput";

type Props<T> = {
    open: boolean;
    title: string;
    description?: string;
    submitText: string;
    initialForm: T;
    sections: Section[];
    onClose: () => void;
    onSubmit: (form: T) => Promise<void>;
};

export default function AddEditModal<T extends Record<string, any>>({
    open,
    title,
    description,
    submitText,
    initialForm,
    sections,
    onClose,
    onSubmit,
}: Props<T>) {
    const [form, setForm] = useState<T>(initialForm);
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setForm(initialForm);
        setTouched({});
    }, [initialForm]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        setTouched((t) => ({ ...t, [name]: true }));
    };

    /* ---------------- Validation ---------------- */

    const requiredFields = useMemo(() => {
        return sections
            .flatMap((s) => s.fields)
            .filter((f) => f.required)
            .map((f) => f.name);
    }, [sections]);

    const errors = useMemo(() => {
        const err: Record<string, string> = {};
        requiredFields.forEach((name) => {
            if (!form[name] || String(form[name]).trim() === "") {
                err[name] = "This field is required";
            }
        });
        return err;
    }, [form, requiredFields]);

    const isValid = Object.keys(errors).length === 0;

    /* ---------------- Submit ---------------- */

    const submit = async () => {
        if (!isValid) return;
        setLoading(true);
        try {
            await onSubmit(form);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    // ✅ Conditional render AFTER hooks
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex text-gray-900 items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white w-full max-w-3xl mx-4 rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
                {/* Header */}
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold">{title}</h2>
                        {description && (
                            <p className="text-sm text-gray-500">{description}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-xl text-gray-500 hover:text-black"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
                    {sections.map((section, i) => (
                        <section key={i} className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">
                                {section.title}
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {section.fields.map((f) => {
                                    const error = touched[f.name] && errors[f.name];

                                    if (f.type === "select") {
                                        return (
                                            <div key={f.name}>
                                                <SearchableTableSelectInput
                                                    label={f.label}
                                                    name={f.name}
                                                    value={form[f.name]}
                                                    options={f.options || []}
                                                    onChange={handleChange}
                                                    displayKeys={f.displayKeys}
                                                    displayValueKey={f.displayValueKey}
                                                    valueKey={f.valueKey}
                                                    disabled={f.disabled}
                                                    required={f.required}
                                                    defaultOption={f.defaultOption}
                                                />
                                                {error && (
                                                    <p className="text-xs text-red-600 mt-1">{error}</p>
                                                )}
                                            </div>
                                        );
                                    }

                                    return (
                                        <div
                                            key={f.name}
                                            className={f.colSpan ? "sm:col-span-2" : ""}
                                        >
                                            <TextInput
                                                label={f.label}
                                                name={f.name}
                                                type={f.type}
                                                value={form[f.name]}
                                                onChange={handleChange}
                                                disabled={f.disabled}
                                                required={f.required}
                                                colSpan={f.colSpan}
                                            />
                                            {error && (
                                                <p className="text-xs text-red-600 mt-1">{error}</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={submit}
                        disabled={loading || !isValid}
                        className={`
              px-6 py-2 rounded-lg text-white transition
              ${isValid
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-blue-300 cursor-not-allowed"
                            }
            `}
                    >
                        {loading ? "Saving..." : submitText}
                    </button>
                </div>
            </div>
        </div>
    );
}
