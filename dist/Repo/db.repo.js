class DBRepo {
    model;
    constructor(model) {
        this.model = model;
    }
    async create({ data, options, }) {
        return await this.model.create(data, options);
    }
    async findOne({ filter, projection, options, }) {
        return await this.model.findOne(filter, projection, options);
    }
    async findById({ id, projection, options, }) {
        return await this.model.findById(id, projection, options);
    }
}
export default DBRepo;
