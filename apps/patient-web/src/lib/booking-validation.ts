export type BookingFormValues = {
  clinicId: string;
  name: string;
  email: string;
  date: string;
  time: string;
  reason: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLOT_MS = 30 * 60 * 1000;

export function validateBooking(values: BookingFormValues): string | null {
  if (!values.clinicId.trim()) return 'Clinic is required.';
  if (!values.name.trim()) return 'Name is required.';
  if (!EMAIL_PATTERN.test(values.email.trim())) return 'Enter a valid email.';
  if (!values.date) return 'Date is required.';
  if (!values.time) return 'Time is required.';
  if (!values.reason.trim()) return 'Reason is required.';

  const startTime = new Date(`${values.date}T${values.time}`);
  if (Number.isNaN(startTime.getTime())) return 'Enter a valid date and time.';
  if (startTime < new Date()) return 'Cannot book an appointment in the past.';

  return null;
}

export function toAppointmentPayload(values: BookingFormValues) {
  const startTime = new Date(`${values.date}T${values.time}`);
  return {
    clinicId: values.clinicId.trim(),
    patientName: values.name.trim(),
    patientEmail: values.email.trim(),
    reason: values.reason.trim(),
    startTime: startTime.toISOString(),
    endTime: new Date(startTime.getTime() + SLOT_MS).toISOString(),
    status: 'PENDING' as const,
  };
}
