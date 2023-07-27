import { CoinRepository } from './coinRepository';
import { CoinQuery } from './models/coinQuery';

export class CoinService {
  constructor(private coinRepository: CoinRepository) {}

  async getCoinsByUserId(userId: string): Promise<number | undefined> {
    return (await this.getCoinsWithQuery({ userId }))?.coins;
  }

  async addCoins(userId: string, numberOfCoins: number) {
    const userCoins = await this.getCoinsByUserId(userId);

    if (!userCoins && userCoins !== 0) {
      return await this.coinRepository.insert({ userId, coins: numberOfCoins });
    }

    return await this.coinRepository.upsertOneWithQuery(
      { userId },
      { coins: userCoins + numberOfCoins }
    );
  }

  async subtractCoins(userId: string, numberOfCoins: number) {
    const userCoins = await this.getCoinsByUserId(userId);

    if (!userCoins || userCoins - numberOfCoins < 0) {
      throw new Error('The user has insufficient number of coins'); // change to an error with number of coins in the payload
    }

    return await this.coinRepository.upsertOneWithQuery(
      { userId },
      { coins: userCoins - numberOfCoins }
    );
  }

  private async getCoinsWithQuery(query: CoinQuery) {
    return this.coinRepository.findOneWithQuery(query);
  }
}
