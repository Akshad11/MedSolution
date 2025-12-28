import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import FloatingProfileMenu from "@/components/FloatingProfileMenu";

export default function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-100">
            <div className="flex h-screen overflow-hidden">

                {/* Sidebar + Mobile Topbar */}
                <AdminSidebar />

                {/* Main Content */}
                <main
                    className="
            flex-1
            overflow-y-auto
            p-4 sm:p-6
            pt-16 sm:pt-6
          "
                >
                    {children}
                    <FloatingProfileMenu />
                </main>
            </div>
        </div>
    );
}
