import * as path from 'path';
import { Module }       from '@nestjs/common';
import { ConfigModule }  from '@nestjs/config';
import { PrismaModule }  from '../prisma/prisma.module';
import { AppController } from './app.controller';
import { AppointmentsModule } from '../modules/appointments/appointments.module';
import { AiModule } from '../modules/ai/ai.module';
import { ClinicsModule } from '../modules/clinics/clinics.module';

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
  ],
  controllers: [AppController],
})
export class AppModule {}