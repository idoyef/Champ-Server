import { ParticipantsScore } from './participantsScore';
import { TournamentType } from '../enums/tournamentType';
import { TournamentStatus } from '../enums/tournamentStatus';
import { TournamentMatchChallenge } from './tournamentMatchChallenge';

export class Tournament {
  id!: string;
  version: number = 0;
  createdAt!: Date;
  updatedAt!: Date;

  type!: TournamentType;
  matchChallenges!: TournamentMatchChallenge[];
  participantIds!: string[];
  totalParticipantsScore!: ParticipantsScore;
  // matchIds!: string[];
  // matchChallenges!: MatchChallenge[];
  status!: TournamentStatus;

  constructor(fields?: {
    type: TournamentType;
    matchChallenges: TournamentMatchChallenge[];
    participantIds: string[];
    totalParticipantsScore: ParticipantsScore;
    // matchIds: string[];
    // matchChallenges: MatchChallenge[];
    status: TournamentStatus;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
