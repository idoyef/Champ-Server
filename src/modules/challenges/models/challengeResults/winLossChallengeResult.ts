import { WinLossResultOptions } from '../../enums/winLossResultOptions';

export class WinLossChallengeResult {
  matchWinner!: WinLossResultOptions;

  constructor(fields?: { matchWinner: WinLossResultOptions }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
