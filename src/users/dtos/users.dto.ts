import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    fullName:string;
    @IsString()
    username:string;
    @IsString()
    password:string;
    @IsOptional()
    @IsString()
    refferedBy:string
}

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    fullName:string;
    @IsString()
    @IsOptional()
    username:string;
}

export class UserLoginDto{
    @IsString()
    @IsNotEmpty()
    username:string;
    @IsString()
    password:string;
}