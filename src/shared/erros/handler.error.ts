
export class ErrorHandler extends Error {
    constructor(error: unknown, message?: string) {
        if (error instanceof Error) {
            super(error.message);
        } else {
            super(message);
        }
        this.name = 'ErrorHandler';
    }
}