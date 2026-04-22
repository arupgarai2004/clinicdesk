import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AppointmentStore, AiStore } from '@org/data-access';
import { Appointment } from '@org/models';

@Component({
  selector: 'app-appointment-details',
  imports: [RouterLink, DatePipe],
  templateUrl: './appointment-details.html',
  styleUrl: './appointment-details.scss',
})
export class AppointmentDetails {
  private readonly route = inject(ActivatedRoute);
  readonly appointmentStore = inject(AppointmentStore);
  readonly aiStore = inject(AiStore);
  private lastSuggestedAppointmentId: string | null = null;

  readonly appointmentId = this.route.snapshot.paramMap.get('id');

  readonly appointment = computed<Appointment | null>(() => {
    return this.appointmentStore.selectedAppointment() ?? null;
  });

  constructor() {
    effect(() => {
      if (this.appointmentId) {
        this.appointmentStore.appointmentDetails(this.appointmentId);
      }
    });

    effect(() => {
      const appointment = this.appointment();

      if (!appointment || this.lastSuggestedAppointmentId === appointment.id) {
        return;
      }

      this.lastSuggestedAppointmentId = appointment.id;
      this.aiStore.loadSuggestion({
        appointmentId: appointment.id,
        patientName: appointment.patientName,
        reason: appointment.reason,
      });
    });
  }

  readonly durationMinutes = computed(() => {
  const appt = this.appointment();
  if (!appt?.startTime || !appt?.endTime) return 0;

  return Math.max(
    0,
    Math.round(
      (new Date(appt.endTime).getTime() - new Date(appt.startTime).getTime()) / 60000
    )
  );
});
}
