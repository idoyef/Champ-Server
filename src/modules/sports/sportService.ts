export interface SportService<T> {
  createMatch(match: T): Promise<T>;
  findMatchById(id: string): Promise<T>;
}
