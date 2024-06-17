export class ElegibilityEntity {
  constructor(
    public readonly elegibility: boolean,
    public readonly annualCO2Saving?: number,
    public readonly IneligibilityReasons?: string[]
  ) {}
}