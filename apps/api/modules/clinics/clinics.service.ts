import { Injectable, Inject } from '@nestjs/common';
import { ClinicFilters, ClinicCreateDto, ClinicUpdateDto } from '@org/models';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClinicsService {
    constructor(
        @Inject(PrismaService)
        private readonly prisma: PrismaService,
    ) { }

    findAll(filters: ClinicFilters = {}) {
        const where: Prisma.ClinicWhereInput = {};

        if (filters.search) {
            where.OR = [
                { name:  { contains: filters.search, mode: 'insensitive' } },
                { address: { contains: filters.search, mode: 'insensitive' } },
                { email:   { contains: filters.search, mode: 'insensitive' } },
                { phoneNumber: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        return this.prisma.clinic.findMany({ where });
    }

    findOne(id: string) {
        return this.prisma.clinic.findUnique({ where: { id } });
    }

    createClinic(dto: ClinicCreateDto) {
        const { workingHours, ...rest } = dto;

        return this.prisma.clinic.create({
            data: {
                ...rest,
                workingHours: workingHours as unknown as Prisma.InputJsonValue,
            },
        });
    }

    updateClinic(id: string, dto: ClinicUpdateDto) {
        const { workingHours, ...rest } = dto;
        const data: Prisma.ClinicUpdateInput = {
            ...rest,
            ...(workingHours
                ? { workingHours: workingHours as unknown as Prisma.InputJsonValue }
                : {}),
        };

        return this.prisma.clinic.update({
            where: { id: id },
            data,
        });
    }

    deleteClinic(id: string) {
        return this.prisma.clinic.delete({ where: { id: id } });
    }
}
