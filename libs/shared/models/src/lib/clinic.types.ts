import { Appointment } from "./appointment.model";

export interface Clinic {
    id: string,
    name: string,
    address: string,
    email: string,
    phoneNumber: string,
    timezone: string,
    workingHours: workingHours[],
    createdAt: Date,
    updatedAt: Date,
    appointments: Appointment[]
    availability: Availability[]
}

export interface Availability {
    id: string,
    clinicId: string,
    dayOfWeek: number, // 0 (Sunday) to 6 (Saturday)
    startTime: string, // "HH:mm" format
    endTime: string,   // "HH:mm" format
    createdAt: Date,
    updatedAt: Date
}


export interface ClinicFilters {
    name?: string;
    address?: string;
    email?: string;
    phoneNumber?: string;
    search?: string;
}

export interface workingHours {
    dayOfWeek: number; // 0 (Sunday) to 6 (Saturday)
    startTime: string; // "HH:mm" format
    endTime: string;   // "HH:mm" format
}

export interface ClinicCreateDto {
    name: string;
    address: string;
    email: string;
    phoneNumber: string;
    timezone: string;
    workingHours: workingHours[];
}

export interface ClinicUpdateDto {
    name?: string;
    address?: string;
    email?: string;
    phoneNumber?: string;
    timezone?: string;
    workingHours?: workingHours[];
}

export interface ClinicState {  
    clinics: Clinic[];
    selectedClinic: Clinic | null;
    loading: boolean;
    error: string | null;
}