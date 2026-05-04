import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStatus, CreateAppointmentDto, UpdateAppointmentDto } from '@org/models';
import { AppointmentStore, ClinicStore } from '@org/data-access';
import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

// Custom date range validator
export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startTime = control.get('startTime')?.value;
    const endTime = control.get('endTime')?.value;

    if (!startTime || !endTime) {
      return null; 
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return { dateRange: { message: 'End time must be after start time' } };
    }

    // Check if appointment is not in the past (optional)
    const now = new Date();
    if (start < now) {
      return { pastDate: { message: 'Cannot schedule appointments in the past' } };
    }

    // Check reasonable duration (not too long)
    const durationMs = end.getTime() - start.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);

    if (durationHours > 8) {
      return { duration: { message: 'Appointment cannot be longer than 8 hours' } };
    }

    if (durationHours < 0.25) { // 15 minutes
      return { duration: { message: 'Appointment must be at least 15 minutes long' } };
    }

    return null;
  };
}

interface ManageAppointmentForm {
  clinicId: string;
  patientName: string;
  patientEmail: string;
  reason: string;
  startTime: string;
  endTime: string;
  status: AppStatus;
}

@Component({
  selector: 'app-manage-appointment',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './manageAppointment.html',
  styleUrl: './manageAppointment.scss',
})
export class ManageAppointment implements OnInit {
  private readonly AppointmentStore = inject(AppointmentStore);
  private readonly ClinicStore = inject(ClinicStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly appointmentId = signal<string | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);

  readonly form = signal<ManageAppointmentForm>({
    clinicId: '',
    patientName: '',
    patientEmail: '',
    reason: '',
    startTime: '',
    endTime: '',
    status: 'PENDING',
  });

  readonly statusOptions = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] as AppStatus[];

  readonly isEditMode = computed(() => {
    const id = this.appointmentId();
    return !!id && id !== 'new';
  });

  readonly headerTitle = computed(() =>
    this.isEditMode() ? 'Update appointment' : 'Create new appointment'
  );

  readonly canSubmit = computed(() => {
    const current = this.form();
    const requiredFields =
      current.clinicId.trim() &&
      current.patientName.trim() &&
      current.patientEmail.trim() &&
      current.reason.trim() &&
      current.startTime &&
      current.endTime;

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(current.patientEmail);

    // Enhanced date validation
    const datesValid = this.validateDates(current.startTime, current.endTime);

    return Boolean(requiredFields && emailValid && datesValid);
  });

  readonly dateValidationMessage = computed(() => {
    const current = this.form();
    return this.getDateValidationMessage(current.startTime, current.endTime);
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.appointmentId.set(id);
      if (id !== 'new') {
        this.loadAppointment(id);
      }
    }

    // Load clinics for the dropdown
    this.ClinicStore.loadClinics();
  }

  setField<K extends keyof ManageAppointmentForm>(key: K, value: ManageAppointmentForm[K]) {
    this.form.update((current) => ({ ...current, [key]: value }));
    this.success.set(null);
  }

  resetForm() {
    this.form.set({
      clinicId: '',
      patientName: '',
      patientEmail: '',
      reason: '',
      startTime: '',
      endTime: '',
      status: 'PENDING',
    });
    this.error.set(null);
    this.success.set(null);
  }

  async submitForm() {
    if (!this.canSubmit()) {
      this.error.set('Please complete the form and fix the validation errors.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    try {
      if (this.isEditMode()) {
        const id = this.appointmentId();
        await this.AppointmentStore.updateAppointment(
          id!,
          this.toUpdateDto()
        );
        this.success.set('Appointment updated successfully.');
      } else {
        await this.AppointmentStore.createAppointment(this.toCreateDto());
        this.success.set('Appointment created successfully.');
        this.resetForm();
      }
    } catch (err) {
      const error =
        err instanceof HttpErrorResponse
          ? err
          : new HttpErrorResponse({
            error: err,
            statusText: 'Unknown Error',
          });
      this.error.set(error.message);
    } finally {
      this.loading.set(false);
    }
  }

  private async loadAppointment(id: string) {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    try {
      await this.AppointmentStore.appointmentDetails(id);
      const appointment = this.AppointmentStore.selectedAppointment();

      if (!appointment) {
        throw new Error('Failed to load appointment');
      }

      this.form.set({
        clinicId: appointment.clinicId,
        patientName: appointment.patientName,
        patientEmail: appointment.patientEmail,
        reason: appointment.reason,
        startTime: this.toLocalDateTime(appointment.startTime),
        endTime: this.toLocalDateTime(appointment.endTime),
        status: appointment.status,
      });
    } catch (err) {
      const error =
        err instanceof HttpErrorResponse
          ? err
          : new HttpErrorResponse({
            error: err,
            statusText: 'Unknown Error',
          });
      this.error.set(error.message);
    } finally {
      this.loading.set(false);
    }
  }



  private validateDates(startTime: string, endTime: string): boolean {
    if (!startTime || !endTime) {
      return false;
    }

    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const now = new Date();

      // Basic validations
      if (start >= end) return false;
      if (start < now) return false; // No past appointments

      // Duration checks
      const durationMs = end.getTime() - start.getTime();
      const durationHours = durationMs / (1000 * 60 * 60);

      if (durationHours > 8 || durationHours < 0.25) return false;

      return true;
    } catch {
      return false;
    }
  }

  private getDateValidationMessage(startTime: string, endTime: string): string {
    if (!startTime || !endTime) {
      return '';
    }

    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const now = new Date();

      if (start >= end) {
        return 'End time must be after start time.';
      }

      if (start < now) {
        return 'Cannot schedule appointments in the past.';
      }

      const durationMs = end.getTime() - start.getTime();
      const durationHours = durationMs / (1000 * 60 * 60);

      if (durationHours > 8) {
        return 'Appointment cannot be longer than 8 hours.';
      }

      if (durationHours < 0.25) {
        return 'Appointment must be at least 15 minutes long.';
      }

      return '';
    } catch {
      return 'Invalid date format.';
    }
  }

  getMinDateTime(): string {
    return formatDate(new Date(), "yyyy-MM-dd'T'HH:mm", 'en-US');
  }

  private toLocalDateTime(value: Date | string): string {
    return formatDate(value, "yyyy-MM-dd'T'HH:mm", 'en-US');
  }

  private toCreateDto(): CreateAppointmentDto {
    const current = this.form();
    return {
      clinicId: current.clinicId.trim(),
      patientName: current.patientName.trim(),
      patientEmail: current.patientEmail.trim(),
      reason: current.reason.trim(),
      startTime: current.startTime,
      endTime: current.endTime,
      status: current.status,
    };
  }

  private toUpdateDto(): UpdateAppointmentDto {
    const current = this.form();
    return {
      clinicId: current.clinicId.trim(),
      patientName: current.patientName.trim(),
      patientEmail: current.patientEmail.trim(),
      reason: current.reason.trim(),
      startTime: current.startTime,
      endTime: current.endTime,
      status: current.status,
    };
  }
  clinicOptions = computed(() => this.ClinicStore.clinics());

}

