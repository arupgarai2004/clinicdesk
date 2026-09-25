import { Controller, Get, Param } from '@nestjs/common';
import { DoctorsService } from "./doctors.service";

@Controller('doctors')
export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService) {}
    @Get()
    getDoctors() {
        return this.doctorsService.findAll();
    }
    @Get('clinic/:clinicId')
        getDoctorByClinic(@Param('clinicId') clinicId: string) {
        return this.doctorsService.findByClinic(clinicId);
    }
    @Get(':id')
        getDoctorById(@Param('id') id: string) {
        return this.doctorsService.findOne(id);
    }
}   