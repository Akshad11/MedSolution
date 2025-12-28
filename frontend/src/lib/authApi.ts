import { linesService, Service } from "@/types/user";
import api from "./axios";

export const loginApi = async (username: string, password: string) => {
    const res = await api.post("/api/auth/login", {
        username,
        password,
    });

    return res.data;
};


//Doctors APIS
export const getDoctors = (role: string, search = "") =>
    api.get("/api/doctor", {
        params: {
            role,
            search,
        },
    });

export const createDoctor = (data: any) =>
    api.post("/api/doctor", data);

export const toggleDoctorStatus = (id: string) =>
    api.patch(`/api/doctor/unavailable/${id}/status`);

export const UserDelete = (id: string) =>
    api.delete(`/api/users/${id}`);

export const EditDoctor = (id: string, data: any) =>
    api.put(`/api/doctor/${id}`, data);

//Receptionists APIS
export const getReceptionists = (role: string, search = "") =>
    api.get("/api/receptionists", {
        params: {
            role,
            search,
        },
    });

export const createReceptionists = (data: any) =>
    api.post("/api/receptionists", data);

export const EditReceptionists = (id: string, data: any) =>
    api.put(`/api/receptionists/${id}`, data);

//Patient APIS
export const getPatient = (role: string, search = "") =>
    api.get("/api/patient", {
        params: {
            role,
            search,
        },
    });

export const createPatient = (data: any) =>
    api.post("/api/patient", data);

export const EditPatient = (id: string, data: any) =>
    api.put(`/api/patient/${id}`, data);

export const deletePatient = (id: string) =>
    api.delete(`/api/patient/${id}`);


//Location API
export const getLocation = () =>
    api.get('/api/locations');


//Appointment API
export const getAppointments = () =>
    api.get('/api/appointments');

export const updateAppointmentStatus = (id: string, data: string) => {
    api.put(`/api/appointments/status/${id}`, { status: data });
};

export const createAppointment = (data: any) =>
    api.post(`/api/appointments`, data);

export const updateAppointment = (id: string, data: any) =>
    api.put(`/api/appointments/${id}`, data);

//Status API
export const getStatuses = () =>
    api.get(`/api/statuses`);

// lib/serviceApi.ts
export const getServices = () => api.get("/api/services");

export const getServicesByID = (id: string) => api.get(`/api/services/${id}`);

export const createService = (data: Service) => {
    api.post("/api/services", { name: data.name, amount: data.amount, enabled: data.enabled, doctor: data.doctor });
}
export const updateService = (id: string, data: Service) =>
    api.put(`/api/services/${id}`, { name: data.name, amount: data.amount, enabled: data.enabled, doctor: data.doctor });

export const deleteService = (id: string) =>
    api.delete(`/api/services/${id}`);

export const appointmentslinesByService = async (data: any) => {
    const res = await api.post(`/api/appointments/lines`, data);
    return res.data;
};

// Notification API
export const getNotifications = () => api.get("/api/notifications");
export const markNotificationRead = (id: string) =>
    api.put(`/api/notifications/${id}/read`);


//Admin API
export const getAdminByID = (id: String) =>
    api.get(`/api/users/${id}`, {
        params: {
            id
        },
    });

export const updateUser = (id: string, data: any) =>
    api.put(`/api/users/${id}`, data);



export const getUsers = (role: string, search = "") =>
    api.get(`/api/users`, {
        params: { role, search },
    });

export const createUser = (data: any) =>
    api.post("/api/users", data);


export const toggleUserStatus = (id: string) =>
    api.patch(`/api/users/${id}/status`);

export const exportUsers = (role: string) =>
    api.get(`/api/users/export`, {
        params: { role },
        responseType: "blob",
    });