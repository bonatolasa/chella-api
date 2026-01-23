import { Body, Controller, Get, Post } from "@nestjs/common";
import { ExchangeRatesService } from "../services/exchange-rates.service";
import { RatesConversionDto } from "../dtos/exchange-rates.dto";
@Controller('exchange-rates')
export class ExchangeRatesController{
  constructor(
    private readonly exchangeRatesService:ExchangeRatesService
  ){}

  @Get('today-rates')
  async getTodayExchangeRate(){
    return this.exchangeRatesService.getTodayExchangeRate();
  }

  @Post('conversion')
  async convertRates(@Body() ratesConversionDto: RatesConversionDto){
    return this.exchangeRatesService.currencyConversion(ratesConversionDto);
  }
}