import { AbstractHandler } from "../../../shared/paterns/ChainOfResponsibility";
import { CheckEligibilityDTO } from "../../application/dto/CheckEligibility.dto";

export class TariffModalityService extends AbstractHandler{
    protected process(data: CheckEligibilityDTO): string[] {
        const errors: string[] = [];
        const modality: string[] = (process.env.ALLOWED_TARIFF_MODALITY ?? '').split(',');
        if (!modality.includes(data.tariffModality)) {
             errors.push(`Modalidade tarifária não aceita`);
        }
        return errors
    }
}