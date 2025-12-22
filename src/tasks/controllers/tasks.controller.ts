import { Body, Controller, Get, Param, Patch, Req } from "@nestjs/common";
import { TasksService } from "../services/tasks.service";
import { request } from "http";
import { JwtAuthGuard } from "src/commons/guards/jwtauth.guard";

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

    @JwtAuthGuard()
    @Patch('complete-task/:taskId')
    async completeDailyTasks(@Req() req: any, @Param('taskId') taskId:string){
        const currentUser=req.user;
        const result=await this.tasksService.completeTask(currentUser,taskId) 
        return result
    }

    @JwtAuthGuard()
    @Get('user')
    async getUserTasks(@Req() req: any){
        const currentUser=req.user;
        const result=await this.tasksService.getUserCompletedTasks(currentUser)
        return result
    }
}