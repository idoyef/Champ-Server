import { SportType } from '../../../common/enums/sportType';
import { ParticipantsScore } from '../../tournaments/models/participantsScore';
import { MatchStatus } from '../enums/matchStatus';

export interface Match {
  type: SportType;
  status: MatchStatus;
  tournamentIds: string[];
  matchId: string;
  challengesResolved: boolean;
  participantScore: ParticipantsScore;
}
