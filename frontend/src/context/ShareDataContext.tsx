"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    getDoctors,
    getPatient,
    getLocation,
    getStatuses,
    getServices,
} from "@/lib/authApi";
import { Doctor, LocationNames, Patient, Status } from "@/types/user";

type ShareDataContextType = {
    doctors: Doctor[];
    patients: Patient[];
    locations: LocationNames[];
    statuses: Status[];
    services: any[];
    loading: boolean;
    refresh: () => Promise<void>;
};

const ShareDataContext = createContext<ShareDataContextType | null>(null);

export function ShareDataProvider({ children }: { children: React.ReactNode }) {
    const { user, loading: authLoading, logout } = useAuth(); // ✅ get logout

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [locations, setLocations] = useState<LocationNames[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const clearData = () => {
        setDoctors([]);
        setPatients([]);
        setLocations([]);
        setStatuses([]);
        setServices([]);
    };

    const loadAll = async () => {
        if (!user) return;

        try {
            setLoading(true);

            const [docRes, patRes, locRes, statRes, svcRes] = await Promise.all([
                getDoctors("doctor", ""),
                getPatient(""),
                getLocation(),
                getStatuses(),
                getServices(),
            ]);
            setDoctors(docRes.data || []);
            setPatients(patRes.data || []);
            setLocations(locRes.data || []);
            setStatuses(statRes.data || []);
            setServices(svcRes.data || []);
        } catch (err: any) {
            console.error("Failed to load shared data", err);

            // ✅ Auto logout on 401
            if (err?.response?.status === 401) {
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authLoading) return;

        if (user) {
            loadAll();
        } else {
            clearData();
        }
    }, [user, authLoading]);

    return (
        <ShareDataContext.Provider
            value={{
                doctors,
                patients,
                locations,
                statuses,
                services,
                loading,
                refresh: loadAll,
            }}
        >
            {children}
        </ShareDataContext.Provider>
    );
}

export function useShareData() {
    const ctx = useContext(ShareDataContext);
    if (!ctx) {
        throw new Error("useShareData must be used inside ShareDataProvider");
    }
    return ctx;
}
