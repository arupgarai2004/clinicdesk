export interface AiAppointmentSuggestRequest {
  appointmentId: string;
  patientName:   string;
  reason:        string;
}

export interface AiAppointmentSuggestResponse {
  suggestedDuration: number;        // 15 | 30 | 45 | 60
  prepNotes:         string;
  confidence:        'low' | 'medium' | 'high';
}

export interface AiState {  
  suggestions: Record<string, AiAppointmentSuggestResponse>;
  activeAppointmentId: string | null;
  loading: boolean;
  error: string | null; 
}