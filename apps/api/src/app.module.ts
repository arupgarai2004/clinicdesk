import * as path from 'path';
import { Module }       from '@nestjs/common';
import { ConfigModule }  from '@nestjs/config';
import { PrismaModule }  from '../prisma/prisma.module';
import { AppController } from './app.controller';
import { AppointmentsModule } from '../modules/appointments/appointments.module';
import { AiModule } from '../modules/ai/ai.module';
import { ClinicsModule } from '../modules/clinics/clinics.module';
import { DoctorsModule } from '../modules/doctors/doctors.module';
import { AuthModule } from '../modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(process.cwd(), 'apps/api/.env'),
    }),
    PrismaModule,           
    AppointmentsModule,
    AiModule,
    ClinicsModule,
    DoctorsModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}