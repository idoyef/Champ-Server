import { TournamentType } from '../../enums/tournamentType';
import { TournamentMatchChallenge } from '../tournamentMatchChallenge';
import { ParticipantsScore } from '../participantsScore';
import { TournamentStatus } from '../../enums/tournamentStatus';

export class DbTournamentBase {
  _id!: string;
  version: number = 0;
  createdAt!: Date;
  updatedAt!: Date;

  type!: TournamentType;
  matchChallenges!: TournamentMatchChallenge[];
  participantIds!: string[];
  totalParticipantsScore!: ParticipantsScore;
  status!: TournamentStatus;
  winnerId?: string;

  constructor(fields?: {
    type: TournamentType;
    matchChallenges: TournamentMatchChallenge[];
    participantIds: string[];
    totalParticipantsScore: ParticipantsScore;
    status: TournamentStatus;
    winnerId?: string;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
