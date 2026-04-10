import { Component, inject, OnInit } from '@angular/core';
import { AppointmentStore } from '@org/data-access';
import { computed } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [ScrollingModule],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.scss',
})

export class AppointmentList implements OnInit {
  appointmentStore = inject(AppointmentStore);

  appointmentList = computed(() => this.appointmentStore.appointments());
  trackById = (_: number, item: any) => item.id;
  ngOnInit() {
    this.appointmentStore.loadAppointments();
  }
}
