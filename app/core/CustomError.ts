import { ERROR_CODES } from '@config';

export class CustomError {
    errorCode: ERROR_CODES;
    description?: string;
    constructor(errorCode: ERROR_CODES, description?: string) {
        this.errorCode = errorCode;
        this.description = description;
    }
}
