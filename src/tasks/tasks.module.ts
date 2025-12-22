import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, taskSchema, UserTask, UserTasksSchema } from './schemas/tasks.schema';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { UsersService } from 'src/users/services/users.service';
import { User, userSchema } from 'src/users/schemas/users.schema';
import { Referral, referralSchema } from 'src/referals/schemas/referrals.schema';
import { ReferralService } from 'src/referals/services/referals.service';

@Module({
      imports:[
            MongooseModule.forFeature([
               {name:Task.name, schema: taskSchema},
               {name:UserTask.name, schema: UserTasksSchema},
               {name:User.name, schema: userSchema},
               {name:Referral.name, schema:referralSchema}
               
            ])
        ], 
        controllers:[TasksController],
        providers:[
            TasksService,
            UsersService,
            ReferralService
        ]
})
export class TasksModule {}
