import { BaseDbEntity } from '../../../../common/mongo/baseDbEntity';
import { User } from '../user';

export type DbUser = User & BaseDbEntity;
