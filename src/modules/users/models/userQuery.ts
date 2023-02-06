import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IValidate } from '../../../interfaces/IValidate';
import { validateModel } from '../../../utils/errorHandler';

export class UserQuery implements IValidate {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  username!: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @IsOptional()
  email!: string;

  constructor(fields?: { id?: string; username?: string; email?: string }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }

  validate(): any {
    return validateModel(this);
  }
}
