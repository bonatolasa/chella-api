import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema, UserTasksSchema } from './schemas/tasks.schema';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';

@Module({
      imports:[
            MongooseModule.forFeature([
               { name:'Task', schema: TaskSchema},
               {name:'UserTask', schema: UserTasksSchema}
            ])
        ], 
        controllers:[TasksController],
        providers:[TasksService]
})
export class TasksModule {}
