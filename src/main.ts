import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { serveReactMiddleware } from './middleware/serve-react.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors();

  // Set a global prefix for API routes
  app.setGlobalPrefix('api');

  // Serve static files from the React build directory
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Use a catch-all route to serve the React app's index.html file
  app.use(serveReactMiddleware);


  await app.listen(80);
}
bootstrap();
