import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const clinic = await prisma.clinic.upsert({
    where:  { email: 'demo@clinicdesk.com' },
    update: {
      timezone: 'Europe/Amsterdam',
      workingHours: {
        set: {
          mon: { start: '09:00', end: '17:00' },
          tue: { start: '09:00', end: '17:00' },
          wed: { start: '09:00', end: '17:00' },
          thu: { start: '09:00', end: '17:00' },
          fri: { start: '09:00', end: '15:00' },
          sat: null,
          sun: null,
        },
      },
    },
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
    },
  });

  const appointments = Array.from({ length: 100 }, (_, i) => {
    const baseDate = new Date('2026-04-10T09:00:00Z');
    const slotMs = 30 * 60 * 1000;
    const startTime = new Date(baseDate.getTime() + i * slotMs);
    const endTime = new Date(startTime.getTime() + slotMs);

    const names = [
      'Priya Sharma', 'Jan de Vries', 'Maria Santos', 'Aiden Chen',
      'Sophia Patel', 'Luca Russo', 'Mia Hernandez', 'Noah Johnson',
      'Emma Brown', 'Oliver Lee', 'Ava Wang', 'Elijah Taylor',
      'Isabella Miller', 'Lucas Davis', 'Amelia Wilson', 'Ethan Moore',
      'Harper Martin', 'Mason Clark', 'Charlotte Lewis', 'Logan White',
    ];

    const reasons = [
      'Routine checkup', 'Follow-up', 'Back pain', 'Headache',
      'Cold/flu symptoms', 'Blood pressure review', 'Diet consultation',
      'Medication refill', 'Skin rash', 'Allergy review',
    ];

    const statuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    const name = names[i % names.length];
    const emailName = name.toLowerCase().replace(/\s+/g, '.');

    return {
      clinicId: clinic.id,
      patientName: name,
      patientEmail: `${emailName}${i + 1}@test.com`,
      reason: reasons[i % reasons.length],
      startTime,
      endTime,
      status: statuses[i % statuses.length],
      cancelToken: `tok_test_${String(i + 1).padStart(3, '0')}`,
    };
  });

  await prisma.appointment.createMany({
    data: appointments,
    skipDuplicates: true,
  });
  console.log(`Seeded clinic: ${clinic.name} (${clinic.id})`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());