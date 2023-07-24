import { Role } from '../enums/role';

export interface UserInfo {
  id: string;
  username: string;
  role: Role;
}
