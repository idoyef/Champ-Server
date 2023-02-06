import { CreateMatchChallengeRequest } from '../../../matchChallenges/models/requests/createMatchChallengeRequest';

export class UpdateTournamentRequest {
  id!: string;
  participantIds!: string[];
  matchChallenges!: CreateMatchChallengeRequest[];

  constructor(fields?: { id: string; participantIds: string[]; matchChallenges: CreateMatchChallengeRequest[] }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
