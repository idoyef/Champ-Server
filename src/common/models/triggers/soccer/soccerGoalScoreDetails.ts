import { SoccerTeam } from '../../../../modules/sports/soccer/models/soccerTeam';
import { SoccerTime } from '../../../../modules/sports/soccer/models/soccerTime';

export class SoccerGoalScoreDetails {
  scorer!: string;
  assistant!: string;
  time!: SoccerTime;
  team!: SoccerTeam;
  isOwnGoal!: boolean;

  constructor(fields?: {
    scorer: string;
    assistant: string;
    time: SoccerTime;
    team: SoccerTeam;
    isOwnGoal: boolean;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
