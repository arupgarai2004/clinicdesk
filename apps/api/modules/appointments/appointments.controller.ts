import { Controller, Get, Query, Inject, Put, Post } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppStatus, Prisma } from '@prisma/client';
import { AppointmentFilters, AppointmentQuery } from './appointments.types';

@Controller('appointments')
export class AppointmentsController {
  constructor(
    @Inject(AppointmentsService)
    private readonly appointmentsService: AppointmentsService,
  ) {}

  @Get()
  async findAll(@Query() query: AppointmentQuery) {
    console.log('AppointmentsController this.appointmentsService:', this.appointmentsService);
    const filters: AppointmentFilters = {
      date: query.date,
      status: query.status,
      search: query.search,
    };
    return this.appointmentsService.findAll(query.clinicId, filters);
  }

  @Put(':id/status')
  async updateStatus(@Query('id') id: string, @Query('status') status: AppStatus) {
    return this.appointmentsService.updateStatus(id, status as AppStatus);
  }

  @Post()
  async create(@Query() query: Prisma.AppointmentCreateInput) {
    return this.appointmentsService.create(query);
  }

}