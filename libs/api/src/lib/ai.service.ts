import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  AiAppointmentSuggestRequest,
  AiAppointmentSuggestResponse,
} from '@org/models';
import { APP_CONSTANTS } from '@org/constants';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  readonly #httpClient = inject(HttpClient);
  readonly AI_SUGGEST_APPOINTMENT_API_URL =
    APP_CONSTANTS.AI_SUGGEST_APPOINTMENT_API_URL;

  suggestAppointmentDetails(dto: AiAppointmentSuggestRequest) {
    return this.#httpClient.post<AiAppointmentSuggestResponse>(
      this.AI_SUGGEST_APPOINTMENT_API_URL+'suggestAppointmentDetails',
      dto
    );
  }
}
