import { SportType } from '../../../../common/enums/sportType';
import { MatchChallengeStatus } from '../../enums/matchChallengeStatus';
import { ParticipantsScore } from '../../../tournaments/models/participantsScore';
import { MatchChallengeChallenge } from '../matchChallengeChallenge';

export class DbMatchChallenge {
  _id!: string;

  matchId!: string;
  matchType!: SportType;
  challenges!: MatchChallengeChallenge[];
  status!: MatchChallengeStatus;
  matchParticipantsScore: ParticipantsScore = {};

  constructor(fields?: {
    matchId: string;
    matchType: SportType;
    challenges: MatchChallengeChallenge[];
    status: MatchChallengeStatus;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
