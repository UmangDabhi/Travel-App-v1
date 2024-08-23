"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseHandler = responseHandler;
function responseHandler(statusCode, message, data) {
    const res = {
        status: statusCode,
        message: message,
    };
    if (data) {
        res.result = data;
    }
    return res;
}
//# sourceMappingURL=responseHandler.js.map