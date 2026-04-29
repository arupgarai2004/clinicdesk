import { Controller, Get, Post, Put, Delete, Param, Query, Inject } from '@nestjs/common';
import { ClinicsService } from './clinics.service';
import { ClinicFilters, ClinicCreateDto, ClinicUpdateDto } from '@org/models';  

@Controller('clinics')  
export class ClinicsController {
  constructor(
    @Inject(ClinicsService)
    private readonly clinicsService: ClinicsService,
  ) {}

    @Get()
    allClinics(@Query() filters: ClinicFilters) {
        return this.clinicsService.findAll(filters);
    }

    @Get(':id')
    getClinic(@Param('id') id: string) {
        return this.clinicsService.findOne(id);
    }

    @Post()
    createClinic(@Query() dto: ClinicCreateDto) {
        return this.clinicsService.createClinic(dto);
    }

    @Put(':id')
    updateClinic(@Param('id') clinicId: string, @Query() dto: ClinicUpdateDto) {
        return this.clinicsService.updateClinic(clinicId, dto);
    }

    @Delete(':id')
    deleteClinic(@Param('id') clinicId: string) {
        return this.clinicsService.deleteClinic(clinicId);
    }
}
