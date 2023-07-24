import { UserRepository } from './userRepository';
import { EntityConflictException, ErrorReason } from '../../utils/errorHandler';
import { CreateUserRequest } from './models/requests/createUserRequest';
import { UserState } from './enums/userState';
import { SignUpRequest } from './models/signUpRequest';
import { AuthService } from '../auth/authService';
import { DbUser } from './models/db/dbUserBase';
import { User } from './models/user';
import { Role } from './enums/role';

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

    const user = await this.createUser(signUpRequest);

    const token = await this.authService.setUserCredentials(
      user,
      signUpRequest.password
    );

    // TBD - add mechanism for activation by email
    const activatedUser = await this.userRepository.updateById(user.id, {
      state: UserState.Active,
    });

    return { token, user: activatedUser };
  }

  async isUsernameExists(username: string) {
    if (!username.trim()) {
      return true;
    }

    const user = await this.userRepository.findOneWithQuery({ username });

    return !!user;
  }

  async isEmailExists(email: string) {
    if (!email.trim()) {
      return true;
    }

    const user = await this.userRepository.findOneWithQuery({ email });

    return !!user;
  }

  async createUser(user: CreateUserRequest): Promise<DbUser> {
    const userToSave = this.populateUserToSave(user);

    return await this.userRepository.insert(userToSave);
  }

  async getUserById(id: string) {
    return this.userRepository.findById(id);
  }

  async getUserWithQuery(query: any): Promise<DbUser[]> {
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

  private populateUserToSave(user: CreateUserRequest): User {
    return {
      username: user.username,
      email: user.email,
      role: Role.User,
      state: UserState.PreActive,
    };
  }
}
