import {signalStore, withState, withMethods, patchState} from '@ngrx/signals'
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AppointmentsService } from '@org/api';
import { AppointmentState } from '@org/models';



export const AppointmentStore = signalStore(
  { providedIn: 'root' },

  
  withState<AppointmentState>({
    appointments: [],
    selectedAppointment: null,
    loading: false,
    error: null
  }),

  
  withMethods((store) => {
    const appionmentService = inject(AppointmentsService);

    const loadAppointments = async (clinicId?: string) => {
      patchState(store, { loading: true, error: null });

      try {
        const data = await firstValueFrom(
          appionmentService.getAppointments(clinicId)
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
    const appointmentDetails= async (id?: string) => {
      if (!id) {
        patchState(store, { error: 'Appointment ID is required', loading: false });
        return;
      }
      patchState(store, { loading: true, error: null });
      try{
        const data = await firstValueFrom(
          appionmentService.getAppointment(id)
        );

        patchState(store, {
          selectedAppointment: data,
          loading: false
        });
      }catch (err: any) {
        patchState(store, {
          error: err.message || 'Failed to load appointments',
          loading: false
        });
      }

    };

    return {
      loadAppointments,
      appointmentDetails
    };
  })
);

