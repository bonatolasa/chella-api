import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './schemas/users.schema';
import { referralSchema } from 'src/referals/schemas/referrals.schema';
import { ReferralService } from 'src/referals/services/referals.service';
import { UserTasksSchema } from 'src/tasks/schemas/tasks.schema';
import { TasksService } from 'src/tasks/services/tasks.service';

@Module({
    imports:[
        MongooseModule.forFeature([
           { name:'User', schema: userSchema},
           {name:'Referral', schema: referralSchema},
        ])
    ], 
    controllers:[UsersController],
    providers:[UsersService,
        ReferralService
    ]
})
export class UsersModule {}
