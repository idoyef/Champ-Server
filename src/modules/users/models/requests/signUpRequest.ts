import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { IValidate } from '../../../../interfaces/IValidate';
import { validateModel } from '../../../../utils/errorHandler';

export class SignUpRequest implements IValidate {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  constructor(fields?: { userName: string; email: string; password: string }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }

  validate(): any {
    return validateModel(this);
  }
}
