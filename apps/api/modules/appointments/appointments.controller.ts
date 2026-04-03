import { Controller, Get, Query, Inject } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(
    @Inject(AppointmentsService)
    private readonly appointmentsService: AppointmentsService,
  ) {}

  @Get()
  async findAll(@Query() query: any) {
    console.log('AppointmentsController this.appointmentsService:', this.appointmentsService);
    return this.appointmentsService.findAll(query.clinicId, query);
  }
}