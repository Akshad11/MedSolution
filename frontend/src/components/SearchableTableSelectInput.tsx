"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";

type DefaultOption = {
    label: string;
    value: any;
};

type Props = {
    label?: string;
    name: string;
    value?: any;
    options: any[];
    displayKeys?: string[];
    displayValueKey?: string;
    valueKey?: string; // default "_id"
    required?: boolean;
    disabled?: boolean;
    className?: string;
    freeText?: boolean;
    defaultOption?: DefaultOption;
    loading?: boolean;
    onChange: (e: { target: { name: string; value: any } }) => void;
};

export default function SearchableTableSelectInput({
    label,
    name,
    value,
    options,
    displayKeys = [],
    displayValueKey = "",
    valueKey = "_id",
    required = false,
    disabled = false,
    className = "",
    freeText = true,
    defaultOption,
    loading = false,
    onChange,
}: Props) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const isObjectMode = options.length > 0 && typeof options[0] === "object";
    const allowFreeText = freeText && !isObjectMode && !disabled;

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);

    // 🔹 Helpers
    const getOptionValue = (opt: any) =>
        isObjectMode ? opt[valueKey] : opt;

    const getOptionLabel = (opt: any) => {
        if (!isObjectMode) return String(opt);
        if (displayValueKey) return String(opt[displayValueKey] ?? "");
        if (displayKeys.length)
            return displayKeys.map((k) => opt[k]).join(" ");
        return String(opt[valueKey]);
    };

    const getOptionColumns = (opt: any) => {
        if (!isObjectMode) return [String(opt)];
        if (displayKeys.length)
            return displayKeys.map((k) => String(opt[k] ?? ""));
        return [getOptionLabel(opt)];
    };

    // ✅ Sync display label from value
    useEffect(() => {
        if (value === undefined || value === null || value === "") {
            setQuery("");
            return;
        }

        if (isObjectMode) {
            const found = options.find(
                (o) => String(o[valueKey]) === String(value)
            );

            if (found) {
                setQuery(getOptionLabel(found));
            } else {
                setQuery("");
            }
        } else {
            setQuery(String(value));
        }
    }, [value, options, isObjectMode, valueKey]);

    // 🔹 Apply default option
    useEffect(() => {
        if (
            defaultOption &&
            (value === undefined || value === null || value === "")
        ) {
            onChange({
                target: { name, value: defaultOption.value },
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 🔹 Outside click close
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // 🔹 Filter options
    const filteredOptions = useMemo(() => {
        if (!query) return options;
        const q = query.toLowerCase();
        return options.filter((opt) => {
            const label = getOptionLabel(opt).toLowerCase();
            return label.includes(q);
        });
    }, [query, options]);

    // 🔹 Select handler
    const selectOption = (opt: any) => {
        const val = getOptionValue(opt);
        onChange({ target: { name, value: val } });
        setOpen(false);
        setActiveIndex(-1);
    };

    const clearValue = () => {
        if (disabled) return;
        setQuery("");
        onChange({ target: { name, value: "" } });
        setActiveIndex(-1);
    };

    // 🔹 Keyboard support
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            setOpen(true);
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setActiveIndex((i) =>
                    Math.min(i + 1, filteredOptions.length - 1)
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
                break;
            case "Enter":
                e.preventDefault();
                if (activeIndex >= 0 && filteredOptions[activeIndex]) {
                    selectOption(filteredOptions[activeIndex]);
                } else if (allowFreeText) {
                    onChange({
                        target: { name, value: query },
                    });
                    setOpen(false);
                }
                break;
            case "Escape":
                setOpen(false);
                break;
        }
    };

    // 🔹 Highlight match
    const highlight = (text: string) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, "gi"));
        return parts.map((p, i) =>
            p.toLowerCase() === query.toLowerCase() ? (
                <span key={i} className="bg-yellow-200 text-gray-900">
                    {p}
                </span>
            ) : (
                p
            )
        );
    };

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            {label && (
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div
                className={`flex items-center rounded-lg border px-3 shadow-sm transition
                ${disabled
                        ? "bg-gray-100 cursor-not-allowed text-gray-500"
                        : "bg-white focus-within:ring-2 ring-blue-500"
                    }`}
            >
                <input
                    ref={inputRef}
                    name={name}
                    value={query}
                    disabled={disabled}
                    readOnly={disabled || isObjectMode}
                    placeholder={loading ? "Loading..." : "Select..."}
                    onChange={(e) => {
                        if (disabled) return;
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => !disabled && setOpen(true)}
                    className="w-full bg-transparent py-2 text-sm outline-none"
                    role="combobox"
                    aria-expanded={open}
                />

                {query && !disabled && (
                    <button
                        type="button"
                        onClick={clearValue}
                        className="mr-1 text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                )}

                <ChevronDown
                    size={18}
                    className={`text-gray-400 transition ${open ? "rotate-180" : ""
                        }`}
                />
            </div>

            {/* 🔽 Dropdown */}
            {open && !disabled && (
                <ul
                    role="listbox"
                    className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-white shadow-lg animate-in fade-in slide-in-from-top-1"
                >
                    {/* Header */}
                    {isObjectMode && displayKeys.length > 0 && (
                        <li className="sticky top-0 bg-gray-100 border-b px-2 py-2 text-xs font-semibold text-gray-600">
                            <div
                                className="grid gap-2"
                                style={{
                                    gridTemplateColumns: `repeat(${displayKeys.length}, minmax(0, 1fr))`,
                                }}
                            >
                                {displayKeys.map((key) => (
                                    <div key={key} className="truncate capitalize">
                                        {key.replace(/_/g, " ")}
                                    </div>
                                ))}
                            </div>
                        </li>
                    )}

                    {loading && (
                        <li className="px-4 py-2 text-sm text-gray-500">
                            Loading...
                        </li>
                    )}

                    {!loading && filteredOptions.length === 0 && (
                        <li className="px-4 py-2 text-sm text-gray-500">
                            No results found
                        </li>
                    )}

                    {!loading &&
                        filteredOptions.map((opt, idx) => {
                            const cols = getOptionColumns(opt);
                            const active = idx === activeIndex;

                            return (
                                <li
                                    key={getOptionValue(opt)}
                                    role="option"
                                    aria-selected={active}
                                    onMouseDown={() => selectOption(opt)}
                                    onMouseEnter={() => setActiveIndex(idx)}
                                    className={`cursor-pointer px-2 py-2 text-sm transition
                                    ${active
                                            ? "bg-blue-500 text-white"
                                            : "hover:bg-blue-50"
                                        }`}
                                >
                                    <div
                                        className="grid gap-2"
                                        style={{
                                            gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))`,
                                        }}
                                    >
                                        {cols.map((col, i) => (
                                            <div key={i} className="truncate">
                                                {highlight(col)}
                                            </div>
                                        ))}
                                    </div>
                                </li>
                            );
                        })}
                </ul>
            )}
        </div>
    );
}
