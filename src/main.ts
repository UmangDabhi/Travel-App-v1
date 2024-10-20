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
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads', // Add '/uploads' as the URL prefix
  });
  console.log(join(__dirname, 'uploads'))
  // Use middleware to handle client-side routing
  app.use(serveReactMiddleware);

  await app.listen(process.env.PORT || 80);
}
bootstrap();
