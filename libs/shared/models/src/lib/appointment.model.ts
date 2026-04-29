
export type AppStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface AppointmentFilters {
  date?: string;   // 'YYYY-MM-DD'
  status?: AppStatus;
  search?: string;
}

export interface AppointmentQuery extends AppointmentFilters {
  clinicId?: string;
}

export interface Appointment {
  id: string;
  clinicId: string;
  patientName: string;
  patientEmail: string;
  reason: string;
  startTime: Date;
  endTime: Date;
  status: AppStatus;
  cancelToken?: string;
  aiSuggestion?: any;
  createdAt: Date;
  updatedAt: Date;
  clinic?: {
    id: string;
    name: string;
  };
}

export interface AppointmentState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  loading: boolean;
  error: string | null;
}

export interface CreateAppointmentDto {
  clinicId: string;
  patientName: string;
  patientEmail: string;
  reason: string;
  startTime: string;
  endTime: string;
  status?: AppStatus;
}