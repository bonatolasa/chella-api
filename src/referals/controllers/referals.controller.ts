import { Controller, Get, Req } from "@nestjs/common";
import { ReferralService } from "../services/referals.service";
import { JwtAuthGuard } from "src/commons/guards/jwtauth.guard";

@Controller('referrals')
export class ReferralsController{
    constructor(
        private readonly referralService:ReferralService
    ){}

    @JwtAuthGuard()
    @Get('/my-referrer')
    async getMyReferrer(@Req() req :any){
        const result=await this.referralService.getMyReferrer(req.user)
        return result
    }

    @JwtAuthGuard()
   @Get('/referred-users')
    async getMyReferredUsers(@Req() req :any){
        const result=await this.referralService.getMyReferredUsers(req.user)
        return result
    }
}

