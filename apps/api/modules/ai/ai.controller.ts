import { Controller, Post, Body, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiAppointmentSuggestRequest } from '@org/models';

@Controller('ai')
export class AiController {
    constructor(@Inject(AiService) private readonly aiService: AiService) {}

    @Post('suggestAppointmentDetails')
    @HttpCode(HttpStatus.OK)
    async suggestAppointmentDetails(@Body() dto: AiAppointmentSuggestRequest) {
        return this.aiService.suggestAppointmentDetails(dto);
    }

}