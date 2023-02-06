import { QueryMetadata } from './queryMetadata';

export class QueryResponse<T> {
  metadata!: QueryMetadata;
  data!: T[];

  constructor(fields?: { metadata: QueryMetadata; data: T[] }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
