export interface IBaseRepository<T> {
  insert(item: Partial<T>): Promise<T>;
  findById(id: string): Promise<T>;
}
