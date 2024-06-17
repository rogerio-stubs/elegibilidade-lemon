import { AbstractHandler } from "../../../shared/paterns/ChainOfResponsibility";
import { CheckEligibilityDTO } from "../../application/dto/CheckEligibility.dto";

export class MinCustomerConsumptionService extends AbstractHandler {
    protected  process(data: CheckEligibilityDTO): string[] {
        const { consumptionHistory, connectionType } = data;
        const errors: string[] = [];
        const connectionMap: { [key: string]: number } = {
            'monofasico': Number(process.env.MONOFASICO) ?? 0,
            'bifasico': Number(process.env.BIFASICO) ?? 0,
            'trifasico': Number(process.env.TRIFASICO) ?? 0,
        };

        const avgConsumer = consumptionHistory.reduce((a, b) => a + b, 0) / consumptionHistory.length;
        // console.log('Connection type:', connectionType); // Debug
        // console.log('Connection map:', connectionMap[connectionType]); // Debug
        // console.log('Average consumption:', avgConsumer); // Debug
        if (avgConsumer < connectionMap[connectionType]) {
            errors.push(`Consumo muito baixo para tipo de conexão`);
        }
        // console.log('Errors:', errors); // Debug
        return errors;
    }
}