import { BaseDbEntity } from '../../../../../common/mongo/baseDbEntity';
import { SoccerMatch } from '../soccerMatch';

export type DbSoccerMatch = SoccerMatch & BaseDbEntity;
