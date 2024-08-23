"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveReactMiddleware = serveReactMiddleware;
const path_1 = require("path");
function serveReactMiddleware(req, res, next) {
    if (!req.originalUrl.startsWith('/api') && !req.originalUrl.includes('.')) {
        res.sendFile((0, path_1.join)(__dirname, '../..', 'public', 'index.html'));
    }
    else {
        next();
    }
}
//# sourceMappingURL=serve-react.middleware.js.map