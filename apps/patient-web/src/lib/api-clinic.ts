import { Clinic } from "@org/models";


  const CLINIC_BASE_API_URL =
  process.env.API_BASE_URL ?? 'http://localhost:3333/clinics';


export const getClinic = async (clinicId: string): Promise<Clinic> => {   
      const response = await fetch(`${CLINIC_BASE_API_URL}/${clinicId}`, {
    next: { revalidate: 60 },
  });

    if (!response.ok) {
        throw new Error(`Error fetching clinic: ${response.statusText}`);
    }
    return response.json();
};