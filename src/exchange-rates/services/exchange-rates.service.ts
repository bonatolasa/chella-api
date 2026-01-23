import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ExchangeRate } from "../schemas/exchage-rates.schema";
import { HttpService } from "@nestjs/axios";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Model } from "mongoose";
import { ConversionResponse, ExchangeRatesResponse } from "../responses/exchange-rates.response";
import { RatesConversionDto } from "../dtos/exchange-rates.dto";

@Injectable()
export class ExchangeRatesService{
  constructor(
    @InjectModel(ExchangeRate.name) private readonly rateModel:Model<ExchangeRate>,
    private readonly httpService:HttpService
  ){}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async sendRequestAndUpdateRates(){
    try {
       const today=new Date().toISOString().split('T')[0]
       const existingRate=await this.rateModel.findOne({exchangeDate:today})

        if(existingRate){
          console.log("Today's rate already exists")
          return
      }
      //let's send request
      const response=await this.httpService
      .axiosRef.get(`${process.env.Exchange_Rates_Api_Url}`);

      console.log("Exchange rates response",response)
      if(response.data.result==="success"){
        console.log("RESULT",response.data.results)

      
        const etbToUsd=response.data.conversion_rates.USD;
        const etbToEur=response.data.conversion_rates.EUR;
        const etb=response.data.conversion_rates.ETB;



      //if not create new rate for today
      const newRate=await this.rateModel.create({
        usdRate:etbToUsd,
        eurRate:etbToEur,
        etbRate:etb,
        exchangeDate:today
      })

      await newRate.save()
    } 
  }catch (error) {
      console.log(error)
      throw new Error("Failed to fetch and update exchange rates")
    }
  }

  //get latest exchange rate
 async getTodayExchangeRate() {
  const today=new Date().toISOString().split('T')[0]

  const todayRate = await this.rateModel
    .findOne({ exchangeDate: today })

  if (!todayRate) {
    throw new Error("No exchange rate data found");
  }

const response: ExchangeRatesResponse = {
    id: todayRate._id.toString(),
    usdRate: todayRate.usdRate,
    eurRate: todayRate.eurRate,
    etbRate: todayRate.etbRate,
    exchangeDate: todayRate.exchangeDate,
  };

  return response;
}

//service conversion
async currencyConversion(rateConversionDto:RatesConversionDto){
  //1.fetching today exchange rate
  const todayRate=await this.getTodayExchangeRate();

  let convertedAmount:number;

  //same currency
  if(rateConversionDto.fromCurrency===rateConversionDto.toCurrency){
    convertedAmount=rateConversionDto.amount;
  }
  //etb-usd
  else if(rateConversionDto.fromCurrency==="ETB" && rateConversionDto.toCurrency==="USD"){
    convertedAmount=rateConversionDto.amount * todayRate.usdRate;
  }
  //etb-eur
  else if(rateConversionDto.fromCurrency==="ETB" && rateConversionDto.toCurrency==="EUR"){
    convertedAmount=rateConversionDto.amount * todayRate.eurRate;
  }
  else{
    throw new BadRequestException("Unsupported currency conversion")
  }

  const response:ConversionResponse={
    fromCurrency:rateConversionDto.fromCurrency,
    toCurrency:rateConversionDto.toCurrency,
    amount:convertedAmount
  }
  return response
}

}
