"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const mongoose_1 = require("mongoose");
const errorHandler_1 = require("../../utils/errorHandler");
const sortOrder_1 = require("../enums/sortOrder");
const queryMetadata_1 = require("../models/queryMetadata");
const queryResponse_1 = require("../models/queryResponse");
class BaseRepository {
    constructor(collectionName, schema) {
        this.collectionName = collectionName;
        this.schema = schema;
        this.dbModel = mongoose_1.model(this.collectionName, this.schema);
    }
    async insert(item) {
        return await this.dbModel
            .create(item)
            .then(async (response) => {
            const result = response.toObject();
            if (result === null || result === void 0 ? void 0 : result._id) {
                result._id = result._id.toString();
            }
            return result;
        })
            .catch((error) => {
            throw new errorHandler_1.DbCrudException('dbRepository', '', this.collectionName, new errorHandler_1.ErrorReason('db error', 'create new entity failed'));
        });
    }
    async insertMany(items) {
        const dbModel = mongoose_1.model(this.collectionName, this.schema);
        return await dbModel
            .insertMany(items)
            .then((response) => response.map((x) => x.toObject()))
            .catch((error) => {
            throw new errorHandler_1.DbCrudException('dbRepository', '', this.collectionName, new errorHandler_1.ErrorReason('db error', 'create new entity failed'));
        });
    }
    async findById(id) {
        return await this.dbModel
            .findById({ _id: id })
            .then(async (response) => {
            if (response) {
                const result = response === null || response === void 0 ? void 0 : response.toObject();
                if (result === null || result === void 0 ? void 0 : result._id) {
                    result._id = result._id.toString();
                }
                return result;
            }
        })
            .catch((error) => {
            throw new errorHandler_1.DbCrudException('dbRepository', id, this.collectionName, new errorHandler_1.ErrorReason('db error', `entity was not found. id: ${id}`));
        });
    }
    async findOneWithQuery(query) {
        return await this.dbModel
            .findOne(query)
            .then(async (response) => {
            const result = response === null || response === void 0 ? void 0 : response.toObject();
            if (result === null || result === void 0 ? void 0 : result._id) {
                result._id = result._id.toString();
            }
            return result;
        })
            .catch((error) => {
            throw new errorHandler_1.DbCrudException('dbRepository', '', this.collectionName, new errorHandler_1.ErrorReason('db error', `entity was not found. query: ${JSON.stringify(query)}`));
        });
    }
    async findManyWithQuery(query) {
        var _a;
        const paging = (_a = query.paging) !== null && _a !== void 0 ? _a : { pageSize: 100, page: 1 };
        const { limit, skip } = this.getPagingInfo(paging);
        const sortBy = this.getSortList(query.sortBy);
        return await this.dbModel
            .find(query)
            .limit(limit)
            .skip(skip)
            .sort(sortBy)
            .then(async (response) => {
            const metadata = new queryMetadata_1.QueryMetadata(paging.page, paging.pageSize, response.length);
            return new queryResponse_1.QueryResponse({
                metadata,
                data: response.map((x) => {
                    const result = x === null || x === void 0 ? void 0 : x.toObject();
                    if (result === null || result === void 0 ? void 0 : result._id) {
                        result._id = result._id.toString();
                    }
                    return result;
                }),
            });
        })
            .catch((error) => {
            throw new errorHandler_1.DbCrudException('dbRepository', '', this.collectionName, new errorHandler_1.ErrorReason('db error', `entity was not found. query: ${JSON.stringify(query)}`));
        });
    }
    async findAll() {
        return await this.dbModel
            .find()
            .then(async (response) => response.map((x) => {
            const result = x === null || x === void 0 ? void 0 : x.toObject();
            if (result === null || result === void 0 ? void 0 : result._id) {
                result._id = result._id.toString();
            }
            return result;
        }))
            .catch((error) => {
            throw new errorHandler_1.DbCrudException('dbRepository', '', this.collectionName, new errorHandler_1.ErrorReason('db error', `entity was not found.`));
        });
    }
    async updateWithSetById(id, item) {
        return await this.dbModel
            .findByIdAndUpdate(id, { $set: item }, { new: true })
            .then(async (response) => {
            const result = response === null || response === void 0 ? void 0 : response.toObject();
            if (result === null || result === void 0 ? void 0 : result._id) {
                result._id = result._id.toString();
            }
            return result;
        })
            .catch((error) => {
            throw new errorHandler_1.DbCrudException('dbRepository', '', this.collectionName, new errorHandler_1.ErrorReason('db error', `update entity failed. id: ${id}`));
        });
    }
    async updateById(id, item) {
        return await this.dbModel
            .findByIdAndUpdate(id, item, { new: true })
            .then(async (response) => {
            const result = response === null || response === void 0 ? void 0 : response.toObject();
            if (result === null || result === void 0 ? void 0 : result._id) {
                result._id = result._id.toString();
            }
            return result;
        })
            .catch((error) => {
            throw new errorHandler_1.DbCrudException('dbRepository', '', this.collectionName, new errorHandler_1.ErrorReason('db error', `update entity failed. id: ${id}`));
        });
    }
    async upsertOneWithQuery(query, item, options) {
        return await this.dbModel
            .findOneAndUpdate(query, { $set: item }, Object.assign({ new: true }, options))
            .then(async (response) => {
            const result = response === null || response === void 0 ? void 0 : response.toObject();
            if (result === null || result === void 0 ? void 0 : result._id) {
                result._id = result._id.toString();
            }
            return result;
        })
            .catch((error) => {
            throw new errorHandler_1.DbCrudException('dbRepository', '', this.collectionName, new errorHandler_1.ErrorReason('db error', `upsert entity failed. query: ${JSON.stringify(query)}`));
        });
    }
    async aggregate(pipeline) {
        return await this.dbModel
            .aggregate(pipeline)
            .then(async (response) => response)
            .catch((error) => {
            throw new errorHandler_1.DbCrudException('dbRepository', '', this.collectionName, new errorHandler_1.ErrorReason('db error', `aggregation failed. pipeline: ${pipeline.join(' ,')}`));
        });
    }
    async deleteOneWithQuery(query) {
        return await this.dbModel
            .deleteOne(query)
            .then(async (response) => response)
            .catch((error) => {
            throw new errorHandler_1.DbCrudException('dbRepository', '', this.collectionName, new errorHandler_1.ErrorReason('db error', `entity was not found. query: ${JSON.stringify(query)}`));
        });
    }
    async replaceOneWithQuery(query, item) {
        const dbModel = mongoose_1.model(this.collectionName, this.schema);
        return await dbModel
            .replaceOne(query, item)
            .then(async (response) => {
            const result = response === null || response === void 0 ? void 0 : response.toObject();
            if (result === null || result === void 0 ? void 0 : result._id) {
                result._id = result._id.toString();
            }
            return result;
        })
            .catch((error) => {
            console.log(error);
        });
    }
    getPagingInfo(paging) {
        const limit = paging.pageSize;
        const skip = limit * (paging.page - 1);
        return { limit, skip };
    }
    getSortList(sortBy) {
        const sortList = {};
        if (!sortBy || !Array.isArray(sortBy)) {
            return sortList;
        }
        for (const sortElement of sortBy) {
            sortList[sortElement.fieldName] =
                sortElement.sortOrder === sortOrder_1.SortOrder.Asc ? 1 : -1;
        }
        return sortList;
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=mongooseWrapperRepository.js.map