import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Clinic, ClinicCreateDto, ClinicUpdateDto } from "@org/models";

@Injectable({
  providedIn: 'root'
})
export class ClinicService {
  readonly #httpClient = inject(HttpClient);
  readonly CLINIC_BASE_API_URL = '/api/clinics';

  getClinics() {
    return this.#httpClient.get<Clinic[]>(this.CLINIC_BASE_API_URL);
  }

  getClinic(id: string) {
    return this.#httpClient.get<Clinic>(`${this.CLINIC_BASE_API_URL}/${id}`);
  }

  createClinic(dto: ClinicCreateDto) {
    return this.#httpClient.post<Clinic>(this.CLINIC_BASE_API_URL, dto);
  }

  updateClinic(id: string, dto: ClinicUpdateDto) {
    return this.#httpClient.put<Clinic>(`${this.CLINIC_BASE_API_URL}/${id}`, dto);
  }

  deleteClinic(id: string) {
    return this.#httpClient.delete(`${this.CLINIC_BASE_API_URL}/${id}`);
  }
}