import { CheckEligibilityDTO } from "../../application/dto/CheckEligibility.dto";
import { ConsumerClassService } from "./ConsumerClass.service";

class TestableConsumerClassService extends ConsumerClassService {
    public testProcess(data: CheckEligibilityDTO): string[] {
        return this.process(data);
    }
}

describe(ConsumerClassService.name, () => {
    let service: TestableConsumerClassService;
    let input: CheckEligibilityDTO = {
        consumptionClass: 'residencial',
        tariffModality: 'tariffModality',
        connectionType: 'connectionType',
        consumptionHistory: [1, 2, 3]
    };
    const outputError: string = 'Classe de consumo não aceita';
    
    beforeEach(() => {
        service = new TestableConsumerClassService();
        process.env.ALLOWED_ELIGIBLE_CLASS = 'comercial,residencial,industrial';
    });

    afterEach(() => {
        jest.resetModules(); 
        delete process.env.ALLOWED_ELIGIBLE_CLASS;
    });

    it('should return no errors if the consumption class is eligible', () => {
        const errors = service.testProcess(input);
        expect(errors).toHaveLength(0);
    });

    it('should return an error if the consumption class is not eligible', () => {
        input.consumptionClass = 'inlegible';
        const errors = service.testProcess(input);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toBe(outputError);
    });

    it('should handle empty ALLOWED_ELIGIBLE_CLASS environment variable', () => {
        process.env.ALLOWED_ELIGIBLE_CLASS = '';
        const errors = service.testProcess(input);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toBe(outputError);
    });

    it('should handle missing ALLOWED_ELIGIBLE_CLASS environment variable', () => {
        delete process.env.ALLOWED_ELIGIBLE_CLASS;
        const errors = service.testProcess(input);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toBe(outputError);
    });
});