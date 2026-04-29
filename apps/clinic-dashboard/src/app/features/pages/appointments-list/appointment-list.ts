import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppointmentStore } from '@org/data-access';
import { Appointment } from '@org/models';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink, ScrollingModule],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.scss',
})

export class AppointmentList implements OnInit {
  readonly appointmentStore = inject(AppointmentStore);

  readonly filters = {
    patientName: signal(''),
    clinicId: signal(''),
    reason: signal(''),
    date: signal(''),
    status: signal(''),
  };

  private readonly filterMatchers = {
    patientName: (appointment: Appointment, value: string) => appointment.patientName.toLowerCase().includes(value),
    clinicId: (appointment: Appointment, value: string) => appointment.clinicId.toLowerCase().includes(value),
    reason: (appointment: Appointment, value: string) => appointment.reason.toLowerCase().includes(value),
    date: (appointment: Appointment, value: string) => this.toDateInputValue(appointment.startTime) === value,
    status: (appointment: Appointment, value: string) => appointment.status.toLowerCase() === value,
  };

  readonly appointmentList = computed(() => {
    const filterValues = Object.fromEntries(
      Object.entries(this.filters).map(([key, signal]) => [
        key,
        key === 'date' ? signal() : signal().trim().toLowerCase()
      ])
    );

    return this.appointmentStore.appointments().filter((appointment) =>
      (Object.keys(filterValues) as Array<keyof typeof this.filterMatchers>).every((key) => {
        const value = filterValues[key];

        if (!value) {
          return true;
        }

        return this.filterMatchers[key](appointment, value);
      })
    );
  });

  readonly clinicOptions = computed(() => {
    const seen = new Map<string, string>();

    for (const appointment of this.appointmentStore.appointments()) {
      if (appointment.clinicId && appointment.clinic?.name) {
        seen.set(appointment.clinicId, appointment.clinic.name);
      }
    }

    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
  });

  readonly statusOption = computed(() => {
    const seen = new Set<string>();

    for (const appointment of this.appointmentStore.appointments()) {
      if (appointment.status) {
        seen.add(appointment.status);
      }
    }

    return Array.from(seen);
  });

  trackById = (_: number, item: Appointment) => item.id;

  getDurationMinutes(appointment: Appointment): number {
    const start = new Date(appointment.startTime).getTime();
    const end = new Date(appointment.endTime).getTime();

    return Math.max(0, Math.round((end - start) / 60000));
  }

  ngOnInit() {
    this.appointmentStore.loadAppointments();
  }

  resetFilters() {
    Object.values(this.filters).forEach(signal => signal.set(''));
  }

  private toDateInputValue(value: Date): string {
    return new Date(value).toISOString().slice(0, 10);
  }
}
