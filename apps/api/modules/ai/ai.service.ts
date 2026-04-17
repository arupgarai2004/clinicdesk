import { Injectable, Logger, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AiAppointmentSuggestRequest, AiAppointmentSuggestResponse } from "@org/models";

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);
    private readonly genAI: GoogleGenerativeAI;
    private readonly modelName: string;

    constructor(@Inject(ConfigService) private readonly config: ConfigService) {
        const apiKey = this.config.getOrThrow<string>('GEMINI_API_KEY');
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.modelName = this.config.get<string>('GEMINI_MODEL') ?? 'gemini-2.5-flash';
    }

    async suggestAppointmentDetails(dto: AiAppointmentSuggestRequest): Promise<AiAppointmentSuggestResponse> {
        const model = this.genAI.getGenerativeModel({ model: this.modelName });

        const prompt = `
You are a medical administrative assistant helping to schedule appointments.
Patient Name: ${dto.patientName}
Reason for Visit: "${dto.reason}"

            Please respond ONLY with a JSON object in this EXACT format:
{
  "suggestedDuration": 30,
  "prepNotes": "string describing what clinic staff should do before the visit",
  "confidence": "low" | "medium" | "high"
}

            Important:
            * "suggestedDuration" MUST be one of these values: 15, 30, 45, or 60.
            * Do NOT add any extra text outside of the JSON.
`;

        try {
            const result = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: 'application/json',
                },
            });
            const text = result.response.text();

            // Clean the string in case AI adds markdown formatting
            const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

            const parsed = JSON.parse(cleanedText) as AiAppointmentSuggestResponse;
            return parsed;
        } catch (err) {
            this.logger.error(`Gemini Suggestion Failed for model "${this.modelName}"`, err);
            // Provide a fallback value that matches the schema
            return {
                suggestedDuration: 30,
                prepNotes: 'Please check the patient history before the appointment.',
                confidence: 'low'
            };
        }
    }
}
