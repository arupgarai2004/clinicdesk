import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentStore, ClinicStore } from '@org/data-access';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit {

  readonly clinicStore = inject(ClinicStore);
  readonly appointmentStore = inject(AppointmentStore);
  readonly router = inject(Router);

  readonly clinicCount = computed(() => this.clinicStore.clinics().length);
  readonly appointmentCount = computed(() => this.appointmentStore.appointments().length);
  readonly workingHoursCount = computed(() => this.clinicStore.getWorkingHoursForClinic('cmo9ubxjo0000625jh5uuqvso').length);

  ngOnInit() {
    this.clinicStore.loadClinics();
    this.appointmentStore.loadAppointments();
    this.clinicStore.getWorkingHoursForClinic('cmo9ubxjo0000625jh5uuqvso');
  }

  addClinic = () => {
    // Implementation for adding a new clinic
  }

  manageClinic = () => {
    // Implementation for managing clinics
  }

  manageAppointments = () => {
    this.router.navigate(['/appointment-list']);
  }

  addAppointment = () => {
    this.router.navigate(['/manage-appointment']);
  }

  manageWorkingHours = () => {
    // Implementation for managing working hours  
  }

  addWorkingHours = () => {
    // Implementation for adding working hours
  }

}
