import { Module } from '@nestjs/common';
import { ReferralService } from './services/referals.service';
import { MongooseModule } from '@nestjs/mongoose';
import { referralSchema } from './schemas/referrals.schema';
import { ReferralsController } from './controllers/referals.controller';

@Module({
        imports:[
            MongooseModule.forFeature([
               {name:'Referral', schema: referralSchema}
            ])
        ],

    controllers:[ReferralsController],
    providers:[ReferralService]
})
export class ReferalsModule {}
