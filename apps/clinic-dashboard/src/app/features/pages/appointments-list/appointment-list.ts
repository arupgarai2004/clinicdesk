import { Component, inject, OnInit } from '@angular/core';
import { AppointmentStore } from '@org/data-access';
import { computed } from '@angular/core';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.scss',
})

export class AppointmentList implements OnInit {
  appointmentStore = inject(AppointmentStore);

  appointmentList = computed(() => this.appointmentStore.appointments());
  ngOnInit() {
    this.appointmentStore.loadAppointments();
  }
}
