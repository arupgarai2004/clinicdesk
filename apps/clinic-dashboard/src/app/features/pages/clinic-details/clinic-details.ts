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
  readonly workingHours = computed(() =>
    [...(this.clinic()?.workingHours ?? [])].sort((a, b) => a.dayOfWeek - b.dayOfWeek)
  );


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
