"use client";

type Status = {
    key: string;
    label: string;
    color: string;
};

export default function StatusTabs({
    statuses,
    active,
    onToggle,
}: {
    statuses: Status[];
    active: string[];
    onToggle: (key: string) => void;
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {statuses.map((s) => {
                const isActive = active.includes(s.key);

                return (
                    <button
                        key={s.key}
                        onClick={() => onToggle(s.key)}
                        className={`
              px-4 py-1.5 rounded-full text-xs font-medium border transition
              ${isActive
                                ? `${s.color} border-transparent`
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}
            `}
                    >
                        {s.label}
                    </button>
                );
            })}
        </div>
    );
}
