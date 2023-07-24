import { CreateMatchChallengeRequest } from '../../../matches/models/requests/createMatchChallengeRequest';
import { TournamentType } from '../../enums/TournamentType';

export interface CreateTournamentRequest {
  type: TournamentType;
  participantIds: string[];
  matchChallenges: CreateMatchChallengeRequest[];
  completionScore?: number;
  bet: number;
}
