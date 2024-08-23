"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const serve_react_middleware_1 = require("./middleware/serve-react.middleware");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.setGlobalPrefix('api');
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    app.use(serve_react_middleware_1.serveReactMiddleware);
    await app.listen(process.env.PORT || 80);
}
bootstrap();
//# sourceMappingURL=main.js.map