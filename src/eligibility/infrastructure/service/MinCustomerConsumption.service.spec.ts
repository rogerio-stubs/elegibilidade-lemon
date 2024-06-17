import { CheckEligibilityDTO } from "../../application/dto/CheckEligibility.dto";
import { MinCustomerConsumptionService } from "./MinCustomerConsumption.service";

class TestableMinCustomerConsumptionService extends MinCustomerConsumptionService {
  public Testprocess(data: CheckEligibilityDTO): string[] {
    return this.process(data);
  }
}

describe(MinCustomerConsumptionService.name, () => {
  let service: TestableMinCustomerConsumptionService;
  let input: CheckEligibilityDTO = {
    consumptionClass: "",
    tariffModality: "",
    connectionType: "",
    consumptionHistory: [],
  };
  const outputError: string = "Consumo muito baixo para tipo de conexão";

  beforeEach(() => {
    service = new TestableMinCustomerConsumptionService();
    process.env.MONOFASICO = '400';
    process.env.BIFASICO = '500';
    process.env.TRIFASICO = '750';
  });

  afterEach(() => {
    jest.resetModules();
    delete process.env.MONOFASICO;
    delete process.env.BIFASICO;
    delete process.env.TRIFASICO;
  });

  describe("Monofasico", () => {
    it("should return no errors if the monofasico consumption is above the minimum", () => {
      input.connectionType = "monofasico";
      input.consumptionHistory = [401];
      const errors = service.Testprocess(input);
      expect(errors).toHaveLength(0);
    });

    it("should return an error if the monofasico consumption is below the minimum", () => {
      input.connectionType = "monofasico";
      input.consumptionHistory = [399];
      const errors = service.Testprocess(input);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe(outputError);
    });
  });

  describe("Bifasico", () => {
    it("should return no errors if the consumption is above the minimum", () => {
      input.connectionType = "bifasico";
      input.consumptionHistory = [501];
      const errors = service.Testprocess(input);
      expect(errors).toHaveLength(0);
    });

    it("should return an error if the consumption is below the minimum", () => {
      input.connectionType = "bifasico";
      input.consumptionHistory = [499];
      const errors = service.Testprocess(input);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe(outputError);
    });
  });

  describe("Trifasico", () => {
    it("should return no errors if the consumption is above the minimum", () => {
      input.connectionType = "trifasico";
      input.consumptionHistory = [750];
      const errors = service.Testprocess(input);
      expect(errors).toHaveLength(0);
    });

    it("should return an error if the consumption is below the minimum", () => {
      input.connectionType = "trifasico";
      input.consumptionHistory = [749];
      const errors = service.Testprocess(input);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toBe(outputError);
    });
  });
});
