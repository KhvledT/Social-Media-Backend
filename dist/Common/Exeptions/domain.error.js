import CustomErorr from "./custom.error.js";
export class BadRequest extends CustomErorr {
    constructor(message = "Bad Request", cause) {
        super(message, 400, cause);
    }
}
export class Unauthorized extends CustomErorr {
    constructor(message = "Unauthorized", cause) {
        super(message, 401, cause);
    }
}
export class NotFound extends CustomErorr {
    constructor(message = "Not Found", cause) {
        super(message, 404, cause);
    }
}
export class Conflict extends CustomErorr {
    constructor(message = "Conflict", cause) {
        super(message, 409, cause);
    }
}
