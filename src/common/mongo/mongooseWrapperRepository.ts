import { Schema, model, Model, Types } from 'mongoose';
import { IBaseRepository } from './IBaseRepository';

export class BaseRepository<T> implements IBaseRepository<T> {
  private dbModel: Model<any>;

  constructor(private collectionName: string, private schema: Schema) {
    this.dbModel = model(this.collectionName, this.schema);
    // // Duplicate the ID field.
    // schema.virtual('id').get(function () {
    //   return this._id.toHexString();
    // });

    // // Ensure virtual fields are serialised.
    // schema.set('toJSON', {
    //   virtuals: true,
    // });
  }

  async insert(item: Partial<T>): Promise<T> {
    const entity = new this.dbModel(item);

    return entity
      .save()
      .then((entity: any) => {
        return entity.toObject();
      })
      .catch((error: any) => {
        console.log('create new entity failed', { error }); // TBD - move to log
        throw new Error('create new entity failed');
      });
  }

  async findById(id: string): Promise<T> {
    return this.dbModel
      .findById(id)
      .then((entity: any) => {
        console.log('~~~findById', {
          entity,
          toJson: entity?.toJSON(),
          toObject: entity?.toObject(),
        });

        return entity?.toObject();
      })
      .catch((error: any) => {
        console.log('find entity by id failed', { error }); // TBD - move to log
        throw new Error('find entity by id failed');
      });
  }

  async findOneWithQuery(query: any): Promise<T> {
    return this.dbModel
      .findOne(query)
      .then((entity: any) => {
        console.log('~~~findOneWithQuery', {
          entity,
          toJson: entity?.toJSON(),
          toObject: entity?.toObject(),
        });
        return entity?.toObject();
      })
      .catch((error: any) => {
        console.log('find entity with query failed', { error }); // TBD - move to log
        throw new Error('find entity with query failed');
      });
  }

  async findManyWithQuery(query: any): Promise<T[]> {
    return this.dbModel
      .find(query)
      .then((entities: any) => {
        console.log('~~~findManyWithQuery', {
          entities,
          toJson: entities?.map((entity: any) => entity.toJSON()),
          toObject: entities?.map((entity: any) => entity.toObject()),
        });

        return entities?.map((entity: any) => entity.toObject());
      })
      .catch((error: any) => {
        console.log('find entity with query failed', { error }); // TBD - move to log
        throw new Error('find entity with query failed');
      });
  }

  async updateById(id: string, item: Partial<T>): Promise<any> {
    return this.dbModel
      .findByIdAndUpdate(id, item, { new: true })
      .then((entity: any) => entity?.toObject())
      .catch((error: any) => {
        console.log('update entity by id failed', { error }); // TBD - move to log
        throw new Error('update entity by id failed');
      });
  }

  async upsertOneWithQuery(query: any, item: Partial<T>): Promise<any> {
    return this.dbModel
      .findOneAndUpdate(query, { $set: item }, { new: true })
      .then((entity: any) => entity?.toObject())
      .catch((error: any) => {
        console.log('upsert entity with query failed', { error }); // TBD - move to log
        throw new Error('upsert entity with query failed');
      });
  }

  // async findManyWithQuery(query: any): Promise<any> {
  //   const paging = query.paging ?? { pageSize: 100, page: 1 };
  //   const { limit, skip } = this.getPagingInfo(paging);
  //   const sortBy = this.getSortList(query.sortBy);

  //   return await this.dbModel
  //     .find(query)
  //     .limit(limit)
  //     .skip(skip)
  //     .sort(sortBy)
  //     .then(async (response: any) => {
  //       const metadata = new QueryMetadata(
  //         paging.page,
  //         paging.pageSize,
  //         response.length
  //       );
  //       return new QueryResponse<T>({
  //         metadata,
  //         data: response.map((x: any) => {
  //           const result = x?.toObject();
  //           if (result?._id) {
  //             result._id = result._id.toString();
  //           }
  //           return result;
  //         }),
  //       });
  //     })
  //     .catch((error: any) => {
  //       throw new DbCrudException(
  //         'dbRepository',
  //         '',
  //         this.collectionName,
  //         new ErrorReason(
  //           'db error',
  //           `entity was not found. query: ${JSON.stringify(query)}`
  //         )
  //       );
  //     });
  // }

