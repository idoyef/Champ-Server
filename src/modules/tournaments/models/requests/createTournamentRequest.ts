import { TournamentType } from '../../enums/tournamentType';
import { CreateMatchChallengeRequest } from '../../../matchChallenges/models/requests/createMatchChallengeRequest';

export class CreateTournamentRequest {
  type!: TournamentType;
  participantIds!: string[];
  matchChallenges!: CreateMatchChallengeRequest[];
  completionScore?: number;

  constructor(fields?: {
    type: TournamentType;
    participantIds: string[];
    matchChallenges: CreateMatchChallengeRequest[];
    completionScore?: number;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
