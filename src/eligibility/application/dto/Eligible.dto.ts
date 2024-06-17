export class EligibleDTO { 
    elegivel: boolean;
	razoesDeInelegibilidade: string[] | undefined;
    economiaAnualDeCO2: number | undefined;

    constructor(eligible: boolean, ineligibilityReasons?: string[] | null, economyAnnualCO2?: number | null) {
        this.elegivel = eligible;
        this.razoesDeInelegibilidade = ineligibilityReasons ?? undefined;
        this.economiaAnualDeCO2 = economyAnnualCO2 ?? undefined;
    }
}