import { APIGatewayProxyEvent } from "aws-lambda";
import { checkEligibilityController } from "./Eligibility.controller";
import { EligibilityApplicationService } from "../../application/service/Eligibility.service";
import { ErrorHandler } from "../../../shared/erros/handler.error";

describe(checkEligibilityController.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and valid response for valid input, when eligible", async () => {
    const mockEvent = {
      body: JSON.stringify({
        numeroDoDocumento: "14041737706",
        tipoDeConexao: "bifasico",
        classeDeConsumo: "comercial",
        modalidadeTarifaria: "convencional",
        historicoDeConsumo: [
          3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941,
          4597,
        ],
      }),
    } as APIGatewayProxyEvent;

    const response = await checkEligibilityController(mockEvent);
    expect(response.body).toBeDefined();
    const { elegivel, economiaAnualDeCO2 } = JSON.parse(response.body);
    expect(elegivel).toBe(true);
    expect(economiaAnualDeCO2).toBe(5553.24);
  });

  it("should return 200 and valid response for valid input, when not eligible", async () => {
    const mockEvent = {
      body: JSON.stringify({
        numeroDoDocumento: "14041737706",
        tipoDeConexao: "bifasico",
        classeDeConsumo: "rural",
        modalidadeTarifaria: "verde",
        historicoDeConsumo: [
          3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 7859,
          4160,
        ],
      }),
    } as APIGatewayProxyEvent;
    const response = await checkEligibilityController(mockEvent);
    expect(response.body).toBeDefined();
    const { elegivel, razoesDeInelegibilidade } = JSON.parse(response.body);
    expect(elegivel).toBe(false);
    expect(razoesDeInelegibilidade).toEqual([
      "Modalidade tarifária não aceita",
      "Classe de consumo não aceita",
    ]);
  });

  it("should return 400 for invalid input", async () => {
    const mockEvent = {
      body: JSON.stringify({
        numeroDoDocumento: "14041737706",
        tipoDeConexao: "quadrifasico",
        classeDeConsumo: "rural",
        modalidadeTarifaria: "verde",
        historicoDeConsumo: [
          3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 7859,
          4160,
        ],
      }),
    } as APIGatewayProxyEvent;
    const response = await checkEligibilityController(mockEvent);
    expect(response.statusCode).toBe(400);
    const { message } = JSON.parse(response.body);
    expect(message).toBe(
      '"tipoDeConexao" must be one of [monofasico, bifasico, trifasico]'
    );
  });

  it("should return 502 for internal server error", async () => {
    const mockEvent = {
      body: JSON.stringify({
        numeroDoDocumento: "14041737706",
        tipoDeConexao: "bifasico",
        classeDeConsumo: "comercial",
        modalidadeTarifaria: "convencional",
        historicoDeConsumo: [
          3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941,
          4597,
        ],
      }),
    } as APIGatewayProxyEvent;
    const checkEligibilitySpy = jest.spyOn(EligibilityApplicationService.prototype, 'checkEligibility').mockRejectedValue(new ErrorHandler("Something went wrong"));
    const response = await checkEligibilityController(mockEvent);
    expect(response.statusCode).toBe(502);

    checkEligibilitySpy.mockRestore();
  });
});
