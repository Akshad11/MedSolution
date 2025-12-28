import RoleGuard from "@/components/RoleGuard";

export default function AdminPage() {
    return (
        <RoleGuard role="admin">
            <h1 className="p-6 text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </RoleGuard>
    );
}
