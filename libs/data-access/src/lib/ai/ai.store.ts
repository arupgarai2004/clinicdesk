import { inject } from '@angular/core';
import { signalStore, withMethods, withState, patchState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import { AiService } from '@org/api';
import { AiAppointmentSuggestRequest, AiState } from '@org/models';

export const AiStore = signalStore(
  { providedIn: 'root' },

  withState<AiState>({
    suggestion: null,
    loading: false,
    error: null,
  }),

  withMethods((store) => {
    const aiService = inject(AiService);

    const loadSuggestion = async (request: AiAppointmentSuggestRequest) => {
      patchState(store, { loading: true, error: null });

      try {
        const response = await firstValueFrom(
          aiService.suggestAppointmentDetails(request)
        );

        patchState(store, {
          suggestion: response,
          loading: false,
          error: null,
        });
      } catch (error) {
        patchState(store, {
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to get suggestion',
        });
      }
    };

    const clearSuggestion = () => {
      patchState(store, {
        suggestion: null,
        error: null,
      });
    };

    return {
      loadSuggestion,
      clearSuggestion,
    };
  })
);
