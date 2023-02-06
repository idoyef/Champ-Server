import { DbUser } from './models/dbUser';
import { Role } from '../../common/enums/role';
import { UserRepository } from './userRepository';
import {
  EntityConflictException,
  ErrorReason,
  validate,
} from '../../utils/errorHandler';
import { CreateUserRequest } from './models/requests/createUserRequest';
import { UserQuery } from './models/userQuery';
import { UserState } from './enums/userState';
import { SignUpRequest } from '../auth/models/signUpRequest';
import { AuthService } from '../auth/authService';

const sectionName = 'UserService';

export class UserService {
  constructor(
    private authService: AuthService,
    private userRepository: UserRepository
  ) {}

  async signUp(
    signUpRequest: SignUpRequest
  ): Promise<{ token: string; user: DbUser }> {
    await this.validateUserUniqueness(signUpRequest);

    const user = await this.createUser(new CreateUserRequest(signUpRequest));

    const token = await this.authService.setUserCredentials(
      user,
      signUpRequest.password
    );

    const activeUser = await this.userRepository.updateWithSetById(user._id, {
      state: UserState.Active,
    });

    return { token, user: activeUser };
  }

  async isUsernameExists(username: string) {
    if (username === '') {
      return true;
    }

    const user = await this.userRepository.findOneWithQuery(
      new UserQuery({ username })
    );

    return !!user;
  }

  async isEmailExists(email: string) {
    if (email === '') {
      return true;
    }

    const user = await this.userRepository.findOneWithQuery(
      new UserQuery({ email })
    );

    return !!user;
  }

  async createUser(user: CreateUserRequest) {
    validate(user, sectionName);

    const userToSave = this.populateUserToSave(user);

    return await this.userRepository.insert(userToSave);
  }

  async getUserById(id: string) {
    return this.userRepository.findById(id);
  }

  async getUserWithQuery(query: UserQuery): Promise<DbUser[]> {
    validate(query, sectionName);

    return this.userRepository.findManyWithQuery(query);
  }

  private async validateUserUniqueness(signUpRequest: SignUpRequest) {
    if (await this.isUsernameExists(signUpRequest.username)) {
      throw new EntityConflictException(
        sectionName,
        ['username'],
        new ErrorReason('username', 'Username is already exists')
      );
    }
    if (await this.isEmailExists(signUpRequest.email)) {
      throw new EntityConflictException(
        sectionName,
        ['email'],
        new ErrorReason('email', 'Email is already exists')
      );
    }
  }

  private populateUserToSave(user: CreateUserRequest): DbUser {
    return new DbUser({
      username: user.username,
      email: user.email,
      role: Role.User,
      state: UserState.PreActive,
    });
  }
}
