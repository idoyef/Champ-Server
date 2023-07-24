import { TournamentStatus } from '../enums/tournamentStatus';
import { TournamentType } from '../enums/TournamentType';
import { ParticipantsScore } from '../models/participantsScore';
// import { TournamentMatchChallenges } from './tournamentMatchChallenge';

export type Tournament = TournamentBase | FirstToScoreTournament;

export interface TournamentBase {
  type: TournamentType;
  participantIds: string[];
  totalParticipantsScore: ParticipantsScore;
  matches: TournamentMatch[];
  status: TournamentStatus;
  winnerId?: string;
  bet: number;
}

export interface FirstToScoreTournament extends TournamentBase {
  completionScore: number;
}

interface TournamentMatch {
  matchId: string;
  isResolved: boolean;
}
