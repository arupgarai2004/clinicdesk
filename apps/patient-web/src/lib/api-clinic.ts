import { Clinic } from '@org/models';

function clinicsUrl(id?: string) {
  const path = id ? `/clinics/${id}` : '/clinics';

  if (typeof window === 'undefined') {
    const origin = (process.env.API_BASE_URL ?? 'http://localhost:3333').replace(
      /\/$/,
      '',
    );
    return `${origin}${path}`;
  }

  return `/api${path}`;
}

export const getClinics = async (): Promise<Clinic[]> => {
  const response = await fetch(clinicsUrl(), { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Error fetching clinic: ${response.statusText}`);
  }
  return response.json();
};

export const getClinicById = async (id: string): Promise<Clinic> => {
  const response = await fetch(clinicsUrl(id), { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Error fetching clinic by ID: ${response.statusText}`);
  }
  return response.json();
};