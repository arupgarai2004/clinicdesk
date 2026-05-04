import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AppointmentStore, AiStore } from '@org/data-access';
import { Appointment, AppStatus } from '@org/models';
import { App } from '../../../app';

@Component({
  selector: 'app-appointment-details',
  imports: [RouterLink, DatePipe],
  templateUrl: './appointment-details.html',
  styleUrl: './appointment-details.scss',
})
export class AppointmentDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly appointmentStore = inject(AppointmentStore);
  readonly aiStore = inject(AiStore);

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
  }

  readonly aiSuggestion = computed(() => {
    const appointmentId = this.appointmentId;
    if (!appointmentId) {
      return null;
    }

    return this.aiStore.suggestions()[appointmentId] ?? null;
  });

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

  loadAiSuggestion() {
    const appointment = this.appointment();

    if (!appointment || this.aiStore.loading()) {
      return;
    }

    this.aiStore.loadSuggestion({
      appointmentId: appointment.id,
      patientName: appointment.patientName,
      reason: appointment.reason,
    });
  }

  deleteAppointment() {
    const appointmentId = this.appointmentId;
    if (!appointmentId) return;

    if (confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      this.appointmentStore.deleteAppointment(appointmentId);
    }
  }

  updateStatus(newStatus: AppStatus) {
    const appointmentId = this.appointmentId;
    if (!appointmentId) return;

    if (confirm(`Are you sure you want to ${newStatus.toLowerCase()} this appointment?`)) {
      this.appointmentStore.updateStatus(appointmentId, newStatus);
    }
  }

  editAppointment() {
    if (this.appointmentId) {
      this.router.navigate(['/manage-appointment', this.appointmentId]);
    }
  }
}
