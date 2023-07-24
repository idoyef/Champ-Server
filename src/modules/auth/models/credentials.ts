import { BaseDbEntity } from '../../../common/mongo/baseDbEntity';

export interface Credentials {
  userID: string;
  username: string;
  email: string;
  password: string;
}

export type DbCredentials = Credentials & BaseDbEntity;
