import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ClinicStore } from '@org/data-access';

@Component({
  selector: 'app-clinic-list',
  imports: [ RouterLink],
  templateUrl: './clinic-list.html',
  styleUrl: './clinic-list.scss',
  standalone: true,
})
export class ClinicList {
  readonly clinicStore = inject(ClinicStore);
  readonly router = inject(Router);
  readonly successMessage = signal<string | null>(null);

  readonly clinics = computed(() => this.clinicStore.clinics());

  ngOnInit() {
    this.clinicStore.loadClinics();

    const navigationState = this.router.getCurrentNavigation()?.extras.state?.['successMessage'];
    const historyState =
      typeof window !== 'undefined' ? window.history.state?.successMessage : null;
    const successMessage = navigationState ?? historyState ?? null;

    if (typeof successMessage === 'string' && successMessage.trim()) {
      this.successMessage.set(successMessage);

      if (typeof window !== 'undefined') {
        const nextHistoryState = { ...window.history.state };
        delete nextHistoryState.successMessage;
        window.history.replaceState(nextHistoryState, '');
      }
    }
  }
  constructor() { }
}
