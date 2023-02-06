import { generalConfig } from '../../configuration';

export class Paging {
  page!: number;
  pageSize!: number;

  constructor(fields?: { page?: string; pageSize?: string }) {
    this.page =
      fields && fields.page ? +fields.page : generalConfig.defaultPageNumber;
    this.pageSize =
      fields && fields.pageSize
        ? +fields.pageSize
        : generalConfig.defaultPageSize;
  }
}
