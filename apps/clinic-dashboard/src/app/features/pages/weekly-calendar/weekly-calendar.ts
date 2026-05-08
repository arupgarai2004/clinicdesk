import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppointmentStore, ClinicStore } from '@org/data-access';
import { Appointment } from '@org/models';

type CalendarView = 'week' | 'month';

@Component({
  selector: 'app-weekly-calendar',
  standalone: true,
  imports: [FormsModule, DatePipe, RouterLink],
  templateUrl: './weekly-calendar.html',
  styleUrl: './weekly-calendar.scss',
})
export class WeeklyCalendar implements OnInit {
  readonly appointmentStore = inject(AppointmentStore);
  readonly clinicStore = inject(ClinicStore);

  readonly selectedClinicId = signal('');
  readonly selectedView = signal<CalendarView>('week');
  readonly today = signal(new Date());
  readonly hasClinicSelected = computed(() => !!this.selectedClinicId());

  readonly clinicOptions = computed(() => this.clinicStore.clinics());
  readonly appointments = computed(() => this.appointmentStore.appointments());
  readonly calendarDays = computed(() => {
    const today = this.today();
    return this.selectedView() === 'week'
      ? this.getWeekDays(today)
      : this.getMonthDays(today);
  });
  readonly periodLabel = computed(() => {
    const days = this.calendarDays();
    if (!days.length) {
      return '';
    }

    const start = days[0];
    const end = days[days.length - 1];
    return this.selectedView() === 'week'
      ? `${this.formatShortDate(start)} - ${this.formatShortDate(end)}`
      : start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });

  constructor() {
    effect(() => {
      const clinicId = this.selectedClinicId();
      if (!clinicId) {
        return;
      }

      this.appointmentStore.loadAppointments(clinicId);
    });
  }

  ngOnInit() {
    this.clinicStore.loadClinics();
  }

  setClinicId(clinicId: string) {
    this.selectedClinicId.set(clinicId);
  }

  setView(view: CalendarView) {
    this.selectedView.set(view);
  }

  previousPeriod() {
    this.today.update((current) => {
      const next = new Date(current);
      if (this.selectedView() === 'week') {
        next.setDate(next.getDate() - 7);
      } else {
        next.setMonth(next.getMonth() - 1);
      }
      return next;
    });
  }

  nextPeriod() {
    this.today.update((current) => {
      const next = new Date(current);
      if (this.selectedView() === 'week') {
        next.setDate(next.getDate() + 7);
      } else {
        next.setMonth(next.getMonth() + 1);
      }
      return next;
    });
  }

  appointmentsForDay(day: Date) {
    return this.appointments()
      .filter((appointment) => this.isSameDay(new Date(appointment.startTime), day))
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
  }

  trackAppointment(_: number, appointment: Appointment) {
    return appointment.id;
  }

  private getWeekDays(date: Date) {
    const start = new Date(date);
    const day = start.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diff);

    return Array.from({ length: 7 }, (_, index) => {
      const current = new Date(start);
      current.setDate(start.getDate() + index);
      return current;
    });
  }

  private getMonthDays(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: lastDay }, (_, index) => new Date(year, month, index + 1));
  }

  private isSameDay(left: Date, right: Date) {
    return (
      left.getFullYear() === right.getFullYear() &&
      left.getMonth() === right.getMonth() &&
      left.getDate() === right.getDate()
    );
  }

  private formatShortDate(date: Date) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
}
