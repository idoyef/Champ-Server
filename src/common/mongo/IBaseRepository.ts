export interface IBaseRepository<T> {
  insert(item: Partial<T>): Promise<T>;
  findById(id: string): Promise<T>;
  findOneWithQuery(query: any): Promise<T>;
  findManyWithQuery(query: any): Promise<any>;
  findAll(): Promise<any>;
  updateWithSetById(id: string, item: Partial<T>): Promise<any>;
  upsertOneWithQuery(query: any, item: Partial<T>, options?: any): Promise<T>;
  aggregate(pipeline: []): Promise<any>;
  deleteOneWithQuery(query: any): Promise<T>;
}
