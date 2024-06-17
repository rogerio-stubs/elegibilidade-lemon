import { ErrorHandler } from "../../../shared/erros/handler.error";
import { IEligibilityDomainService } from "../../domain/interface/IEligibility.interface";
import { ConsumerClassService } from "../../infrastructure/service/ConsumerClass.service";
import { MinCustomerConsumptionService } from "../../infrastructure/service/MinCustomerConsumption.service";
import { TariffModalityService } from "../../infrastructure/service/TariffModality.service";
import { CheckEligibilityDTO } from "../dto/CheckEligibility.dto";
import { EligibleDTO } from "../dto/Eligible.dto";
import { EligibilityApplicationService } from "./Eligibility.service";

describe("EligibilityApplicationService", () => {
  let service: EligibilityApplicationService;
  let input: CheckEligibilityDTO;

  const mockTariffModalityService = {
    setNext: jest.fn().mockReturnThis(),
    handle: jest.fn(),
  };
  const mockMinCustomerConsumptionService = {
    setNext: jest.fn().mockReturnThis(),
  };
  const mockConsumerClassService = {
    setNext: jest.fn().mockReturnThis(),
  };
  const mockEligibilityDomainService = {
    savingProjectionCO2: jest.fn(),
  };

  beforeEach(() => {
    service = new EligibilityApplicationService(
      mockTariffModalityService as unknown as TariffModalityService,
      mockMinCustomerConsumptionService as unknown as MinCustomerConsumptionService,
      mockConsumerClassService as unknown as ConsumerClassService,
      mockEligibilityDomainService as unknown as IEligibilityDomainService
    );

    input = {
      consumptionClass: "comercial",
      tariffModality: "convencional",
      connectionType: "monofasico",
      consumptionHistory: [100, 200, 300],
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return eligible DTO with economyAnnualCO2 when no errors are found", async () => {
    mockTariffModalityService.handle.mockReturnValue([]);
    mockEligibilityDomainService.savingProjectionCO2.mockResolvedValue(123.45);

    const result = await service.checkEligibility(input);

    expect(result).toEqual(new EligibleDTO(true, null, 123.45));
    expect(mockTariffModalityService.setNext).toHaveBeenCalledTimes(3);
    expect(mockTariffModalityService.handle).toHaveBeenCalledWith(input);
    expect(
      mockEligibilityDomainService.savingProjectionCO2
    ).toHaveBeenCalledWith(input.consumptionHistory);
  });

  it("should return ineligible DTO with reasons when errors are found", async () => {
    const errors = ["Tariff Modality Error"];
    mockTariffModalityService.handle.mockReturnValue(errors);

    const result = await service.checkEligibility(input);

    expect(result).toEqual(new EligibleDTO(false, errors, null));
    expect(mockTariffModalityService.setNext).toHaveBeenCalledTimes(3);
    expect(mockTariffModalityService.handle).toHaveBeenCalledWith(input);
    expect(
      mockEligibilityDomainService.savingProjectionCO2
    ).not.toHaveBeenCalled();
  });

  it("should throw ErrorHandler when an exception occurs", async () => {
    mockTariffModalityService.handle.mockImplementation(() => {
      throw new Error("Some error");
    });

    await expect(service.checkEligibility(input)).rejects.toThrow(ErrorHandler);
  });
});
