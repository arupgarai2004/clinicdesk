import { inject } from '@angular/core';
import { signalStore, withMethods, withState, patchState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import { AiService } from '@org/api';
import { AiAppointmentSuggestRequest, AiState } from '@org/models';

export const AiStore = signalStore(
  { providedIn: 'root' },

  withState<AiState>({
    suggestions: {},
    activeAppointmentId: null,
    loading: false,
    error: null,
  }),

  withMethods((store) => {
    const aiService = inject(AiService);

    const loadSuggestion = async (request: AiAppointmentSuggestRequest) => {
      const cachedSuggestion = store.suggestions()[request.appointmentId];
      if (cachedSuggestion) {
        patchState(store, {
          activeAppointmentId: request.appointmentId,
          loading: false,
          error: null,
        });
        return;
      }

      patchState(store, {
        activeAppointmentId: request.appointmentId,
        loading: true,
        error: null,
      });

      try {
        const response = await firstValueFrom(
          aiService.suggestAppointmentDetails(request)
        );

        patchState(store, {
          suggestions: {
            ...store.suggestions(),
            [request.appointmentId]: response,
          },
          activeAppointmentId: request.appointmentId,
          loading: false,
          error: null,
        });
      } catch (error) {
        patchState(store, {
          activeAppointmentId: request.appointmentId,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to get suggestion',
        });
      }
    };

    const clearSuggestion = () => {
      patchState(store, {
        activeAppointmentId: null,
        error: null,
      });
    };

    return {
      loadSuggestion,
      clearSuggestion,
    };
  })
);
