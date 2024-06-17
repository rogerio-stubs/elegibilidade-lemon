import { EligibilityType } from "./types/Eligibility.type";

type Input = unknown | EligibilityType;

interface Handler {
    setNext(handler: Handler): Handler;
    handle(request: Input): string[];
}

export abstract class AbstractHandler implements Handler {
    private nextHandler: Handler | null = null;

    public setNext(handler: Handler): Handler {
        this.nextHandler = handler;
        return handler;
    }

    public handle(request: Input): string[] {
        const errors = this.process(request);
        if (this.nextHandler) {
            return errors.concat(this.nextHandler.handle(request));
        }
        return errors;
    }
    protected abstract process(data: Input): string[]; 
}