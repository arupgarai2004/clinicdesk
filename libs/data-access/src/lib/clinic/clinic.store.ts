import { inject } from "@angular/core";
import { signalStore, withMethods, withState, patchState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";

import { ClinicService } from "@org/api";
import { ClinicCreateDto, ClinicState } from "@org/models";

export const ClinicStore = signalStore(
    { providedIn: 'root' },
    withState<ClinicState>({
        clinics: [],
        selectedClinic: null,
        loading: false,
        error: null
    }),
    withMethods((store) => {
        const clinicService = inject(ClinicService);

        const loadClinics = async () => {
            patchState(store, { loading: true, error: null });

            try {
                const data = await firstValueFrom(clinicService.getClinics());
                patchState(store, { clinics: data, loading: false });
            } catch (err: any) {
                patchState(store, { error: err.message || 'Failed to load clinics', loading: false });
            }
        }

        const loadClinicDetails = async (id: string) => {
            patchState(store, { loading: true, error: null });

            try {
                const data = await firstValueFrom(clinicService.getClinic(id));
                patchState(store, { selectedClinic: data, loading: false });
            } catch (err: any) {
                patchState(store, { error: err.message || 'Failed to load clinic details', loading: false });
            }
        }

        const createClinic = async (createClinicDto: ClinicCreateDto) => {
            patchState(store, { loading: true, error: null });

            try {
                await firstValueFrom(clinicService.createClinic(createClinicDto));
                await loadClinics();
            } catch (err: any) {
                patchState(store, { error: err.message || 'Failed to create clinic', loading: false });
            }
        }

        const updateClinic = async (id: string, updateClinicDto: ClinicCreateDto) => {
            patchState(store, { loading: true, error: null });

            try {
                await firstValueFrom(clinicService.updateClinic(id, updateClinicDto));
                await loadClinics();
                await loadClinicDetails(id);
            } catch (err: any) {
                patchState(store, { error: err.message || 'Failed to update clinic', loading: false });
            }
        }

        const deleteClinic = async (id: string) => {
            patchState(store, { loading: true, error: null });

            try {
                await firstValueFrom(clinicService.deleteClinic(id));
                await loadClinics();
                patchState(store, { selectedClinic: null, loading: false });
            } catch (err: any) {
                patchState(store, { error: err.message || 'Failed to delete clinic', loading: false });
            }
        }

        const getWorkingHoursForClinic = (clinicId: string) => {
            const clinic = store.clinics().find((c) => c.id === clinicId);
            return clinic ? clinic.workingHours : [];
        };

        return { loadClinics, loadClinicDetails, createClinic, updateClinic, deleteClinic, getWorkingHoursForClinic };
    })
);


