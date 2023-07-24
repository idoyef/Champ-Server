import { SportType } from '../../../common/enums/sportType';
import { basketballChallengeHandler } from './basketballChallengeHandler';
import { soccerChallengeHandler } from './soccerChallenge/soccerChallengeHandler';

export const handlersMapping = {
  [SportType.Soccer]: soccerChallengeHandler,
  [SportType.Basketball]: basketballChallengeHandler,
};
