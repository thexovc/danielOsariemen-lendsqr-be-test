import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './Exception/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply the global exception filters
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
}
bootstrap();
