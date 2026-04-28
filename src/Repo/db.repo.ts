import type {
  CreateOptions,
  Model,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  Types,
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
}

export default DBRepo;