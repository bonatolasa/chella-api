import { Body, Controller, Get, Param, Patch, Post, Put, Req } from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { CreateUserDto, UpdateUserDto, UserLoginDto } from "../dtos/users.dto";
import { JwtAuthGuard } from "src/commons/guards/jwtauth.guard";

@Controller('users')
export class UsersController{

    constructor(
        private readonly userService: UsersService
    ){}

    @Post('/register')
    async createUser(@Body()createUserDto: CreateUserDto){
        const result = await this.userService.registerUser(createUserDto);
        return result;

 
    }

    @Patch('/update-profile/:id')
     async updateProfile(
         @Param('id') id:string,
         @Body() updateUserDto:UpdateUserDto,
     ){
         const result = await this.userService.updateUser(id,updateUserDto);
         return result;
     }

     //controller to get user profile
    @Get('/get-profile/:id')
     async getUserProfile(@Param('id') id:string){
        const result =await this.userService.getUserProfile(id);
        return result;
     }

     // controller to fetch all users
     @JwtAuthGuard()
     @Get('/get-all-users')
     async getAllUsers(@Req() req:any){

        console.log("method:",req.method)
        console.log("url:",req.url)
        console.log("headers:",req.headers)
        console.log("user:",req.user)
        console.log("timestamp:",new Date().toISOString())
        console.log("query params:",req.query)
        console.log("body:",req.body)
        console.log("params:",req.params)
        console.log("ip:",req.ip)
        console.log("protocol:",req.protocol)

        const result = await this.userService.getAllUsers();
        return result;
     }

     //login controller
     @Post('/login')
        async loginUser(@Body() userLoginDto:UserLoginDto){
            const result = await this.userService.loginUser(userLoginDto)
            return result;
        }

        //get my referral code
        @JwtAuthGuard()
        @Get('/get-Myreferral-code')
        async getMyRefferalCode(@Req() req:any){
            const currentUser=req.user;
            const result = await this.userService.getMyRefferalCode(currentUser)
            return result;
        }
}