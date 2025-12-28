"use client";

import { useState, useEffect } from "react";
import AppToast, { AppToastType } from "@/components/ui/AppToast";

type ToastData = {
    type: AppToastType;
    message?: string;
};

export function useAppToast() {
    const [toast, setToast] = useState<ToastData | null>(null);

    const showToast = (type: AppToastType, message?: string) => {
        setToast({ type, message });
    };

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(timer);
    }, [toast]);

    const ToastView = () =>
        toast ? (
            <div className="fixed top-5 right-5 z-9999">
                <AppToast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            </div>
        ) : null;

    return { showToast, ToastView };
}
