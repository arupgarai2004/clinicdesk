import { Module }       from '@nestjs/common';
import { ConfigModule }  from '@nestjs/config';
import { PrismaModule }  from '../prisma/prisma.module';
// import { AppointmentsModule } from './modules/appointments/appointments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,           // global — available everywhere
    // AppointmentsModule,
  ],
})
export class AppModule {}