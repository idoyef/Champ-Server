import { BaseDbEntity } from '../../../../common/mongo/baseDbEntity';
import { Coin } from '../coin';

export type DbCoin = Coin & BaseDbEntity;
