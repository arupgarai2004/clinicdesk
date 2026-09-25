import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class DoctorsService {
    constructor(
            @Inject(PrismaService)
            private readonly prisma: PrismaService,
        ) { }
    findAll() {
        return this.prisma.doctor.findMany();
    }

    async findOne(id: string) {
        const doctor = await this.prisma.doctor.findUnique({ where: { id } });
        if (!doctor) throw new NotFoundException(`Doctor ${id} not found`);
            return doctor;
    }
    async findByClinic(clinicId: string) {
        const doctor = await this.prisma.doctor.findUnique({ where: { clinicId } });
        if (!doctor) throw new NotFoundException(`No doctor found for clinic ${clinicId}`);
            return doctor;
    }
}