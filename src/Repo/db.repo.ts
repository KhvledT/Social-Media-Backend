import type { UpdateOptions } from "mongodb";
import type {
  CreateOptions,
  HydratedDocument,
  Model,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  Types,
  UpdateQuery,
} from "mongoose";

abstract class DBRepo<T> {
  constructor(public model: Model<T>) {}

  public async create({
    data,
    options,
  }: {
    data: any;
    options?: CreateOptions;
  }) {
    return await this.model.create(data, options);
  }

  public async findOne({
    filter,
    projection,
    options,
  }: {
    filter: QueryFilter<T>;
    projection?: ProjectionType<T> | null | undefined;
    options?: QueryOptions<T>;
  }) {
    return await this.model.findOne(filter, projection, options);
  }

  public async findOneAndUpdate({
    filter,
    update,
    options,
  }: {
    filter: QueryFilter<T>;
    update: UpdateQuery<T>;
    options?: QueryOptions<T>;
  }) {
    return await this.model.findOneAndUpdate(filter, update, options);
  }

  public async find({
    filter,
    projection,
    options,
  }: {
    filter: QueryFilter<T>;
    projection?: ProjectionType<T> | null | undefined;
    options?: QueryOptions<T>;
  }) {
    return await this.model.find(filter, projection, options);
  }

  public async findById({
    id,
    projection,
    options,
  }: {
    id: string | Types.ObjectId;
    projection?: ProjectionType<T> | null | undefined;
    options?: QueryOptions<T>;
  }) {
    return await this.model.findById(id, projection, options);
  }

  public async updateOne({
    filter,
    update,
    options,
  }: {
    filter: QueryFilter<T>;
    update: UpdateQuery<T>;
    options?: UpdateOptions;
  }) {
    return await this.model.updateOne(filter, update, options);
  }

  getDBDoc(data: T) {
    return new this.model(data);
  }

  async saveDBDoc(doc: HydratedDocument<T>) {
    return await doc.save();
  }

  async paginate({
    filter,
    projection,
    options,
    page = 1,
    limit = 3,
  }: {
    filter?: QueryFilter<T>;
    projection?: ProjectionType<T> | null | undefined;
    options?: QueryOptions<T>;
    page?: number;
    limit?: number;
  }) {
    const docs = await this.model
      .find(filter, projection, options)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalDocs = await this.model.countDocuments(filter);

    console.log(filter);

    return {
      docs,
      page,
      limit,
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit),
    };
  }
}

export default DBRepo;
