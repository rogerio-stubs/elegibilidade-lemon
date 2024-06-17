import { EligibilityService } from "./Eligibility.service";

describe(EligibilityService.name, () => {
  let service: EligibilityService;
  let input: number[] = [
    3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941, 4597,
  ];

    beforeEach(() => {
        service = new EligibilityService();
    });

    afterEach(() => {
        jest.resetModules(); 
    });

    it('should return the annual CO2 projection', async () => {
        const result = await service.savingProjectionCO2(input);
        expect(result).toBe(5553.24);
    });
});
