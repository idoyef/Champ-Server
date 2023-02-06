import { Credentials } from './models/credentials';
import { generateToken } from '../../utils/tokenHandler';
import { toMongooseQuery } from '../../common/mongo/mongooseHelper';
import { MongooseOperator } from '../../common/mongo/enums/mongooseOperator';
import { UnauthorizedException, ErrorReason } from '../../utils/errorHandler';
import { AuthRepository } from './authRepository';

import bcryptjs from 'bcryptjs';
import { DbUser } from '../users/models/dbUser';
import { LoginRequest } from './models/loginRequest';

const saltRounds = 8;

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async setUserCredentials(user: DbUser, password: string) {
    const encryptedPassword = await bcryptjs.hash(password, saltRounds);

    const credentials = new Credentials({
      userID: user._id,
      username: user.username,
      email: user.email,
      password: encryptedPassword,
    });

    await this.authRepository.insert(credentials);

    const token = generateToken({
      userId: user._id,
      username: credentials.username,
      email: credentials.email,
    });

    return token;
  }

  async login(loginRequest: LoginRequest) {
    const credentialsQuery = toMongooseQuery(
      {
        username: loginRequest.username,
        email: loginRequest.email,
      },
      MongooseOperator.Or
    );
    const dbCredentials = await this.authRepository.findOneWithQuery(
      credentialsQuery
    );

    if (!dbCredentials) {
      throw new UnauthorizedException(
        new ErrorReason('Unauthorized', 'username/password incorrect')
      );
    }

    const isPasswordMatch = await bcryptjs.compare(
      loginRequest.password,
      dbCredentials.password
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException(
        new ErrorReason('Unauthorized', 'username/password incorrect')
      );
    }

    const { _id: id, username, email } = dbCredentials;

    return generateToken({ id, username, email });
  }

  async forgotPassword() {}
}