  // async findAll(): Promise<any> {
  //   return await this.dbModel
  //     .find()
  //     .then(async (response: any) =>
  //       response.map((x: any) => {
  //         const result = x?.toObject();
  //         if (result?._id) {
  //           result._id = result._id.toString();
  //         }
  //         return result;
  //       })
  //     )
  //     .catch((error: any) => {
  //       throw new DbCrudException(
  //         'dbRepository',
  //         '',
  //         this.collectionName,
  //         new ErrorReason('db error', `entity was not found.`)
  //       );
  //     });
  // }

  // async updateWithSetById(id: string, item: Partial<T>): Promise<any> {
  //   return await this.dbModel
  //     .findByIdAndUpdate(id, { $set: item }, { new: true })
  //     .then(async (response: any) => {
  //       const result = response?.toObject();
  //       if (result?._id) {
  //         result._id = result._id.toString();
  //       }
  //       return result;
  //     })
  //     .catch((error: any) => {
  //       throw new DbCrudException(
  //         'dbRepository',
  //         '',
  //         this.collectionName,
  //         new ErrorReason('db error', `update entity failed. id: ${id}`)
  //       );
  //     });
  // }

  // async updateById(id: string, item: Partial<T>): Promise<any> {
  //   return await this.dbModel
  //     .findByIdAndUpdate(id, item, { new: true })
  //     .then(async (response: any) => {
  //       const result = response?.toObject();
  //       if (result?._id) {
  //         result._id = result._id.toString();
  //       }
  //       return result;
  //     })
  //     .catch((error: any) => {
  //       throw new DbCrudException(
  //         'dbRepository',
  //         '',
  //         this.collectionName,
  //         new ErrorReason('db error', `update entity failed. id: ${id}`)
  //       );
  //     });
  // }

  // async upsertOneWithQuery(
  //   query: any,
  //   item: Partial<T>,
  //   options?: any
  // ): Promise<T> {
  //   return await this.dbModel
  //     .findOneAndUpdate(query, { $set: item }, { new: true, ...options })
  //     .then(async (response: any) => {
  //       const result = response?.toObject();
  //       if (result?._id) {
  //         result._id = result._id.toString();
  //       }
  //       return result;
  //     })
  //     .catch((error: any) => {
  //       throw new DbCrudException(
  //         'dbRepository',
  //         '',
  //         this.collectionName,
  //         new ErrorReason(
  //           'db error',
  //           `upsert entity failed. query: ${JSON.stringify(query)}`
  //         )
  //       );
  //     });
  // }

  // async aggregate(pipeline: []): Promise<any> {
  //   return await this.dbModel
  //     .aggregate(pipeline)
  //     .then(async (response: any) => response)
  //     .catch((error: any) => {
  //       throw new DbCrudException(
  //         'dbRepository',
  //         '',
  //         this.collectionName,
  //         new ErrorReason(
  //           'db error',
  //           `aggregation failed. pipeline: ${pipeline.join(' ,')}`
  //         )
  //       );
  //     });
  // }

  // async deleteOneWithQuery(query: any): Promise<T> {
  //   return await this.dbModel
  //     .deleteOne(query)
  //     .then(async (response: any) => response)
  //     .catch((error: any) => {
  //       throw new DbCrudException(
  //         'dbRepository',
  //         '',
  //         this.collectionName,
  //         new ErrorReason(
  //           'db error',
  //           `entity was not found. query: ${JSON.stringify(query)}`
  //         )
  //       );
  //     });
  // }

  // async replaceOneWithQuery(query: any, item: any): Promise<any> {
  //   const dbModel = model(this.collectionName, this.schema);
  //   return await dbModel
  //     .replaceOne(query, item)
  //     .then(async (response: any) => {
  //       const result = response?.toObject();
  //       if (result?._id) {
  //         result._id = result._id.toString();
  //       }
  //       return result;
  //     })
  //     .catch((error: any) => {
  //       console.log(error);
  //     });
  // }

  // private getPagingInfo(paging: any) {
  //   const limit = paging.pageSize;
  //   const skip = limit * (paging.page - 1);

  //   return { limit, skip };
  // }

  // private getSortList(sortBy: any) {
  //   const sortList: any = {};

  //   if (!sortBy || !Array.isArray(sortBy)) {
  //     return sortList;
  //   }

  //   for (const sortElement of sortBy) {
  //     sortList[sortElement.fieldName] =
  //       sortElement.sortOrder === SortOrder.Asc ? 1 : -1;
  //   }

  //   return sortList;
  // }
}
