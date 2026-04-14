import {signalStore, withState, withMethods, patchState} from '@ngrx/signals'
import { computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AppointmentsService } from '@org/api';
import { AppointmentState } from '@org/models';



export const AppointmentStore = signalStore(
  { providedIn: 'root' },

  // ✅ State
  withState<AppointmentState>({
    appointments: [],
    loading: false,
    error: null
  }),

  // ✅ Methods
  withMethods((store) => {
    const service = inject(AppointmentsService);

    const loadAppointments = async (clinicId?: string) => {
      patchState(store, { loading: true, error: null });

      try {
        const data = await firstValueFrom(
          service.getAppointments(clinicId)
        );

        patchState(store, {
          appointments: data,
          loading: false
        });
      } catch (err: any) {
        patchState(store, {
          error: err.message || 'Failed to load appointments',
          loading: false
        });
      }
    };

    return {
      loadAppointments
    };
  })
);


