import { Schema, model, Model } from 'mongoose';
import { DbCrudException, ErrorReason } from '../../utils/errorHandler';
import { SortOrder } from '../enums/sortOrder';
import { QueryMetadata } from '../models/queryMetadata';
import { QueryResponse } from '../models/queryResponse';
import { IBaseRepository } from './IBaseRepository';

export class BaseRepository<T> implements IBaseRepository<T> {
  private dbModel: Model<any>;

  constructor(private collectionName: string, private schema: Schema) {
    this.dbModel = model(this.collectionName, this.schema);
  }

  async insert(item: T): Promise<T> {
    return await this.dbModel
      .create(item)
      .then(async (response: any) => {
        const result = response.toObject();
        if (result?._id) {
          result._id = result._id.toString();
        }
        return result;
      })
      .catch((error) => {
        throw new DbCrudException(
          'dbRepository',
          '',
          this.collectionName,
          new ErrorReason('db error', 'create new entity failed')
        );
      });
  }

  async insertMany(items: T[]): Promise<T[]> {
    const dbModel = model(this.collectionName, this.schema);
    return await dbModel
      .insertMany(items)
      .then((response: any) => response.map((x: any) => x.toObject()))
      .catch((error) => {
        throw new DbCrudException(
          'dbRepository',
          '',
          this.collectionName,
          new ErrorReason('db error', 'create new entity failed')
        );
      });
  }

  async findById(id: string): Promise<T> {
    return await this.dbModel
      .findById({ _id: id })
      .then(async (response: any) => {
        if (response) {
          const result = response?.toObject();
          if (result?._id) {
            result._id = result._id.toString();
          }
          return result;
        }
      })
      .catch((error: any) => {
        throw new DbCrudException(
          'dbRepository',
          id,
          this.collectionName,
          new ErrorReason('db error', `entity was not found. id: ${id}`)
        );
      });
  }

  async findOneWithQuery(query: any): Promise<T> {
    return await this.dbModel
      .findOne(query)
      .then(async (response: any) => {
        const result = response?.toObject();
        if (result?._id) {
          result._id = result._id.toString();
        }
        return result;
      })
      .catch((error: any) => {
        throw new DbCrudException(
          'dbRepository',
          '',
          this.collectionName,
          new ErrorReason(
            'db error',
            `entity was not found. query: ${JSON.stringify(query)}`
          )
        );
      });
  }

  async findManyWithQuery(query: any): Promise<any> {
    const paging = query.paging ?? { pageSize: 100, page: 1 };
    const { limit, skip } = this.getPagingInfo(paging);
    const sortBy = this.getSortList(query.sortBy);

    return await this.dbModel
      .find(query)
      .limit(limit)
      .skip(skip)
      .sort(sortBy)
      .then(async (response: any) => {
        const metadata = new QueryMetadata(
          paging.page,
          paging.pageSize,
          response.length
        );
        return new QueryResponse<T>({
          metadata,
          data: response.map((x: any) => {
            const result = x?.toObject();
            if (result?._id) {
              result._id = result._id.toString();
            }
            return result;
          }),
        });
      })
      .catch((error: any) => {
        throw new DbCrudException(
          'dbRepository',
          '',
          this.collectionName,
          new ErrorReason(
            'db error',
            `entity was not found. query: ${JSON.stringify(query)}`
          )
        );
      });
  }

  async findAll(): Promise<any> {
    return await this.dbModel
      .find()
      .then(async (response: any) =>
        response.map((x: any) => {
          const result = x?.toObject();
          if (result?._id) {
            result._id = result._id.toString();
          }
          return result;
        })
      )
      .catch((error: any) => {
        throw new DbCrudException(
          'dbRepository',
          '',
          this.collectionName,
          new ErrorReason('db error', `entity was not found.`)
        );
      });
  }

  async updateWithSetById(id: string, item: Partial<T>): Promise<any> {
    return await this.dbModel
      .findByIdAndUpdate(id, { $set: item }, { new: true })
      .then(async (response: any) => {
        const result = response?.toObject();
        if (result?._id) {
          result._id = result._id.toString();
        }
        return result;
      })
      .catch((error: any) => {
        throw new DbCrudException(
          'dbRepository',
          '',
          this.collectionName,
          new ErrorReason('db error', `update entity failed. id: ${id}`)
        );
      });
  }

  async updateById(id: string, item: Partial<T>): Promise<any> {
    return await this.dbModel
      .findByIdAndUpdate(id, item, { new: true })
      .then(async (response: any) => {
        const result = response?.toObject();
        if (result?._id) {
          result._id = result._id.toString();
        }
        return result;
      })
      .catch((error: any) => {
        throw new DbCrudException(
          'dbRepository',
          '',
          this.collectionName,
          new ErrorReason('db error', `update entity failed. id: ${id}`)
        );
      });
  }

  async upsertOneWithQuery(
    query: any,
    item: Partial<T>,
    options?: any
  ): Promise<T> {
    return await this.dbModel
      .findOneAndUpdate(query, { $set: item }, { new: true, ...options })
      .then(async (response: any) => {
        const result = response?.toObject();
        if (result?._id) {
          result._id = result._id.toString();
        }
        return result;
      })
      .catch((error: any) => {
        throw new DbCrudException(
          'dbRepository',
          '',
          this.collectionName,
          new ErrorReason(
            'db error',
            `upsert entity failed. query: ${JSON.stringify(query)}`
          )
        );
      });
  }

  async aggregate(pipeline: []): Promise<any> {
    return await this.dbModel
      .aggregate(pipeline)
      .then(async (response: any) => response)
      .catch((error: any) => {
        throw new DbCrudException(
          'dbRepository',
          '',
          this.collectionName,
          new ErrorReason(
            'db error',
            `aggregation failed. pipeline: ${pipeline.join(' ,')}`
          )
        );
      });
  }

  async deleteOneWithQuery(query: any): Promise<T> {
    return await this.dbModel
      .deleteOne(query)
      .then(async (response: any) => response)
      .catch((error: any) => {
        throw new DbCrudException(
          'dbRepository',
          '',
          this.collectionName,
          new ErrorReason(
            'db error',
            `entity was not found. query: ${JSON.stringify(query)}`
          )
        );
      });
  }

  async replaceOneWithQuery(query: any, item: any): Promise<any> {
    const dbModel = model(this.collectionName, this.schema);
    return await dbModel
      .replaceOne(query, item)
      .then(async (response: any) => {
        const result = response?.toObject();
        if (result?._id) {
          result._id = result._id.toString();
        }
        return result;
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  private getPagingInfo(paging: any) {
    const limit = paging.pageSize;
    const skip = limit * (paging.page - 1);

    return { limit, skip };
  }

  private getSortList(sortBy: any) {
    const sortList: any = {};

    if (!sortBy || !Array.isArray(sortBy)) {
      return sortList;
    }

    for (const sortElement of sortBy) {
      sortList[sortElement.fieldName] =
        sortElement.sortOrder === SortOrder.Asc ? 1 : -1;
    }

    return sortList;
  }
}
