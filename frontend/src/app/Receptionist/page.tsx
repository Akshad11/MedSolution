import ReceptionistDashboard from "@/components/receptionist/Dashboard";
import RoleGuard from "@/components/RoleGuard";

export default function ReceptionistPage() {
    return (
        <RoleGuard role="receptionist">
            <ReceptionistDashboard />
        </RoleGuard>
    );
}
