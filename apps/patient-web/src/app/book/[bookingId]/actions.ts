'use server';

import { redirect } from 'next/navigation';
import { addAppointment } from '../../../lib/api-appointment';
import { sendConfirmationEmail } from '../../../lib/send-email';
import { toAppointmentPayload, validateBooking } from '../../../lib/booking-validation';

export type BookAppointmentState = { error?: string } | null;

export async function bookAppointment(
  _prev: BookAppointmentState,
  formData: FormData
): Promise<BookAppointmentState> {
  const values = {
    clinicId: String(formData.get('clinicId') ?? ''),
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    date: String(formData.get('date') ?? ''),
    time: String(formData.get('time') ?? ''),
    reason: String(formData.get('reason') ?? ''),
  };
  const clinicName = String(formData.get('clinicName') ?? '');

  const error = validateBooking(values);
  if (error) return { error };

  let appointment;
  try {
    appointment = await addAppointment(toAppointmentPayload(values));
    await sendConfirmationEmail({
      to: appointment.patientEmail,
      patientName: appointment.patientName,
      clinicName,
      startTime: String(appointment.startTime),
    });
  } catch {
    return { error: 'Could not book the appointment. Please try again.' };
  }

  redirect(`/confirmation?id=${appointment.id}`);
}
