import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppointmentStore } from '@org/data-access';
import { Appointment } from '@org/models';
import { computed } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [DatePipe, RouterLink, ScrollingModule],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.scss',
})

export class AppointmentList implements OnInit {
  appointmentStore = inject(AppointmentStore);

  appointmentList = computed(() => this.appointmentStore.appointments());
  trackById = (_: number, item: Appointment) => item.id;

  getDurationMinutes(appointment: Appointment): number {
    const start = new Date(appointment.startTime).getTime();
    const end = new Date(appointment.endTime).getTime();

    return Math.max(0, Math.round((end - start) / 60000));
  }

  ngOnInit() {
    this.appointmentStore.loadAppointments();
  }
}
