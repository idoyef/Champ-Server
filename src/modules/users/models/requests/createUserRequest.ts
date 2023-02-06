import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { IValidate } from '../../../../interfaces/IValidate';
import { validateModel } from '../../../../utils/errorHandler';

export class CreateUserRequest implements IValidate {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  constructor(fields?: { username: string; email: string }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }

  validate(): any {
    return validateModel(this);
  }
}
