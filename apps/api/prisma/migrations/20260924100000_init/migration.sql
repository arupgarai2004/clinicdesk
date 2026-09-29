-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."AppStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "public"."Appointment" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "patientEmail" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "public"."AppStatus" NOT NULL DEFAULT 'PENDING',
    "cancelToken" TEXT,
    "aiSuggestion" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Availability" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Clinic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Amsterdam',
    "workingHours" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clinic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_cancelToken_key" ON "public"."Appointment"("cancelToken" ASC);

-- CreateIndex
CREATE INDEX "Appointment_clinicId_startTime_idx" ON "public"."Appointment"("clinicId" ASC, "startTime" ASC);

-- CreateIndex
CREATE INDEX "Appointment_clinicId_status_idx" ON "public"."Appointment"("clinicId" ASC, "status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Availability_clinicId_dayOfWeek_key" ON "public"."Availability"("clinicId" ASC, "dayOfWeek" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_email_key" ON "public"."Clinic"("email" ASC);

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "public"."Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Availability" ADD CONSTRAINT "Availability_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "public"."Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
