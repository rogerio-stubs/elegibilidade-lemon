import { IEligibilityDomainService } from "../../domain/interface/IEligibility.interface";

export class EligibilityService implements IEligibilityDomainService{
    public async savingProjectionCO2(data: number[]): Promise<number> {
        const totalKwh = data.reduce((acc, curr) => acc + curr, 0);
        const annual = totalKwh * 0.084;
        return Number(annual.toFixed(2));
    }
}
