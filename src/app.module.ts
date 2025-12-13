import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReferalsModule } from './referals/referals.module';
import { TasksModule } from './tasks/tasks.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ExchangeRatesModule } from './exchange-rates/exchange-rates.module';
import { CommonsModule } from './commons/commons.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from './commons/guards/jwt_strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    MongooseModule.forRoot(process.env.MONGO_URL || ""),
    UsersModule, ReferalsModule, TasksModule, TransactionsModule, ExchangeRatesModule, CommonsModule],
  controllers: [AppController],
  providers: [AppService,JwtStrategy],
})
export class AppModule {}
