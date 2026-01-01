//exchange rates
//conversion rate

import { Controller, Get } from "@nestjs/common";
import { ExchangeRatesService } from "../services/exchange-rates.service";
import { JwtAuthGuard } from "src/commons/guards/jwtauth.guard";

@Controller('exchange-rates')
export class ExchangeRatesController{
  constructor(
    private readonly exchangeRatesService:ExchangeRatesService
  ){}

  @Get('latest')
  async getLatestExchangeRate(){
    return this.exchangeRatesService.getLatestExchangeRate();
  }
}