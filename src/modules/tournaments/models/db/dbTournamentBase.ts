import { BaseDbEntity } from '../../../../common/mongo/baseDbEntity';
import { Tournament } from '../tournament';

export type DbTournament = Tournament & BaseDbEntity;
