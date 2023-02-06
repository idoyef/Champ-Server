import { SortOrder } from '../enums/sortOrder';

export class Sort {
  fieldName!: string;
  sortOrder!: SortOrder;

  constructor(fields?: { fieldName: string; sortOrder: SortOrder }) {
    if (fields) {
      this.fieldName = fields.fieldName;
      this.sortOrder =
        +fields.sortOrder === 1 || fields.sortOrder === 'Asc'
          ? SortOrder.Asc
          : SortOrder.Desc;
    }
  }
}
