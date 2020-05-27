export const enum ERROR_CODES {
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    ENDPOINT_NOT_FOUND = 'ENDPOINT_NOT_FOUND',
    PERMISSION_DENIED = 'PERMISSION_DENIED',
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    UNVERIFIED_EMAIL = 'UNVERIFIED_EMAIL',
    INSUFFICIENT_PARAMETERS = 'INSUFFICIENT_PARAMETERS',
    INVALID_PARAMETERS = 'INVALID_PARAMETERS',
    INVALID_EMAIL_ADDRESS = 'INVALID_EMAIL_ADDRESS',
    RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
    TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',
    INVALID_JWT_TOKEN = 'INVALID_JWT_TOKEN',
    EXPIRED_JWT_TOKEN = 'EXPIRED_JWT_TOKEN',
    RESOURCE_EXISTS = 'RESOURCE_EXISTS',
    INVALID_OLD_PASSWORD = 'INVALID_OLD_PASSWORD',
    USER_NOT_REGISTERED = 'USER_NOT_REGISTERED',
    LICENSE_EXPIRED = 'LICENSE_EXPIRED',
    API_CALLS_EXHAUSTED = 'API_CALLS_EXHAUSTED',
    ACTIVATION_LIMIT_REACHED = 'ACTIVATION_LIMIT_REACHED',
    INVALID_CONNECTION = 'INVALID_CONNECTION',
}

export const ERRORS = {
    INTERNAL_ERROR: {
        status: 500,
        title: 'Internal server error',
        code: 'INTERNAL_ERROR',
    },
    ENDPOINT_NOT_FOUND: {
        status: 404,
        title: 'Endpoint not found',
        code: 'ENDPOINT_NOT_FOUND',
    },
    PERMISSION_DENIED: {
        status: 403,
        title: 'Permission denied',
        code: 'PERMISSION_DENIED',
    },
    INVALID_CREDENTIALS: {
        status: 401,
        title: 'Invalid login credentials',
        code: 'INVALID_CREDENTIALS',
    },
    UNVERIFIED_EMAIL: {
        status: 401,
        title: 'Email address is not verified',
        code: 'UNVERIFIED_EMAIL',
    },
    INVALID_PARAMETERS: {
        status: 400,
        title: 'Invalid parameters',
        code: 'INVALID_PARAMETERS',
    },
    INSUFFICIENT_PARAMETERS: {
        status: 400,
        title: 'Insufficient parameters',
        code: 'INSUFFICIENT_PARAMETERS',
    },
    INVALID_EMAIL_ADDRESS: {
        status: 400,
        title: 'Invalid email address',
        code: 'INVALID_EMAIL_ADDRESS',
    },
    RESOURCE_NOT_FOUND: {
        status: 404,
        title: 'Resource not found',
        code: 'RESOURCE_NOT_FOUND',
    },
    TOKEN_NOT_FOUND: {
        status: 401,
        title: 'Token not found in request',
        code: 'TOKEN_NOT_FOUND',
    },
    INVALID_JWT_TOKEN: {
        status: 401,
        title: 'Access token provided is invalid',
        code: 'INVALID_JWT_TOKEN',
    },
    EXPIRED_JWT_TOKEN: {
        status: 401,
        title: 'Token is expired',
        code: 'EXPIRED_JWT_TOKEN',
    },
    RESOURCE_EXISTS: {
        status: 409,
        title: 'Resource already exists',
        code: 'RESOURCE_EXISTS',
    },
    INVALID_OLD_PASSWORD: {
        status: 400,
        title: 'Old password does not match',
        code: 'INVALID_OLD_PASSWORD',
    },
    USER_NOT_REGISTERED: {
        status: 401,
        title: 'User is not registered',
        code: 'USER_NOT_REGISTERED',
    },
    LICENSE_EXPIRED: {
        status: 401,
        title: 'License has expired',
        code: 'LICENSE_EXPIRED',
    },
    API_CALLS_EXHAUSTED: {
        status: 400,
        title: 'Total API calls have been exhausted',
        code: 'API_CALLS_EXHAUSTED',
    },
    ACTIVATION_LIMIT_REACHED: {
        status: 401,
        title: 'You have exceeded allowed number of activations in given sync interval. Please try after some time.',
        code: 'ACTIVATION_LIMIT_REACHED',
    },
    INVALID_CONNECTION: {
        status: 401,
        title: 'Invalid connection ID',
        code: 'INVALID_CONNECTION',
    },
};
