export type Role = {
    id: string;
    name: "admin" | "doctor" | "receptionist";
};

export type User = {
    _id: string;
    name: string;
    surname?: string;
    gender?: "Male" | "Female";
    date_of_birth?: string;
    email: string;
    phone_no?: string;
    address?: string;
    location?: string;
    username: string;
    role?: Role;
    enabled: boolean;
    createdAt?: string;
    updatedAt?: string;
    roleID?: string;
};
export type Doctor = {
    _id: string;
    user: User;
    name: string;
    specialization: string;
    availability: "Available" | "Unavailable";
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

export type PatientAddress = {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    Location?: string; // because one record uses this key
};

export type CreatedBy = {
    _id: string;
    name: string;
    username: string;
};

export type Patient = {
    _id: string;
    name: string;
    dateOfBirth: string;   // ISO string from API
    age: number;
    gender: "Male" | "Female" | "Other";
    contactNumber: string;
    email: string;
    bloodGroup: string;
    knownAllergies: string[];
    notes: string;
    enabled: boolean;
    location: string;
    createdBy: CreatedBy;
    createdAt: string;
    updatedAt: string;
    __v: number;
};


export type AppointmentType = "Appointment" | "Walk-in";

// export interface Appointment {
//     _id: string;
//     serialNo: string;

//     patient: string;
//     doctor: string;

//     type: AppointmentType;
//     date?: Date | string;
//     time?: string;

//     status: string;

//     createdBy: string;

//     enabled: boolean;

//     createdAt?: Date;
//     updatedAt?: updatedAt[];
// }

export type updatedAt = {
    user: string;
    datetime: string;
}
export type DoctorMini = {
    _id: string;
    name: string;
    specialization: string;
};

export type ServiceMini = {
    _id: string;
    doctor: string;
    name: string;
    amount: number;
    enabled: boolean;
};

export type AppointmentLine = {
    _id: string;
    service: ServiceMini;
    amount: number;
    notes: string;
};

export type AppointmentHeader = {
    _id: string;
};

export type Appointment = {
    _id: string;
    serialNo: string;

    doctor: any;

    type: "Appointment" | "Walk-in";

    date: string;   // ISO string
    time: string;

    enabled: boolean;
    createdAt: string;

    header: any;

    patient: any;        // can replace later with Patient type
    status: any;         // can replace later with Status type
    paymentMethod: any;  // can replace later with PaymentMethod type

    lines: any[];
};


export interface Service {
    _id: string;

    name: string;

    doctor: DoctorMini;

    amount?: number;

    enabled: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface linesService {
    _id: string;
    note: string;
    doctor: DoctorMini;
    amount?: number;
}

export type PaymentMethodName = "Cash" | "Card" | "UPI";

export interface PaymentMethod {
    _id: string;

    name: PaymentMethodName;

    enabled: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}

export type StatusName =
    | "Waiting"
    | "Optometrist"
    | "Drops"
    | "Occupied"
    | "Ready for Payment"
    | "Completed"
    | "cancelled";

export interface Status {
    _id: string;
    name: StatusName;
    order: number;
    description?: string;
    enabled: boolean;
    createdAt?: string;
    updatedAt?: string;
}
export type LocationNames = {
    _id: string;
    name: string;
    enabled: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type Section = {
    title: string;
    fields: Field[];
};

export type Field = {
    type: "text" | "date" | "number" | "select" | "time" | "password" | "textarea" | "checkbox" | "email";
    name: string;
    label: string;
    options?: any[];
    colSpan?: boolean;
    displayKeys?: string[];
    displayValueKey?: string,
    valueKey?: string;
    required?: boolean;
    disabled?: boolean;
    defaultOption?: { label: string; value: any };
};