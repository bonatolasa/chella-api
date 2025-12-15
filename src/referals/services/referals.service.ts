import { BadRequestException, Injectable } from "@nestjs/common";
import { Referral } from "../schemas/referrals.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class ReferralService{
    constructor(
        @InjectModel(Referral.name)
        private readonly referralModel:Model<Referral>
    ){}

    async createReferralTracking(
        referrerId:string,
        referredUserId:string
    ){

        //1. prevent self-referral
        if(referrerId===referredUserId){
            throw new BadRequestException("you cannot refer yourself")
        }

        //2. let's use exist() to prevent duplicates
        const refExists=await this.referralModel.exists({
            referredUserId:referredUserId
        })

        if(refExists){
            throw new BadRequestException("this user has already been referred by someone")
        }

        const referral=await this.referralModel.create({
            referrerId:referrerId,
            referredUserId:referredUserId
        })

        return referral.save()
    }
}
