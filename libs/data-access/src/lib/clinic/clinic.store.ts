import { inject } from "@angular/core";
import { signalStore, withMethods, withState, patchState } from "@ngrx/signals";
import { firstValueFrom } from "rxjs";

import { ClinicService } from "@org/api";
import { ClinicState } from "@org/models";

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

        return { loadClinics, loadClinicDetails };
    })
);


