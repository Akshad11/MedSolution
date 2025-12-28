"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export function SearchableSelectInput({
    label,
    name,
    value,
    onChange,
    options,
    className = "",
}: any) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState(value || "");
    const ref = useRef<HTMLDivElement>(null);

    // Sync when value changes from parent
    useEffect(() => {
        setQuery(value || "");
    }, [value]);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filtered = options.filter((opt: any) => {
        if (!query) return true;

        if (typeof opt === "string") {
            return opt.toLowerCase().includes(query.toLowerCase());
        }

        // if object → try common keys
        return Object.values(opt)
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase());
    });


    return (
        <div ref={ref} className="relative">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}

            {/* Input */}
            <div className="relative">
                <input
                    type="text"
                    name={name}
                    value={query}
                    placeholder="Select..."
                    onChange={(e) => {
                        setQuery(e.target.value);
                        onChange(e);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    className={`
            input p-2 w-full
            border border-gray-400 rounded-md bg-white
            ${className}
          `}
                />
                <ChevronDown
                    size={16}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
            </div>

            {/* Dropdown */}
            {open && (
                <div
                    className="
            absolute z-20 mt-1 w-full
            bg-white border rounded-md shadow-lg
          "
                >
                    <div className="max-h-48 overflow-y-auto">
                        {filtered.length === 0 && (
                            <div className="p-2 text-sm text-gray-500">No results</div>
                        )}

                        {filtered.map((opt: string) => (
                            <div
                                key={opt}
                                onClick={() => {
                                    // set local value
                                    setQuery(opt);
                                    setOpen(false);

                                    // trigger parent onChange like a real event
                                    onChange({
                                        target: { name, value: opt },
                                    });
                                }}
                                className="
                  px-3 py-2 text-sm cursor-pointer
                  hover:bg-blue-50
                "
                            >
                                {opt}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
