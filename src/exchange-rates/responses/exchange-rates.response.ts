export class ExchangeRatesResponse {
  base: string;
  date: string;
  rates: {
    USD: number;
    EUR: number;
    ETB: number;
  };
}
