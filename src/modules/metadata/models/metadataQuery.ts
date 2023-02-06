import { SportType } from '../../../common/enums/sportType';

export class MetadataQuery {
  id!: string;
  from!: Date;
  to!: Date;
  status!: string;
  type!: SportType;

  constructor(fields?: {
    id?: string;
    from?: Date;
    to?: Date;
    status?: string;
    type?: SportType;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
