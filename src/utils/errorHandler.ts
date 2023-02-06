import { validateSync } from 'class-validator';
import {
  UNAUTHORIZED,
  SERVICE_UNAVAILABLE,
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from 'http-status-codes';
import { IValidate } from '../interfaces/IValidate';

export class ErrorBase extends Error {
  constructor(
    public source: string,
    public httpStatusCode: any,
    public message: string,
    errorReasons: ErrorReason[]
  ) {
    super(message);
  }
}

export class EntityConflictException extends ErrorBase {
  constructor(source: string, fields: string[], errorReason: ErrorReason) {
    const defaultReason = new ErrorReason(
      'EntityConflict',
      `Conflict with entities: ${fields ? fields.join(',') : ''}`
    );
    const reason = errorReason || defaultReason;

    super(source, BAD_REQUEST, reason.message, [reason]);
    this.name = this.constructor.name;
  }
}

export class DbCrudException extends ErrorBase {
  constructor(
    source: string,
    id: string,
    entity: string,
    errorReason: ErrorReason
  ) {
    const defaultReason = new ErrorReason(
      'DBCrudFailure',
      `DB action failed. Entity: ${entity}, ID: ${id}`
    );
    const reason = errorReason || defaultReason;

    super(source, SERVICE_UNAVAILABLE, reason.message, [reason]);
    this.name = this.constructor.name;
  }
}

export class UnauthorizedException extends Error {
  httpStatusCode: any;
  errorReasons: ErrorReason[];

  constructor(errorReason: ErrorReason) {
    super(errorReason.message);
    this.name = this.constructor.name;
    this.httpStatusCode = UNAUTHORIZED;
    this.errorReasons = [errorReason];
  }
}

export class InputValidationException extends ErrorBase {
  constructor(source: string, errorReason?: ErrorReason) {
    const reason = errorReason
      ? errorReason
      : new ErrorReason('InputValidationError', 'Input Validation Failed');

    super(source, BAD_REQUEST, reason.message, [reason]);

    this.name = this.constructor.name;
  }
}

export class MissingRequiredException extends ErrorBase {
  constructor(source: string, fields: string[], errorReason: ErrorReason) {
    const defaultReason =
      fields?.length > 1
        ? `Missing required fields: ${fields.join(',')}`
        : `Missing Required fields`;
    const reason =
      errorReason || new ErrorReason('MissingRequired', defaultReason);

    super(source, BAD_REQUEST, reason.message, [reason]);

    this.name = this.constructor.name;
  }
}

export class EntityNotFoundException extends ErrorBase {
  constructor(
    source: string,
    id: string,
    entity: string,
    errorReason: ErrorReason
  ) {
    const defaultReason = new ErrorReason(
      'EntityNotFound',
      `Entity ${entity} - id: ${id} was not found`
    );
    const reason = errorReason || defaultReason;

    super(source, NOT_FOUND, reason.message, [reason]);
    this.name = this.constructor.name;
  }
}

export class ErrorReason {
  constructor(public key: string, public message: string) {
    console.log(`error ========>  ${message}`);
  }
}

export function handleError(error: any) {
  return {
    name: error.name,
    httpStatus: error.httpStatusCode || INTERNAL_SERVER_ERROR,
    errorReasons:
      error.errorReasons ||
      new ErrorReason('ServerError', `Server Error - ${error.message}`),
  };
}

export function validate(object: IValidate, sectionName: string = '') {
  const validationResult = object.validate();
  if (!validationResult.isValid) {
    throw new InputValidationException(
      sectionName,
      new ErrorReason('input validation', validationResult.errorsMessage)
    );
  }
}

export function validateModel(object: IValidate) {
  let errorsMessage = '';
  const errors = validateSync(object);

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
