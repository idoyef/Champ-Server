import { Role } from '../enums/role';
import { UserState } from '../enums/userState';

export interface User {
  username: string;
  email: string;
  role: Role;
  state: UserState;
}
