import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as dotenv from "dotenv";
import { CheckEligibilityDTO } from "../../application/dto/CheckEligibility.dto";
import { EligibilityApplicationService } from "../../application/service/Eligibility.service";
import { TariffModalityService } from "../../infrastructure/service/TariffModality.service";
import { MinCustomerConsumptionService } from "../../infrastructure/service/MinCustomerConsumption.service";
import { ConsumerClassService } from "../../infrastructure/service/ConsumerClass.service";
import { EligibilityService } from "../../infrastructure/service/Eligibility.service";
import { InputEligibilitySchema } from "../schema/InputEligibility.schema";
import { schemaError } from "../../../shared/erros/response/schema.errors";
import { ErrorHandler } from "../../../shared/erros/handler.error";

dotenv.config();

const tariffModalityService = new TariffModalityService();
const minCustomerConsumptionService = new MinCustomerConsumptionService();
const consumerClassService = new ConsumerClassService();
const eligibilityService = new EligibilityService();

const eligibilityApplicationService = new EligibilityApplicationService(
  tariffModalityService,
  minCustomerConsumptionService,
  consumerClassService,
  eligibilityService
);

export const checkEligibilityController = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  let data;

  try {
    data = JSON.parse(event.body || "{}");
  } catch (error) {
    console.error('JSON parsing error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid JSON format",
      }),
    };
  }

  const { error } = InputEligibilitySchema.validate(data);
  if (error) {
    return schemaError(error.details);
  }

  try {
    const input = new CheckEligibilityDTO(data);
    const output = await eligibilityApplicationService.checkEligibility(input);
    return {
      statusCode: 200,
      body: JSON.stringify(output),
    };
  } catch (error) {
    if (error instanceof ErrorHandler) {
      return {
        statusCode: 502,
        body: JSON.stringify({
          message: error.message,
        }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
      }),
    };
  }
};
