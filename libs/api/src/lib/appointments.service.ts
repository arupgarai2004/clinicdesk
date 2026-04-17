import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Appointment } from "@org/models";

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  readonly #httpClient = inject(HttpClient);
  getAppointments(clinicId?: string) {
    return this.#httpClient.get<Appointment[]>(`/api/appointments`, {
      params: clinicId ? { clinicId } : {},
    });
  }
}