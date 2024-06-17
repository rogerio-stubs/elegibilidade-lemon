import { ValidationErrorItem } from "joi";

  export const schemaError = (error: ValidationErrorItem[]) => {
    return {
        statusCode: 400,
        body: JSON.stringify({
            message: `${error.map((err) => err.message).join(', ')}`,
        }),
  }
};