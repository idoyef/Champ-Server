import { SoccerGoalScoreDetails } from '../soccer/soccerGoalScoreDetails';
import { SoccerMatchEndDetails } from '../soccer/soccerMatchEndDetails';
import { SoccerMatchHalfTimeDetails } from '../soccer/soccerMatchHalfTimeDetails';

export type TriggeredEventDetails = SoccerGoalScoreDetails | SoccerMatchEndDetails | SoccerMatchHalfTimeDetails;
