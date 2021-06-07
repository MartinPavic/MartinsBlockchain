"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
class Response {
    constructor(success, data, error) {
        this.success = success;
        this.data = data;
        this.error = error;
    }
    static success(data) {
        return new Response(true, data, null);
    }
    static fail(err) {
        return new Response(false, null, err);
    }
}
exports.Response = Response;
//# sourceMappingURL=response.js.map