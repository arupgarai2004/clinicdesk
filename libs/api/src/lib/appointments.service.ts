import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Appointment, CreateAppointmentDto, UpdateAppointmentDto } from "@org/models";
import { APP_CONSTANTS } from "@org/constants";

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  readonly #httpClient = inject(HttpClient);
  readonly APPOINTMENT_BASE_API_URL = APP_CONSTANTS.APPOINTMENT_BASE_API_URL;

  getAppointments(clinicId?: string) {
    return this.#httpClient.get<Appointment[]>(`${this.APPOINTMENT_BASE_API_URL}`, {
      params: clinicId ? { clinicId } : {},
    });
  }
  getAppointment(id: string) {
    return this.#httpClient.get<Appointment>(`${this.APPOINTMENT_BASE_API_URL}/${id}`);
  }

  updateStatus(id: string, status: string) {
    return this.#httpClient.put(`${this.APPOINTMENT_BASE_API_URL}/${id}/status`, null, {
      params: { status },
    });
  }

  createAppointment(dto: CreateAppointmentDto) {
    return this.#httpClient.post<Appointment>(this.APPOINTMENT_BASE_API_URL, dto);
  }

  updateAppointment(id: string, dto: UpdateAppointmentDto) {
    return this.#httpClient.put<Appointment>(`${this.APPOINTMENT_BASE_API_URL}/${id}`, dto);
  }

  deleteAppointment(id: string) {
    return this.#httpClient.delete(`${this.APPOINTMENT_BASE_API_URL}/${id}`);
  }
}