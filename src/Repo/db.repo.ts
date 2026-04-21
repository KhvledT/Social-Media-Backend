import type {
  CreateOptions,
  Model,
  ProjectionType,
  QueryFilter,
  QueryOptions,
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
}

export default DBRepo;