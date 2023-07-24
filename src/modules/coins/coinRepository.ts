import { BaseRepository } from '../../common/mongo/mongooseWrapperRepository';
import { DbCoin } from './models/db/dbCoinBase';
import { coinSchema } from './schemas/coinSchema';

export class CoinRepository extends BaseRepository<DbCoin> {
  constructor() {
    super('Coin', coinSchema);
  }
}
