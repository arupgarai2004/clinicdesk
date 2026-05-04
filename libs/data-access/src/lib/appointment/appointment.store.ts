import { signalStore, withState, withMethods, patchState } from '@ngrx/signals'
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { AppointmentsService } from '@org/api';
import { AppointmentState, UpdateAppointmentDto, CreateAppointmentDto, AppStatus } from '@org/models';



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
      } catch (err) {
        const error =
          err instanceof HttpErrorResponse
            ? err
            : new HttpErrorResponse({
              error: err,
              statusText: 'Unknown Error',
            });
        patchState(store, {
          error: error.message || 'Failed to load appointments',
          loading: false
        });
      }
    };
    const appointmentDetails = async (id?: string) => {
      if (!id) {
        patchState(store, { error: 'Appointment ID is required', loading: false });
        return;
      }
      patchState(store, { loading: true, error: null });
      try {
        const data = await firstValueFrom(
          appionmentService.getAppointment(id)
        );

        patchState(store, {
          selectedAppointment: data,
          loading: false
        });
      } catch (err) {
        const error =
          err instanceof HttpErrorResponse
            ? err
            : new HttpErrorResponse({
              error: err,
              statusText: 'Unknown Error',
            });
        patchState(store, {
          error: error.message || 'Failed to load appointments',
          loading: false
        });
      }

    };
    const updateStatus = async (id: string, status: AppStatus) => {
      patchState(store, { loading: true, error: null });
      try {
        await firstValueFrom(
          appionmentService.updateStatus(id, status)
        );

        await loadAppointments();
        const selected = store.selectedAppointment();
        if (selected?.id === id) {
          patchState(store, {
            selectedAppointment: { ...selected, status },
            loading: false,
          });
        }
      } catch (err) {
        const error =
          err instanceof HttpErrorResponse
            ? err
            : new HttpErrorResponse({
              error: err,
              statusText: 'Unknown Error',
            });
        patchState(store, {
          error: error.message || 'Failed to update appointment status',
          loading: false
        });
      }
    };

    const deleteAppointment = async (id: string) => {
      patchState(store, { loading: true, error: null });
      try {
        await firstValueFrom(
          appionmentService.deleteAppointment(id)
        );
        await loadAppointments();
      } catch (err) {
        const error =
          err instanceof HttpErrorResponse
            ? err
            : new HttpErrorResponse({
              error: err,
              statusText: 'Unknown Error',
            });
        patchState(store, {
          error: error.message || 'Failed to delete appointment',
          loading: false
        });
      }
    };

    const createAppointment = async (dto: CreateAppointmentDto) => {
      patchState(store, { loading: true, error: null });

      try {
        await firstValueFrom(appionmentService.createAppointment(dto));
        await loadAppointments();
      } catch (err) {
        const error =
          err instanceof HttpErrorResponse
            ? err
            : new HttpErrorResponse({
              error: err,
              statusText: 'Unknown Error',
            });

        patchState(store, {
          error: error.message || 'Failed to create appointment',
          loading: false,
        });

        throw error;
      }
    };

    const updateAppointment = async (id: string, updateAppointmentDto: UpdateAppointmentDto) => {
      patchState(store, { loading: true, error: null });
      try {
        await firstValueFrom(
          appionmentService.updateAppointment(id, updateAppointmentDto)
        );
        await loadAppointments();
      } catch (err) {
        const error =
          err instanceof HttpErrorResponse
            ? err
            : new HttpErrorResponse({
              error: err,
              statusText: 'Unknown Error',
            });
        patchState(store, {
          error: error.message || 'Failed to update appointment',
          loading: false
        });
      }
    };

    return {
      loadAppointments,
      appointmentDetails,
      updateStatus,
      deleteAppointment,
      createAppointment,
      updateAppointment
    };
  })
);

