import { ParticipantBet } from '../../tournaments/models/participantBet';
import { SportType } from '../../../common/enums/sportType';
import { MatchChallengeStatus } from '../enums/matchChallengeStatus';
import { ParticipantsScore } from '../../tournaments/models/participantsScore';
import { TriggeredEventType } from '../../../common/enums/triggeredEventType';

export class MatchChallenge {
  id!: string;
  matchId!: string;
  matchType!: SportType;
  // challenges!: Challenge[];
  challengeIds!: string[];
  status!: MatchChallengeStatus;
  matchParticipantsScore!: ParticipantsScore;
  // matchParticipantsScore!: ParticipantScore[];

  constructor(fields?: {
    matchId: string;
    resultTriggerType: TriggeredEventType;
    matchType: SportType;
    challengeIds: string[];
    status: MatchChallengeStatus;
    matchParticipantsScore: ParticipantsScore;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
