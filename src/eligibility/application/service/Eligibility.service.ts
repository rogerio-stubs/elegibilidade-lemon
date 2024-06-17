import { ErrorHandler } from "../../../shared/erros/handler.error";
import { IEligibilityDomainService } from "../../domain/interface/IEligibility.interface";
import { ConsumerClassService } from "../../infrastructure/service/ConsumerClass.service";
import { MinCustomerConsumptionService } from "../../infrastructure/service/MinCustomerConsumption.service";
import { TariffModalityService } from "../../infrastructure/service/TariffModality.service";
import { CheckEligibilityDTO } from "../dto/CheckEligibility.dto";
import { EligibleDTO } from "../dto/Eligible.dto";

export class EligibilityApplicationService {
  constructor(
    private readonly tariffModalityService: TariffModalityService,
    private readonly minCustomerConsumptionService: MinCustomerConsumptionService,
    private readonly consumerClassService: ConsumerClassService,
    private readonly eligibilityDomainService: IEligibilityDomainService
  ) {}

  public async checkEligibility(
    data: CheckEligibilityDTO
  ): Promise<EligibleDTO> {
    let economyAnnualCO2: number | undefined;
    let eligible: boolean = false;
    try {
      this.tariffModalityService
        .setNext(this.tariffModalityService)
        .setNext(this.minCustomerConsumptionService)
        .setNext(this.consumerClassService);

      let checkElegible = this.tariffModalityService.handle(data);
      if (checkElegible.length === 0) {
        eligible = true;
        economyAnnualCO2 =
          await this.eligibilityDomainService.savingProjectionCO2(
            data.consumptionHistory
          );
        return new EligibleDTO(eligible, null, economyAnnualCO2);
      }
      return new EligibleDTO(eligible, checkElegible, null);
    } catch (error) {
      throw new ErrorHandler(error)
    }
  }
}
