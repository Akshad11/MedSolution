"use client";

import { Pencil, Trash2 } from "lucide-react";

type Column<T> = {
    key: string;
    label: string;
    render?: (row: T) => React.ReactNode;
};

type Props<T> = {
    data: T[] | null;
    columns: Column<T>[];
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
};

export default function UniversalDataTable<T extends { _id: string }>({
    data,
    columns,
    onEdit,
    onDelete,
}: Props<T>) {

    if (!data) {
        return (
            <div>
                <p>No data</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow text-gray-800">

            {/* ===== DESKTOP TABLE ===== */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-blue-50">
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key} className="p-3 text-left">
                                    {col.label}
                                </th>
                            ))}
                            {(onEdit || onDelete) && (
                                <th className="p-3 text-center">Actions</th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((row) => (
                            <tr
                                key={row._id}
                                className="border-t hover:bg-gray-50 transition"
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className="p-3">
                                        {col.render
                                            ? col.render(row)
                                            : (row as any)[col.key]}
                                    </td>
                                ))}

                                {(onEdit || onDelete) && (
                                    <td className="p-3 text-center">
                                        <div className="flex justify-center gap-2.5">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(row)}
                                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(row)}
                                                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ===== MOBILE CARDS ===== */}
            <div className="md:hidden divide-y">
                {data.map((row) => (
                    <div key={row._id} className="p-4 space-y-1">
                        {columns.map((col) => (
                            <p key={col.key} className="text-sm">
                                <span className="font-medium">{col.label}: </span>
                                {col.render
                                    ? col.render(row)
                                    : (row as any)[col.key]}
                            </p>
                        ))}

                        {(onEdit || onDelete) && (
                            <div className="flex gap-4 mt-2">
                                {onEdit && (
                                    <button
                                        onClick={() => onEdit(row)}
                                        className="text-blue-600 text-sm"
                                    >
                                        Edit
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={() => onDelete(row)}
                                        className="text-red-600 text-sm"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
