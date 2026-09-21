import { Appointment, CreateAppointmentDto } from '@org/models';

const APPOINTMENT_BASE_API_URL =
  process.env.APPOINTMENT_API_URL ?? 'http://localhost:3333/appointments';

export async function addAppointment(dto: CreateAppointmentDto): Promise<Appointment> {
  const response = await fetch(APPOINTMENT_BASE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Error creating appointment: ${response.statusText}`);
  }

  return response.json();
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  const response = await fetch(`${APPOINTMENT_BASE_API_URL}/${id}`, { cache: 'no-store' });
  if (!response.ok) return null;
  return response.json();
}
