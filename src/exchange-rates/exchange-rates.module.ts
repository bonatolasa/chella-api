import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HttpModule } from '@nestjs/axios';
import { ExchangeRate, ExchangeRateSchema } from './schemas/exchage-rates.schema';
import { ExchangeRatesService } from './services/exchange-rates.service';
import { ExchangeRatesController } from './controllers/exchange-rates.controller';



@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExchangeRate.name, schema: ExchangeRateSchema },
    ]),
    HttpModule
  ],
  controllers:[
    ExchangeRatesController
  ],
  providers:[
    ExchangeRatesService
  ],


})
export class ExchangeRatesModule {}
