import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const clinic = await prisma.clinic.upsert({
    where:  { email: 'demo@clinicdesk.com' },
    update: {},
    create: {
      name:     'Demo Clinic Amsterdam',
      email:    'demo@clinicdesk.com',
      timezone: 'Europe/Amsterdam',
      workingHours: {
        mon: { start: '09:00', end: '17:00' },
        tue: { start: '09:00', end: '17:00' },
        wed: { start: '09:00', end: '17:00' },
        thu: { start: '09:00', end: '17:00' },
        fri: { start: '09:00', end: '15:00' },
        sat: null,
        sun: null,
      },
      availability: {
        create: [
          { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 5, startTime: '09:00', endTime: '15:00' },
        ],
      },
      appointments: {
        create: [
          { patientName: 'Priya Sharma',   patientEmail: 'priya@test.com',
            reason: 'Persistent headache for 3 days',
            startTime: new Date('2026-04-10T09:00:00Z'),
            endTime:   new Date('2026-04-10T09:30:00Z'),
            status: 'PENDING', cancelToken: 'tok_test_001' },
          { patientName: 'Jan de Vries',    patientEmail: 'jan@test.com',
            reason: 'Annual checkup',
            startTime: new Date('2026-04-10T10:00:00Z'),
            endTime:   new Date('2026-04-10T10:30:00Z'),
            status: 'CONFIRMED', cancelToken: 'tok_test_002' },
          { patientName: 'Maria Santos',   patientEmail: 'maria@test.com',
            reason: 'Back pain follow-up',
            startTime: new Date('2026-04-10T11:00:00Z'),
            endTime:   new Date('2026-04-10T11:30:00Z'),
            status: 'PENDING', cancelToken: 'tok_test_003' },
        ],
      },
    },
  });
  console.log(`Seeded clinic: ${clinic.name} (${clinic.id})`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());