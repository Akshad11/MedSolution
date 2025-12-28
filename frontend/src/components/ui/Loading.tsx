"use client";

export default function Loading({
    text = "Loading...",
    fullScreen = false,
}: {
    text?: string;
    fullScreen?: boolean;
}) {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                <Spinner />
                <p className="mt-3 text-sm text-gray-600">{text}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-10">
            <Spinner />
            <p className="mt-2 text-sm text-gray-600">{text}</p>
        </div>
    );
}

function Spinner() {
    return (
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    );
}
