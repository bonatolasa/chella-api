import { Controller, Get, Patch } from "@nestjs/common";
import { TasksService } from "../services/tasks.service";
import { request } from "http";

@Controller('tasks')
export class TasksController{
    constructor(
        private readonly tasksService:TasksService
    ){}

    @Get('get-daily-tasks')
    async getDailyTasks(){
        const  result=await this.tasksService.getDailyTasks()
        return result
    }

    @Patch('complete-daily-tasks')
    async completeDailyTasks(){
        const result=await this.tasksService.completeTask(request['userId'],request['taskId'])
        return result
    }

    @Get('get-user-tasks')
    async getUserTasks(){
        const result=await this.tasksService.getUserCompletedTasks(request['userId'])
        return result
    }
}