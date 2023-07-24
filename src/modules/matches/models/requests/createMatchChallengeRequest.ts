import { SportType } from '../../../../common/enums/sportType';
import { CreateChallengeRequest } from '../../../tournaments/models/requests/createChallengeRequest';

export interface CreateMatchChallengeRequest {
  matchId: string;
  matchType: SportType;
  challenges: CreateChallengeRequest[];
}
