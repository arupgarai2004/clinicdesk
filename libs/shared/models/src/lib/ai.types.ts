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
  suggestion: AiAppointmentSuggestResponse | null;
  loading: boolean;
  error: string | null; 
}