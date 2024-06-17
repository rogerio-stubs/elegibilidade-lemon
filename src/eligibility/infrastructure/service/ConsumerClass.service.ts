import { AbstractHandler } from "../../../shared/paterns/ChainOfResponsibility";
import { CheckEligibilityDTO } from "../../application/dto/CheckEligibility.dto";

export class ConsumerClassService extends AbstractHandler{
    protected process(data: CheckEligibilityDTO): string[] {
        const errors: string[] = [];
        const eligibleClasses: string[] = (process.env.ALLOWED_ELIGIBLE_CLASS ?? '').split(',');
        if (!eligibleClasses.includes(data.consumptionClass)) {
            errors.push(`Classe de consumo não aceita`);
        }
        return errors;
    }
}
