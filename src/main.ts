import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('chella-api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted:true,
      transform:true
    })
  )
  
  await app.listen(process.env.PORT ?? PORT);
}
// bootstrap();
bootstrap().then(() => 
  console.log('Our NestJS Server is running on port', process.env.PORT ?? 3000));
