class CustomErorr extends Error {
    StatusCode;
    constructor(message, StatusCode, cause) {
        super(message, { cause });
        this.StatusCode = StatusCode;
        this.name = this.constructor.name;
    }
}
export default CustomErorr;
