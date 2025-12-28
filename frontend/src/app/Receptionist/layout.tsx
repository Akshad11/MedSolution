import ReceptionistSidebar from "@/components/receptionist/ReceptionistSidebar";

export default function ReceptionistLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <ReceptionistSidebar />

            {/* Main Content */}
            <main
                className="
          pt-14 md:pt-0          
          md:pl-64             
          transition-all
          min-h-screen
          p-4 sm:p-6
        "
            >
                {children}
            </main>
        </div>
    );
}
