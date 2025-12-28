import { Appointment, Status } from "@/types/user";
import AppointmentCard from "./AppointmentCard";

interface AppointmentListProps {
    data: Appointment[];
    statuses: Status[];
    onUpdate: (id: string, data: any) => void;
    handleAddService: (a: Appointment) => void;
    handleEdit: (a: Appointment) => void;
    handleViewBill: (a: Appointment) => void;
    HandleDelete?: (a: Appointment) => void;
    Currentrole: "doctor" | "receptionist";
}

export default function AppointmentList({
    data,
    statuses,
    onUpdate,
    handleAddService,
    handleEdit,
    handleViewBill,
    Currentrole,
    HandleDelete
}: AppointmentListProps) {

    if (data.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                No appointments found for selected filters.
            </div>
        );
    }
    return (
        <div className="space-y-3">
            {data.map((a: any) => (
                <AppointmentCard
                    key={a._id}
                    appointment={a}
                    statuses={statuses}
                    onStatusChange={(id, status) =>
                        onUpdate(id, { status })
                    }
                    role={Currentrole}
                    onAddService={handleAddService}
                    onEdit={handleEdit}
                    onViewBill={handleViewBill}
                    onDelete={HandleDelete}
                />
            ))}
        </div>
    );
}