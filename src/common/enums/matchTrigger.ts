export interface MatchTrigger<T> {
  type: T;
  payload: any; // update according to triggers payload
}

export enum SoccerMatchTrigger {
  MATCH_STARTED = 'MATCH_STARTED',
  UPDATE_SCORE = 'UPDATE_SCORE', // goals, scorer, assister
  RED_CARD = 'RED_CARD',
  CORNER = 'CORNER',
  FIRST_HALF_FINISHED = 'FIRST_HALF_FINISHED', // goals
  MATCH_FINISHED_IN_REGULAR_TIME = 'MATCH_FINISHED_IN_REGULAR_TIME', // goals, scorers, assisters
  MATCH_FINISHED_AFTER_EXTRA_TIME_BEFORE_PENALTY = 'MATCH_FINISHED_AFTER_EXTRA_TIME_BEFORE_PENALTY', // goals, scorers, assisters
  MATCH_FINISHED_AFTER_PENALTY = 'MATCH_FINISHED_AFTER_PENALTY', // goals, scorers, assisters
}
