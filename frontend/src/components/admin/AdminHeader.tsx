"use client";

export default function AdminHeader({
    title,
    search,
    setSearch,
    onAdd,
    onExport,
}: any) {
    return (
        <div className="mb-6 text-gray-800">
            <div className="flex flex-col gap-4">

                {/* Title */}
                <h1 className="text-2xl font-semibold tracking-tight">
                    {title}
                </h1>

                {/* Actions */}
                <div
                    className="
            flex flex-col gap-2
            sm:flex-row sm:items-center sm:justify-between
          "
                >
                    {/* Search */}
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="
              w-full
              sm:max-w-xs
              px-3 py-2
              border rounded-lg
              text-sm
              focus:outline-none
              focus:ring-2 focus:ring-blue-500
            "
                    />

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                            onClick={onExport}
                            className="
                w-full sm:w-auto
                px-4 py-2
                border rounded-lg
                text-sm
                bg-white
                hover:bg-gray-50
                transition
              "
                        >
                            Export CSV
                        </button>

                        <button
                            onClick={onAdd}
                            className="
                w-full sm:w-auto
                px-4 py-2
                rounded-lg
                bg-blue-600
                text-white
                text-sm
                hover:bg-blue-700
                transition
                shadow-sm
              "
                        >
                            + Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
