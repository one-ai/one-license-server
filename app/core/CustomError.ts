import { ERROR_CODES } from '@config';

export class CustomError {
    errorCode: ERROR_CODES;
    constructor(errorCode: ERROR_CODES) {
        this.errorCode = errorCode;
    }
}
