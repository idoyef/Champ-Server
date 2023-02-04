"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateModel = exports.validate = exports.handleError = exports.ErrorReason = exports.EntityNotFoundException = exports.MissingRequiredException = exports.InputValidationException = exports.UnauthorizedException = exports.DbCrudException = exports.EntityConflictException = exports.ErrorBase = void 0;
const class_validator_1 = require("class-validator");
const http_status_codes_1 = require("http-status-codes");
class ErrorBase extends Error {
    constructor(source, httpStatusCode, message, errorReasons) {
        super(message);
        this.source = source;
        this.httpStatusCode = httpStatusCode;
        this.message = message;
    }
}
exports.ErrorBase = ErrorBase;
class EntityConflictException extends ErrorBase {
    constructor(source, fields, errorReason) {
        const defaultReason = new ErrorReason('EntityConflict', `Conflict with entities: ${fields ? fields.join(',') : ''}`);
        const reason = errorReason || defaultReason;
        super(source, http_status_codes_1.BAD_REQUEST, reason.message, [reason]);
        this.name = this.constructor.name;
    }
}
exports.EntityConflictException = EntityConflictException;
class DbCrudException extends ErrorBase {
    constructor(source, id, entity, errorReason) {
        const defaultReason = new ErrorReason('DBCrudFailure', `DB action failed. Entity: ${entity}, ID: ${id}`);
        const reason = errorReason || defaultReason;
        super(source, http_status_codes_1.SERVICE_UNAVAILABLE, reason.message, [reason]);
        this.name = this.constructor.name;
    }
}
exports.DbCrudException = DbCrudException;
class UnauthorizedException extends Error {
    constructor(errorReason) {
        super(errorReason.message);
        this.name = this.constructor.name;
        this.httpStatusCode = http_status_codes_1.UNAUTHORIZED;
        this.errorReasons = [errorReason];
    }
}
exports.UnauthorizedException = UnauthorizedException;
class InputValidationException extends ErrorBase {
    constructor(source, errorReason) {
        const reason = errorReason
            ? errorReason
            : new ErrorReason('InputValidationError', 'Input Validation Failed');
        super(source, http_status_codes_1.BAD_REQUEST, reason.message, [reason]);
        this.name = this.constructor.name;
    }
}
exports.InputValidationException = InputValidationException;
class MissingRequiredException extends ErrorBase {
    constructor(source, fields, errorReason) {
        const defaultReason = (fields === null || fields === void 0 ? void 0 : fields.length) > 1
            ? `Missing required fields: ${fields.join(',')}`
            : `Missing Required fields`;
        const reason = errorReason || new ErrorReason('MissingRequired', defaultReason);
        super(source, http_status_codes_1.BAD_REQUEST, reason.message, [reason]);
        this.name = this.constructor.name;
    }
}
exports.MissingRequiredException = MissingRequiredException;
class EntityNotFoundException extends ErrorBase {
    constructor(source, id, entity, errorReason) {
        const defaultReason = new ErrorReason('EntityNotFound', `Entity ${entity} - id: ${id} was not found`);
        const reason = errorReason || defaultReason;
        super(source, http_status_codes_1.NOT_FOUND, reason.message, [reason]);
        this.name = this.constructor.name;
    }
}
exports.EntityNotFoundException = EntityNotFoundException;
class ErrorReason {
    constructor(key, message) {
        this.key = key;
        this.message = message;
        console.log(`error ========>  ${message}`);
    }
}
exports.ErrorReason = ErrorReason;
function handleError(error) {
    return {
        name: error.name,
        httpStatus: error.httpStatusCode || http_status_codes_1.INTERNAL_SERVER_ERROR,
        errorReasons: error.errorReasons ||
            new ErrorReason('ServerError', `Server Error - ${error.message}`),
    };
}
exports.handleError = handleError;
function validate(object, sectionName = '') {
    const validationResult = object.validate();
    if (!validationResult.isValid) {
        throw new InputValidationException(sectionName, new ErrorReason('input validation', validationResult.errorsMessage));
    }
}
exports.validate = validate;
function validateModel(object) {
    let errorsMessage = '';
    const errors = class_validator_1.validateSync(object);
    if (errors.length > 0) {
        const constraints = errors.map((x) => x.constraints);
        for (const errors of constraints) {
            for (const key in errors) {
                if (Object.prototype.hasOwnProperty.call(errors, key)) {
                    if (errorsMessage !== '') {
                        errorsMessage += ', ';
                    }
                    errorsMessage += errors[key];
                }
            }
        }
    }
    return {
        errorsMessage,
        isValid: errors.length === 0,
    };
}
exports.validateModel = validateModel;
//# sourceMappingURL=errorHandler.js.map