import { CheckEligibilityDTO } from "../../application/dto/CheckEligibility.dto";
import { TariffModalityService } from "./TariffModality.service";

class TestableTariffModalityService extends TariffModalityService {
    public testProcess(data: CheckEligibilityDTO): string[] {
        return this.process(data)
    }
}


describe(TariffModalityService.name, () => {
    let service: TestableTariffModalityService;
    let input: CheckEligibilityDTO = {
        consumptionClass: '',
        tariffModality: '',
        connectionType: '',
        consumptionHistory: []
    };
    const outputError: string = 'Modalidade tarifária não aceita';

    beforeEach(() => {
        service = new TestableTariffModalityService();
        process.env.ALLOWED_TARIFF_MODALITY = 'branca,convencional';
    });

    afterEach(() => {
        jest.resetModules();
        delete process.env.ALLOWED_TARIFF_MODALITY;
    });

    it('should return no errors if the tariff modality is eligible', () => {
        input.tariffModality = 'branca';
        const output = service.testProcess(input);
        expect(output).toHaveLength(0);
    });

    it('should return an error if the tariff modality is not eligible', () => {
        input.tariffModality = 'inlegible';
        const errors = service.testProcess(input);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toBe(outputError);
    });

    it('should handle empty ALLOWED_TARIFF_MODALITY environment variable', () => {
        process.env.ALLOWED_TARIFF_MODALITY = '';
        const errors = service.testProcess(input);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toBe(outputError);
    });

    it('should handle missing ALLOWED_TARIFF_MODALITY environment variable', () => {
        delete process.env.ALLOWED_TARIFF_MODALITY;
        const errors = service.testProcess(input);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toBe(outputError);
    });
});