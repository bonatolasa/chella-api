import { BadRequestException, Injectable } from "@nestjs/common";
import { Referral } from "../schemas/referrals.schema";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ReferredUserResponse, ReferrerResponse } from "../responses/referals.response";

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
            referrerId:new Types.ObjectId( referrerId),
            referredUserId:new Types.ObjectId(referredUserId)
        })

        return referral.save()
    }


    async getMyReferrer(currentUser){
        const referral=await this.referralModel
        .findOne({referredUserId:new Types.ObjectId(currentUser.id)})
        .populate('referrerId','username fullName createdAt')

        if(!referral){
            throw new BadRequestException("You don't have a referrer")
        }

        const referrer=referral.referrerId as any

        //use intercepter
        const referrerResponse: ReferrerResponse={
            id:referral?._id.toString(),
            referrerId:referrer?._id.toString(),
            referrerFullName:referrer?.fullName,
            referrerUsername:referrer?.username,
        }
        return referrerResponse
    }


    async getMyReferredUsers(currentUser){
        const referrals=await this.referralModel
        .find({referrerId:new Types.ObjectId(currentUser.id)})
        .populate('referredUserId','username fullName createdAt')

        if(referrals.length===0){
            return []
        }

        const referredResponse:ReferredUserResponse[]=referrals.map(referral =>{
            const referredUser=referral.referredUserId as any;
            return {
                id:referral._id.toString(),
                referredUserId:referredUser?._id.toString(),
                referredUserFullName:referredUser?.fullName,
                referredUsername:referredUser?.username,
            }
        })
        return referredResponse
    }
}
