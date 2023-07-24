import { BaseDbEntity } from '../../../../common/mongo/baseDbEntity';
import { Match } from '../../types/sportMatch';

export type DbMatch = Match & BaseDbEntity;
