import { Injectable, InternalServerErrorException, Logger, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AiAppointmentSuggestRequest, AiAppointmentSuggestResponse, } from "@org/models";
import { config } from "rxjs/internal/config";

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);
    private readonly genAI: GoogleGenerativeAI;

    constructor(@Inject(ConfigService) private readonly config: ConfigService) {
        this.logger.log('Initializing AiService');
        if (!this.config) {
            throw new Error('ConfigService was not injected into AiService');
        }

        const apiKey = this.config.getOrThrow<string>('GEMINI_API_KEY');
        this.genAI = new GoogleGenerativeAI(apiKey);

        this.logger.log(`Initializing GoogleGenerativeAI with API key: ***` + apiKey.slice(-4));

        this.genAI = new GoogleGenerativeAI(apiKey);

    }

    async suggestAppointmentDetails(dto: AiAppointmentSuggestRequest): Promise<AiAppointmentSuggestResponse> {
        const model = this.genAI.getGenerativeModel(
            { model: 'gemini-1.5-flash' },
            { apiVersion: "v1" }
        );

        const prompt = `
        You are a medical appointment assistant.
        Patient name: ${dto.patientName}
        Reason: "${dto.reason}"
        Respond with ONLY this JSON:
        {
            "suggestedDuration": <15 | 30 | 45 | 60>,
                "prepNotes": "<one or two practical sentences for clinic staff>",
                    "confidence": "<low | medium | high>"
        } `.trim();

        try {
            const result = await model.generateContent(prompt);
            const parsed = JSON.parse(result.response.text()) as AiAppointmentSuggestResponse;
            if (!parsed.suggestedDuration || !parsed.prepNotes) {
                throw new Error('Invalid response shape');
            }
            return parsed;
        } catch (err) {
            this.logger.error('Gemini suggest failed', err);
            throw new InternalServerErrorException('AI suggestion failed. Please try again.');
        }
    }


}



