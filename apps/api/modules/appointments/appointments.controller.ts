import { Controller, Get, Query, Inject, Put, Post, Param, Delete, NotFoundException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppStatus, Prisma } from '@prisma/client';
import { AppointmentFilters, AppointmentQuery } from '@org/models';

@Controller('appointments')
export class AppointmentsController {
  constructor(
    @Inject(AppointmentsService)
    private readonly appointmentsService: AppointmentsService,
  ) { }

  @Get()
  async findAll(@Query() query: AppointmentQuery) {
    const filters: AppointmentFilters = {
      date: query.date,
      status: query.status,
      search: query.search,
    };
    return this.appointmentsService.findAll(query.clinicId, filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.appointmentsService.findOne(id);
    } catch (err) {
      throw new NotFoundException(`Appointment ${id} not found`);
    }
  }


  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Query('status') status: AppStatus) {
    try {
      return await this.appointmentsService.updateStatus(id, status as AppStatus);
    } catch (err) {
      throw new NotFoundException(`Appointment ${id} not found`);
    }
  }

  @Post()
  async create(@Query() query: Prisma.AppointmentCreateInput) {
    return this.appointmentsService.create(query);
  }

  @Delete(':id')
  async deleteAppointment(@Param('id') id: string) {
    try {
      return await this.appointmentsService.deleteAppointment(id);
    } catch (err) {
      throw new NotFoundException(`Appointment ${id} not found`);
    }
  }

}