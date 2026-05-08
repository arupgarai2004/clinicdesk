import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ClinicStore, AppointmentStore } from '@org/data-access';

@Component({
  selector: 'app-clinic-details',
  imports: [RouterLink, DatePipe],
  templateUrl: './clinic-details.html',
  styleUrl: './clinic-details.scss',
})
export class ClinicDetails {
  private readonly route = inject(ActivatedRoute);
  readonly clinicStore = inject(ClinicStore);
  readonly appointmentStore = inject(AppointmentStore);

  readonly clinicId = this.route.snapshot.paramMap.get('id');
  readonly clinic = computed(() => this.clinicStore.selectedClinic());
  readonly appointmentCount = computed(() => this.appointmentStore.appointments().length);

  workingHours = () => {
    const value = this.clinic()?.workingHours;
    if (!value || typeof value !== 'object') return [];

    const dayKeyToIndex: Record<string, number> = {
      sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
    };
    return Object.entries(value)
      .filter(([, hours]) => hours)
      .map(([day, hours]) => {
        const slot = hours as unknown as { start: string; end: string };
        return {
          dayOfWeek: dayKeyToIndex[day],
          startTime: slot.start,
          endTime: slot.end,
        };
      });
  }


  constructor() {
    effect(() => {
      if (this.clinicId) {
        this.clinicStore.loadClinicDetails(this.clinicId);
        this.appointmentStore.loadAppointments(this.clinicId);
      }

    });
  }

  getDayName(dayIndex: number) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex] ?? 'Unknown';
  }
}
