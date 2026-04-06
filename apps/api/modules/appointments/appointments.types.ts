import { AppStatus } from '@prisma/client';

export interface AppointmentFilters {
  date?:   string;   // 'YYYY-MM-DD'
  status?: AppStatus;
  search?: string;
}

export interface AppointmentQuery extends AppointmentFilters {
  clinicId?: string;
}