import DoctorSidebar from "@/components/doctors/DoctorSidebar";

export default function DoctorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex">
            <DoctorSidebar />
            <main className="ml-64 flex-1 min-h-screen bg-gray-100 p-6">
                {children}
            </main>
        </div>
    );
}
