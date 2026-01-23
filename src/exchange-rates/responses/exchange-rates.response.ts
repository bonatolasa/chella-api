export class ExchangeRatesResponse {
id: string;
usdRate: number;
eurRate: number;
etbRate: number;
exchangeDate: Date;
}

export class ConversionResponse{
  fromCurrency:string;
  toCurrency:string;
  amount:number;
}
