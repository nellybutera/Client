import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // import these
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // // 1. Set Global Prefix (Optional, but good practice if you use '/api')
  // app.setGlobalPrefix(''); // Adjust if you use a prefix like 'api'

  // 2. add validation pipe globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  // 3. configure cors here!
  app.enableCors({
    origin: ['http://localhost:5173', '*'], // 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Important if you use cookies/sessions later (though JWT is token-based)
  });

  const config = new DocumentBuilder()
    .setTitle('Credit Jambo Client API Documentation')
    .setDescription('API documentation for the Credit Jambo Client application')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: ' AT - Auth',
        in: 'header'
      }
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: ' RT - Refresh',
        in: 'header'
      }
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// main file for the NestJS backend application
