import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppStatus, Prisma } from '@prisma/client';
import { AppointmentFilters } from './appointments.types';

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  // ── List with optional filters ──────────────────────────────────────────
  async findAll(clinicId?: string, filters: AppointmentFilters = {}) {
    const where: Prisma.AppointmentWhereInput = clinicId ? { clinicId } : {};

    if (filters.date) {
      const day   = new Date(filters.date);
      const next  = new Date(day);
      next.setDate(next.getDate() + 1);
      where.startTime = { gte: day, lt: next };
    }

    if (filters.status) where.status = filters.status;

    if (filters.search) {
      where.OR = [
        { patientName:  { contains: filters.search, mode: 'insensitive' } },
        { patientEmail: { contains: filters.search, mode: 'insensitive' } },
        { reason:       { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const appointments = await this.prisma.appointment.findMany({ where, orderBy: { startTime: 'asc' } });
    console.log('Appointments query', { where, count: appointments.length });
    return appointments;
  }

  // ── Single appointment ──────────────────────────────────────────────────
  async findOne(id: string) {
    const appt = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appt) throw new NotFoundException(`Appointment ${id} not found`);
    return appt;
  }

  // ── Create ──────────────────────────────────────────────────────────────
  async create(dto: Prisma.AppointmentCreateInput) {
    return this.prisma.appointment.create({ data: dto });
  }

  // ── Update status ───────────────────────────────────────────────────────
  async updateStatus(id: string, status: AppStatus) {
    return this.prisma.appointment.update({
      where: { id },
      data:  { status },
    });
  }

  // ── Cancel via token ────────────────────────────────────────────────────
  async cancelByToken(token: string) {
    const appt = await this.prisma.appointment.findUnique({
      where: { cancelToken: token },
    });
    if (!appt) throw new NotFoundException('Invalid cancel token');
    return this.prisma.appointment.update({
      where: { id: appt.id },
      data:  { status: 'CANCELLED' },
    });
  }
}