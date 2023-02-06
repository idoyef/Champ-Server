import { IEntity } from '../../../common/mongo/IEntity';

export class Credentials implements IEntity {
  _id!: string;
  createdAt!: Date;
  updatedAt!: Date;

  userID!: string;
  username!: string;
  email!: string;
  password!: string;

  constructor(fields?: {
    userID: string;
    username: string;
    email: string;
    password: string;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
