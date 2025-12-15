import { Module } from '@nestjs/common';
import { ReferralService } from './services/referals.service';
import { MongooseModule } from '@nestjs/mongoose';
import { referralSchema } from './schemas/referrals.schema';

@Module({
        imports:[
            MongooseModule.forFeature([
               {name:'Referral', schema: referralSchema}
            ])
        ],

    controllers:[],
    providers:[ReferralService]
})
export class ReferalsModule {}
