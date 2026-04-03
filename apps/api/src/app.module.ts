import { Module }       from '@nestjs/common';
import { ConfigModule }  from '@nestjs/config';
import { PrismaModule }  from './prisma/prisma.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { ClinicsModule }      from './modules/clinics/clinics.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { AuthModule }         from './modules/auth/auth.module';
import { AiModule }           from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,           // global — available everywhere
    AppointmentsModule,
    ClinicsModule,
    AvailabilityModule,
    AuthModule,
    AiModule,
  ],
})
export class AppModule {}