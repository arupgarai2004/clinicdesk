import 'dotenv/config';
import { PrismaClient, AppStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const APPOINTMENTS_PER_CLINIC = 1000;
const TOTAL_CLINICS = 10;
const SLOT_MS = 30 * 60 * 1000;
const INSERT_CHUNK_SIZE = 1000;

const workingHours = {
  mon: { start: '09:00', end: '17:00' },
  tue: { start: '09:00', end: '17:00' },
  wed: { start: '09:00', end: '17:00' },
  thu: { start: '09:00', end: '17:00' },
  fri: { start: '09:00', end: '15:00' },
  sat: null,
  sun: null,
};

const availabilityTemplate = [
  { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 5, startTime: '09:00', endTime: '15:00' },
];

const clinicSeeds = [
  {
    name: 'ClinicDesk Amsterdam Central',
    address: '101 Main Street, Amsterdam',
    email: 'amsterdam.central@clinicdesk.com',
    phoneNumber: '+31 20 100 0001',
  },
  {
    name: 'ClinicDesk Rotterdam West',
    address: '22 River Road, Rotterdam',
    email: 'rotterdam.west@clinicdesk.com',
    phoneNumber: '+31 10 100 0002',
  },
  {
    name: 'ClinicDesk Utrecht Care',
    address: '14 Canal Avenue, Utrecht',
    email: 'utrecht.care@clinicdesk.com',
    phoneNumber: '+31 30 100 0003',
  },
  {
    name: 'ClinicDesk Eindhoven Health',
    address: '88 Innovation Lane, Eindhoven',
    email: 'eindhoven.health@clinicdesk.com',
    phoneNumber: '+31 40 100 0004',
  },
  {
    name: 'ClinicDesk Groningen North',
    address: '9 Harbor Street, Groningen',
    email: 'groningen.north@clinicdesk.com',
    phoneNumber: '+31 50 100 0005',
  },
  {
    name: 'ClinicDesk The Hague Family',
    address: '67 Embassy Boulevard, The Hague',
    email: 'thehague.family@clinicdesk.com',
    phoneNumber: '+31 70 100 0006',
  },
  {
    name: 'ClinicDesk Haarlem Plus',
    address: '31 Tulip Square, Haarlem',
    email: 'haarlem.plus@clinicdesk.com',
    phoneNumber: '+31 23 100 0007',
  },
  {
    name: 'ClinicDesk Breda CarePoint',
    address: '56 Market Road, Breda',
    email: 'breda.carepoint@clinicdesk.com',
    phoneNumber: '+31 76 100 0008',
  },
  {
    name: 'ClinicDesk Maastricht South',
    address: '12 Riverbank Drive, Maastricht',
    email: 'maastricht.south@clinicdesk.com',
    phoneNumber: '+31 43 100 0009',
  },
  {
    name: 'ClinicDesk Leiden City',
    address: '45 University Street, Leiden',
    email: 'leiden.city@clinicdesk.com',
    phoneNumber: '+31 71 100 0010',
  },
].slice(0, TOTAL_CLINICS);

const patientNames = [
  'Priya Sharma', 'Jan de Vries', 'Maria Santos', 'Aiden Chen', 'Sophia Patel',
  'Luca Russo', 'Mia Hernandez', 'Noah Johnson', 'Emma Brown', 'Oliver Lee',
  'Ava Wang', 'Elijah Taylor', 'Isabella Miller', 'Lucas Davis', 'Amelia Wilson',
  'Ethan Moore', 'Harper Martin', 'Mason Clark', 'Charlotte Lewis', 'Logan White',
  'Ella Baker', 'James Walker', 'Fatima Khan', 'Daniel Young', 'Grace Allen',
  'Benjamin Hall', 'Nora King', 'Samuel Scott', 'Lily Green', 'David Adams',
];

const reasons = [
  'Routine checkup',
  'Follow-up consultation',
  'Back pain',
  'Headache review',
  'Cold and flu symptoms',
  'Blood pressure review',
  'Diet consultation',
  'Medication refill',
  'Skin rash',
  'Allergy review',
  'Pediatric checkup',
  'Vaccination appointment',
];

const statuses: AppStatus[] = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

function buildAppointments(clinicId: string, clinicIndex: number) {
  return Array.from({ length: APPOINTMENTS_PER_CLINIC }, (_, appointmentIndex) => {
    const baseDate = new Date('2026-01-01T08:00:00Z');
    const clinicOffset = clinicIndex * APPOINTMENTS_PER_CLINIC * SLOT_MS;
    const startTime = new Date(baseDate.getTime() + clinicOffset + appointmentIndex * SLOT_MS);
    const endTime = new Date(startTime.getTime() + SLOT_MS);

    const patientName = patientNames[(clinicIndex * 7 + appointmentIndex) % patientNames.length];
    const reason = reasons[(clinicIndex * 5 + appointmentIndex) % reasons.length];
    const status = statuses[(clinicIndex + appointmentIndex) % statuses.length];
    const emailName = patientName.toLowerCase().replace(/\s+/g, '.');

    return {
      clinicId,
      patientName,
      patientEmail: `${emailName}.${clinicIndex + 1}.${appointmentIndex + 1}@test.com`,
      reason,
      startTime,
      endTime,
      status,
      cancelToken: `tok_clinic_${clinicIndex + 1}_${String(appointmentIndex + 1).padStart(4, '0')}`,
    };
  });
}

async function insertInChunks<T>(rows: T[]) {
  for (let i = 0; i < rows.length; i += INSERT_CHUNK_SIZE) {
    const chunk = rows.slice(i, i + INSERT_CHUNK_SIZE);
    await prisma.appointment.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }
}

async function main() {
  const seededClinics = [];

  for (const clinicInput of clinicSeeds) {
    const clinic = await prisma.clinic.upsert({
      where: { email: clinicInput.email },
      update: {
        name: clinicInput.name,
        address: clinicInput.address,
        phoneNumber: clinicInput.phoneNumber,
        timezone: 'Europe/Amsterdam',
        workingHours,
      },
      create: {
        ...clinicInput,
        timezone: 'Europe/Amsterdam',
        workingHours,
      },
    });

    for (const availability of availabilityTemplate) {
      await prisma.availability.upsert({
        where: {
          clinicId_dayOfWeek: {
            clinicId: clinic.id,
            dayOfWeek: availability.dayOfWeek,
          },
        },
        update: {
          startTime: availability.startTime,
          endTime: availability.endTime,
          isOpen: true,
        },
        create: {
          clinicId: clinic.id,
          dayOfWeek: availability.dayOfWeek,
          startTime: availability.startTime,
          endTime: availability.endTime,
          isOpen: true,
        },
      });
    }

    seededClinics.push(clinic);
  }

  const clinicIds = seededClinics.map((clinic) => clinic.id);

  await prisma.appointment.deleteMany({
    where: {
      clinicId: { in: clinicIds },
    },
  });

  for (const [clinicIndex, clinic] of seededClinics.entries()) {
    const appointments = buildAppointments(clinic.id, clinicIndex);
    await insertInChunks(appointments);
    console.log(`Seeded ${appointments.length} appointments for ${clinic.name} (${clinic.id})`);
  }

  console.log(`Seed complete: ${seededClinics.length} clinics and ${seededClinics.length * APPOINTMENTS_PER_CLINIC} appointments`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
