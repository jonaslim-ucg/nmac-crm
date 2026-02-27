export interface CreateCallPayload {
  patient_id: string;
  appointment_id?: number | null;
  outcome?: string;
  call_duration?: string | null;
  contact_method?: string;
  patient_response?: boolean;
  interest_level?: string | null;
  concern?: string | null;
  note?: string | null;
}
