import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto, UserLoginDto} from "../dtos/users.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User, userSchema } from "../schemas/users.schema";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt';
import { CommonUtils } from "src/commons/utils";
import { UserResponse } from "../responses/users.response";
import { access } from "fs";
import { Referral } from "src/referals/schemas/referrals.schema";
import { ReferralService } from "src/referals/services/referals.service";

@Injectable()
export class UsersService{
    constructor(
       @InjectModel(User.name)
        private readonly userModel: Model<User>,

        private readonly referralService: ReferralService,
    ){}

    async registerUser(createUserDto:CreateUserDto){
        //user registration logic will go here
        console.log("Coming request body", createUserDto);
        //1. check if user exists with provided username
        const existingName= await this.userModel.findOne({username:createUserDto.username.toLowerCase()})

        console.log("Existing user with provided username", existingName);

        if(existingName){
            throw new BadRequestException("Username already taken, please choose another one");
        }

        let referringUser=null as any;

        if(createUserDto.refferedBy){
            referringUser=await this.userModel.findOne({referralCode:createUserDto.refferedBy})

            if(!referringUser){
                throw new BadRequestException("Invalid referral code")
            }
        }

        //2 Hash the password
        const hashedpwd=await bcrypt.hash(createUserDto.password,10);

        //3 generate refferal
        const referalCode=CommonUtils.generateReferralCode();

        // //! we will implement a code to increase amount for reffering users
        // if(createUserDto.refferedBy){
        //     const referringUser=await this.userModel.findOne({referralCode:createUserDto.refferedBy})

        //     if(referringUser){
        //         await this.userModel.findByIdAndUpdate(referringUser._id,{
        //             totalEarned:referringUser.totalEarned + 20,
        //             amount:referringUser.amount+ 20,
        //             totalReffered:referringUser.totalReffered+1
        //         })
        //     }
        // }

        //4 prepare an instance to save on db
        const newUser = new this.userModel({
            fullName:createUserDto.fullName,
            username:createUserDto.username,
            password:hashedpwd,
            referralCode:referalCode,
            refferedBy:createUserDto.refferedBy || null,
            amount:100,
            totalEarned:100,
            totalReffered:0
        })
        // 5 save to db
        const savedUser=await newUser.save()
        // console.log("Saved user", savedUser);

        //! we will implement a code to increase amount for reffering users
        if(referringUser){
            await this.referralService.createReferralTracking(
                referringUser._id.toString(),
                savedUser._id.toString()
            )

            await this.userModel.findByIdAndUpdate(referringUser._id,{
                totalEarned:referringUser.totalEarned + 20,
                amount:referringUser.amount+20,
                totalReffered:referringUser.totalReffered+1
            })
        }

        //6. map to our user reponse intercepter
        const UserResponse:UserResponse={
            id:savedUser._id.toString(),
            fullName:savedUser.fullName,
            username:savedUser.username,
            referalCode:savedUser.referralCode,
            referredBy:savedUser.refferedBy,
            amount:savedUser.amount,
            totalEarned:savedUser.totalEarned,
            totalReffered:savedUser.totalReffered
        }

        return UserResponse;
        
    }
       //UPDATE USER SERVICE
    async updateUser(id:string, updateUserDto:UpdateUserDto){
            //1 checking a user on table
            const user=await this.userModel.findById(id)

            if(!user){
                throw new BadRequestException("User not found with this id")
            }

            //2. preparing things
            if(updateUserDto.fullName){
                user.fullName=updateUserDto.fullName
            }

            if(updateUserDto.username){
                //checking if user exists with provided username
                const existingUserName=await this.userModel.findOne({username:updateUserDto.username.toLowerCase()})

                if(existingUserName && existingUserName.username !== user.username){
                    throw new BadRequestException("Username alredy taken ")
                }
                user.username=updateUserDto.username.toLowerCase()
            }

            //saving to database
            const updatedUser = await user.save();


            // using our response intercepter
            const userResponse:UserResponse={
            id:updatedUser._id.toString(),
            fullName:updatedUser.fullName,
            username:updatedUser.username,
            referalCode:updatedUser.referralCode,
            referredBy:updatedUser.refferedBy,
            amount:updatedUser.amount,
            totalEarned:updatedUser.totalEarned,
            totalReffered:updatedUser.totalReffered
        }
        return userResponse;

    } 
        
  //GET A SINGLE  USER PROFILE
   async getUserProfile(id:string){
    const user = await this.userModel.findById(id);

    if(!user){
        throw new BadRequestException("User not found with this id");
    }
    //if user exists
    const userResponse:UserResponse={
        id:user._id.toString(),
        fullName:user.fullName,
        username:user.username,
        referalCode:user.referralCode,
        referredBy:user.refferedBy,
        amount:user.amount,
        totalEarned:user.totalEarned,
        totalReffered:user.totalReffered
    }
    return userResponse;
  }

  //Get all users
  async getAllUsers(){
    // fetching all users from db
    const users = await this.userModel.find();

    // if no users found, return an empty array
    if(!users|| users.length===0){
        return [];
    }
    // using our response intercepter
    const userResponses:UserResponse[]=users.map(user=> ({
        id: user._id.toString(),
        fullName:user.fullName,
        username:user.username,
        referalCode:user.referralCode,
        referredBy:user.refferedBy,
        amount:user.amount,
        totalEarned:user.totalEarned,
        totalReffered:user.totalReffered
    }))
    return userResponses;
  }

  // USRER LOGIN SERVICE
  async loginUser(userLoginDto:UserLoginDto){
    //1 check if a user exists
    const user=await this.userModel.findOne({
        username:userLoginDto.username.toLowerCase(),
    });

    if(!user){
        throw new BadRequestException("Invalid username ");
    }

    //password check
    const isPwdMatch = await bcrypt.compare(userLoginDto.password,user.password)
    if(!isPwdMatch){
        throw new BadRequestException("Invalid password")
    }

    //3 Generating a token for authentication user
    const jwtData={
        id:user._id.toString(),
        fullName:user.fullName,
        username:user.username

    }

    const generatedToken=CommonUtils.generateJwtToken(jwtData);
    console.log("GENERATED TOKEN", generatedToken)

    return{
        accessToken:generatedToken,
    }
  }



  //SERVICE TO FETCH MY OWN REFERRAL CODE
  async getMyRefferalCode(currentUser){
    const user = await this.userModel.findById(currentUser.id)

    if(!user){
        throw new BadRequestException("user does not exist")
    }
    const userResponse:UserResponse={
        referalCode:user.referralCode,
    }

    return userResponse
  }
  
  //SERVICE TO ADD TASK REWARD TO USER
  async addTaskRewardToUser(currentUserId:string, rewardAmount:number){
    const user = await this.userModel.findById(currentUserId)
    if(!user){
        throw new BadRequestException("User not found")
    }
    user.totalEarned += rewardAmount
    await user.save();
}

}