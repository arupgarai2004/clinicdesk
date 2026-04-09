// Next.js API route example using shared types
import { NextApiRequest, NextApiResponse } from 'next';
import { Appointment, AppointmentFilters, AppointmentQuery } from '@org/models';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Appointment[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse query parameters using shared types
    const query: AppointmentQuery = {
      clinicId: req.query.clinicId as string,
      date: req.query.date as string,
      status: req.query.status as string, // Will be validated by your service
      search: req.query.search as string,
    };

    // Call your appointment service (example)
    // const appointments = await appointmentService.findAll(query.clinicId, query);

    // Mock response for demonstration
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        clinicId: query.clinicId || 'default',
        patientName: 'John Doe',
        patientEmail: 'john@example.com',
        reason: 'Checkup',
        startTime: new Date(),
        endTime: new Date(),
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    res.status(200).json(mockAppointments);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}