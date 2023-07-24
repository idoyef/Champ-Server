import { BaseRepository } from '../../common/mongo/mongooseWrapperRepository';
import { DbTournament } from './models/db/dbTournamentBase';
import { tournamentSchema } from './schemas/tournamentSchema';

export class TournamentRepository extends BaseRepository<DbTournament> {
  constructor() {
    super('Tournament', tournamentSchema);
  }
}
