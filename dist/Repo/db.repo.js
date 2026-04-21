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
}
export default DBRepo;
