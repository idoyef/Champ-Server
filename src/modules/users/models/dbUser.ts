import { Role } from '../../../common/enums/role';
import { IEntity } from '../../../common/mongo/IEntity';
import { UserState } from '../enums/userState';

export class DbUser implements IEntity {
  _id!: string;
  createdAt!: Date;
  updatedAt!: Date;

  username!: string;
  email!: string;
  role!: Role;
  state!: UserState;

  constructor(fields?: {
    username: string;
    email: string;
    role: Role;
    state: UserState;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
