import { MongooseOperator } from './enums/mongooseOperator';

export const toMongooseQuery = (
  query: any,
  operator: MongooseOperator
): object => {
  let params: any = [];

  for (var key of Object.keys(query)) {
    var param: any = {};
    param[key] = query[key];
    params.push(param);
  }

  return { [operator]: params };
};
