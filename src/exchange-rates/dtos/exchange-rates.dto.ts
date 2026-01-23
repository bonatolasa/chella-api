import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RatesConversionDto{
    @IsNotEmpty()
    @IsNumber()
    amount: number; 

    @IsEnum(["USD","EUR","ETB"], {message:"Base currency must be USD, EUR, or ETB"})
    @IsString()
    fromCurrency: string;

    @IsEnum(["USD","EUR","ETB"], {message:"Target currency must be USD, EUR, or ETB"})
    @IsString()
    toCurrency:string
}