import { ERROR_CODES } from '@config/ErrorCodes';

export default class CustomError {
    errorCode: ERROR_CODES;
    constructor(errorCode: ERROR_CODES) {
        this.errorCode = errorCode;
    }
}
