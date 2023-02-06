import { SportType } from '../../../../common/enums/sportType';
import { CreateChallengeRequest } from '../../../challenges/models/requests/createChallengeRequest';

export class CreateMatchChallengeRequest {
  matchId!: string;
  matchType!: SportType;
  challenges!: CreateChallengeRequest[];

  constructor(fields?: {
    matchId: string;
    matchType: SportType;
    challenges: CreateChallengeRequest[];
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
