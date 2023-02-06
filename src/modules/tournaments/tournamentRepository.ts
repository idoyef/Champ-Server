import { BaseRepository } from '../../common/mongo/mongooseWrapperRepository';
import { DbTournamentBase } from './models/database/dbTournamentBase';
import { tournamentSchema } from './schemas/tournamentSchema';

export class TournamentRepository extends BaseRepository<DbTournamentBase> {
  constructor() {
    super('Tournament', tournamentSchema);
  }
}
