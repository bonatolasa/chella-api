import { BadRequestException, Injectable } from "@nestjs/common";
import { Referral } from "../schemas/referrals.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class ReferralService{
    constructor(
        @InjectModel(Referral.name)
        private readonly referralModule:Model<Referral>
    ){}

    async createReferralTracking(
        referrrerId:string,
        referredUserId:string
    ){

        //1. prevent self-referral
        if(referrrerId===referredUserId){
            throw new BadRequestException("you cannot refer yourself")
        }

        //2. let's use existt() to prevent duplicates
        const refExists=await this.referralModule.exists({
            referredUserId:referredUserId
        })

        if(refExists){
            throw new BadRequestException("this user has already been referred by someone")
        }

        const referral=await this.referralModule.create({
            referrerId:referrrerId,
            referredUserId:referredUserId
        })

        return referral.save()
    }
}
