interface EligibilityInput {
  numeroDoDocumento: string,
  tipoDeConexao: string,
  classeDeConsumo: string,
  modalidadeTarifaria: string,
  historicoDeConsumo: number[]
}

export class CheckEligibilityDTO {
  consumptionClass: string;
  tariffModality: string;
  connectionType: string;
  consumptionHistory: number[];

  constructor(data: EligibilityInput) {
    this.consumptionClass = data.classeDeConsumo;
    this.tariffModality = data.modalidadeTarifaria;
    this.consumptionHistory = data.historicoDeConsumo;
    this.connectionType = data.tipoDeConexao;
  }
}