import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClinicStore } from '@org/data-access';
import { ClinicCreateDto, workingHours } from '@org/models';

interface ManageClinicForm {
  name: string;
  email: string;
  phoneNumber: string;
  timezone: string;
  address: string;
}

@Component({
  selector: 'app-manage-clinic',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './manage-clinic.html',
  styleUrl: './manage-clinic.scss',
})
export class ManageClinic {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly clinicStore = inject(ClinicStore);

  readonly clinicId = this.route.snapshot.paramMap.get('id');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly submitted = signal(false);
  readonly form = signal<ManageClinicForm>({
    name: '',
    email: '',
    phoneNumber: '',
    timezone: 'Europe/Amsterdam',
    address: '',
  });

  readonly clinic = computed(() => this.clinicStore.selectedClinic());
  readonly isEditMode = computed(() => !!this.clinicId);
  readonly headerTitle = computed(() => this.isEditMode() ? 'Update clinic' : 'Create new clinic');
  readonly helperText = computed(() =>
    this.isEditMode()
      ? 'Update clinic master details and working hours.'
      : 'Fill the form below to create a new clinic.'
  );
  readonly validationErrors = computed(() => {
    const current = this.form();

    return {
      name: current.name.trim() ? '' : 'Clinic name is required.',
      email: this.getEmailValidationMessage(current.email),
      phoneNumber: this.getPhoneValidationMessage(current.phoneNumber),
      timezone: current.timezone.trim() ? '' : 'Timezone is required.',
      address: current.address.trim() ? '' : 'Address is required.',
    };
  });
  readonly canSubmit = computed(() => {
    const errors = this.validationErrors();
    return !errors.name && !errors.email && !errors.phoneNumber && !errors.timezone && !errors.address;
  });

  constructor() {
    effect(() => {
      const clinic = this.clinic();
      if (!clinic || !this.isEditMode()) {
        return;
      }

      this.form.set({
        name: clinic.name ?? '',
        email: clinic.email ?? '',
        phoneNumber: clinic.phoneNumber ?? '',
        timezone: clinic.timezone ?? 'Europe/Amsterdam',
        address: clinic.address ?? '',
      });
    });
  }

  ngOnInit() {
    if (this.clinicId) {
      this.clinicStore.loadClinicDetails(this.clinicId);
    }
  }

  setField<K extends keyof ManageClinicForm>(key: K, value: ManageClinicForm[K]) {
    this.form.update((current) => ({ ...current, [key]: value }));
    this.error.set(null);
    this.success.set(null);
  }

  async submitForm() {
    this.submitted.set(true);
    this.error.set(null);
    this.success.set(null);

    if (!this.canSubmit()) {
      this.error.set('Please complete the form and fix the validation errors.');
      return;
    }

    this.loading.set(true);

    try {
      const payload = this.toClinicDto();

      if (this.isEditMode() && this.clinicId) {
        await this.clinicStore.updateClinic(this.clinicId, payload);
      } else {
        await this.clinicStore.createClinic(payload);
      }

      const storeError = this.clinicStore.error();
      if (storeError) {
        throw new Error(storeError);
      }

      const successMessage = this.isEditMode()
        ? 'Clinic updated successfully.'
        : 'Clinic created successfully.';

      this.success.set(successMessage);
      await this.router.navigate(['/clinic-list'], {
        state: { successMessage },
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

  fieldError(field: keyof ManageClinicForm) {
    if (!this.submitted()) {
      return '';
    }

    return this.validationErrors()[field];
  }

  private getEmailValidationMessage(email: string) {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      return 'Clinic email is required.';
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
      ? ''
      : 'Enter a valid email address.';
  }

  private getPhoneValidationMessage(phoneNumber: string) {
    const trimmedPhoneNumber = phoneNumber.trim();
    if (!trimmedPhoneNumber) {
      return 'Phone number is required.';
    }

    return /^[+()\-.\s\d]{7,20}$/.test(trimmedPhoneNumber)
      ? ''
      : 'Enter a valid phone number.';
  }

  private getWorkingHours(): workingHours[] {
    const existingWorkingHours = this.clinic()?.workingHours;
    if (existingWorkingHours?.length) {
      return existingWorkingHours;
    }

    return [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
    ];
  }

  private toClinicDto(): ClinicCreateDto {
    const current = this.form();

    return {
      name: current.name.trim(),
      email: current.email.trim(),
      phoneNumber: current.phoneNumber.trim(),
      timezone: current.timezone.trim(),
      address: current.address.trim(),
      workingHours: this.getWorkingHours(),
    };
  }
}
