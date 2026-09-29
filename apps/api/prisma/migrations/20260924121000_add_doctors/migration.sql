-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_clinicId_key" ON "Doctor"("clinicId");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_email_key" ON "Doctor"("email");

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN "doctorId" TEXT;

-- One doctor per existing clinic. Known seed clinics get a fixed dummy doctor.
-- Any other clinic, including ones added by hand, gets a default doctor from its name.
INSERT INTO "Doctor" ("id", "clinicId", "name", "email", "createdAt", "updatedAt")
SELECT
    'doc_' || c."id",
    c."id",
    CASE c."email"
        WHEN 'amsterdam.central@clinicdesk.com' THEN 'Dr. Ahuja'
        WHEN 'rotterdam.west@clinicdesk.com' THEN 'Dr. Meyer'
        WHEN 'utrecht.care@clinicdesk.com' THEN 'Dr. Janssen'
        WHEN 'eindhoven.health@clinicdesk.com' THEN 'Dr. Bakker'
        WHEN 'groningen.north@clinicdesk.com' THEN 'Dr. Visser'
        WHEN 'thehague.family@clinicdesk.com' THEN 'Dr. de Boer'
        WHEN 'haarlem.plus@clinicdesk.com' THEN 'Dr. Mulder'
        WHEN 'breda.carepoint@clinicdesk.com' THEN 'Dr. de Groot'
        WHEN 'maastricht.south@clinicdesk.com' THEN 'Dr. Bos'
        WHEN 'leiden.city@clinicdesk.com' THEN 'Dr. Vos'
        ELSE 'Default doctor — ' || c."name"
    END,
    CASE c."email"
        WHEN 'amsterdam.central@clinicdesk.com' THEN 'dr.ahuja@clinicdesk.com'
        WHEN 'rotterdam.west@clinicdesk.com' THEN 'dr.meyer@clinicdesk.com'
        WHEN 'utrecht.care@clinicdesk.com' THEN 'dr.janssen@clinicdesk.com'
        WHEN 'eindhoven.health@clinicdesk.com' THEN 'dr.bakker@clinicdesk.com'
        WHEN 'groningen.north@clinicdesk.com' THEN 'dr.visser@clinicdesk.com'
        WHEN 'thehague.family@clinicdesk.com' THEN 'dr.deboer@clinicdesk.com'
        WHEN 'haarlem.plus@clinicdesk.com' THEN 'dr.mulder@clinicdesk.com'
        WHEN 'breda.carepoint@clinicdesk.com' THEN 'dr.degroot@clinicdesk.com'
        WHEN 'maastricht.south@clinicdesk.com' THEN 'dr.bos@clinicdesk.com'
        WHEN 'leiden.city@clinicdesk.com' THEN 'dr.vos@clinicdesk.com'
        ELSE 'default.' || c."id" || '@clinicdesk.local'
    END,
    NOW(),
    NOW()
FROM "Clinic" c
WHERE NOT EXISTS (
    SELECT 1 FROM "Doctor" d WHERE d."clinicId" = c."id"
);

-- Point every existing appointment at that clinic's doctor. Rows are not deleted.
UPDATE "Appointment" a
SET "doctorId" = d."id"
FROM "Doctor" d
WHERE a."clinicId" = d."clinicId"
  AND a."doctorId" IS NULL;

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "doctorId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Appointment_doctorId_idx" ON "Appointment"("doctorId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
