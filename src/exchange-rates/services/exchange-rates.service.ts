import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ExchangeRate } from "../schemas/exchage-rates.schema";
import { HttpService } from "@nestjs/axios";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Model } from "mongoose";

@Injectable()
export class ExchangeRatesService{
  constructor(
    @InjectModel(ExchangeRate.name) private readonly rateModel:Model<ExchangeRate>,
    private readonly httpService:HttpService
  ){}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async sendRequestAndUpdateRates(){
    try {
      //let's send request
      const response=await this.httpService
      .axiosRef.get(`${process.env.Exchange_Rates_Api_Url}`);

      console.log("Exchange rates response",response)
      if(response.data.result==="success"){
        console.log("RESULT",response.data.results)

        const today=new Date().toISOString().split('T')[0]
        const etbToUsd=response.data.conversion_rates.USD;
        const etbToEur=response.data.conversion_rates.EUR;
        const etb=response.data.conversion_rates.ETB;
        const existingRate=await this.rateModel.findOne({exchangeDate:today})

        if(existingRate){
          console.log("Today's rate already exists")
          return
      }

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
  async getLatestExchangeRate(){
    const latestRate=await this.rateModel
    .findOne()
    .sort({exchangeDate:-1})
    .exec();
    return latestRate;
  }
}
