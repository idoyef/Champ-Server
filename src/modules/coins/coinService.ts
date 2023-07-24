import { EventHandler } from '../../common/events/eventhandler';
import { CoinRepository } from './coinRepository';
import { CoinQuery } from './models/coinQuery';

export class CoinService {
  constructor(
    private coinRepository: CoinRepository,
    private eventHandler: EventHandler  
  ) {
    this.eventHandler.on('modifyUserCoins', async (payload) => {
      // handler
    });
  }

  async addCoins(userId:string, numberOfCoins:number) {}

  async substructCoins(userId:string, numberOfCoins:number) {}

  async getCoinsWithQuery(query: CoinQuery) {}
  
}