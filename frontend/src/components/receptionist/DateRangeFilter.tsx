"use client";

export default function DateRangeFilter({
    from,
    to,
    onChange,
}: {
    from: string;
    to: string;
    onChange: (range: { from: string; to: string }) => void;
}) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 text-sm text-gray-900">
            <div className="flex items-center gap-2">
                <span className="text-gray-600">From:</span>
                <input
                    type="date"
                    value={from}
                    onChange={(e) => onChange({ from: e.target.value, to })}
                    className="border rounded px-2 py-1"
                />
            </div>

            <div className="flex items-center gap-2">
                <span className="text-gray-600">To:</span>
                <input
                    type="date"
                    value={to}
                    onChange={(e) => onChange({ from, to: e.target.value })}
                    className="border rounded px-2 py-1"
                />
            </div>
        </div>
    );
}
