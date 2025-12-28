import DoctorDashboard from "@/components/doctors/Dashboard";
import RoleGuard from "@/components/RoleGuard";

export default function DoctorPage() {
    return (
        <RoleGuard role="doctor">
            <DoctorDashboard />
        </RoleGuard>
    );
}
