import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Task, UserTask } from "../schemas/tasks.schema";
import { Cron, CronExpression } from "@nestjs/schedule";
import { TaskResponse, UserTaskResponse } from "../responses/tasks.response";
import { response } from "express";

@Injectable()
export class TasksService{
    constructor(
        @InjectModel(Task.name)
        private readonly taskModel:Model<Task>,
        @InjectModel(UserTask.name)
        private readonly userTaskModel:Model<UserTask>
    ){}

    //Background job to create daily tasks
    @Cron(CronExpression.EVERY_10_MINUTES)
    async createDailyTasks(){
        console.log("HEY WE ARE RUNNING THE CRON EVERY 10 MINUTES")
        const today=new Date().toISOString().split('T')[0];

        //1. count today's tasks
        const taskCount=await this.taskModel.countDocuments({taskDate:today})

        if(taskCount>=5){
            console.log("Today's tasks are already created");
            return;
        }

        //2. let's manage incase of server down and create only missing tasks
        const tasksToCreate=5- taskCount

        //3. create tasks
        for(let i=0;i<tasksToCreate;i++){
            const newTask=new this.taskModel({
                title:`Daily Task ${taskCount + i + 1}`,
                rewardAmount:10,
                taskDate:today
            });
            await newTask.save();
        }
        console.log(`${tasksToCreate} tasks created for today ${today}`);
    }

    //fetch daily tasks
    async getDailyTasks(){
        const today=new Date().toISOString().split('T')[0]

        const todayTasks=await this.taskModel.find({
            taskDate:today
        })

        const response:TaskResponse[]=todayTasks.map(task=>({
            id:task._id.toString(),
            title:task.title,
            rewardAmount:task.rewardAmount,
            taskDate:task.taskDate
        }))
        return response
    }

    //update completed tasks
    async completeTask(userId:string,taskId:string){
        
        //check if task exists
        const task = await this.taskModel.findById(taskId)

        if(!task){
            throw new BadRequestException("Task not found");
        }
        
        //check if user has already completed the task today
        const today=new Date().toISOString().split('T')[0]
        const existingUserTask=await this.userTaskModel.findOne({
            userId,
            taskId,
            taskDate:today
        })

        if(existingUserTask){
            throw new BadRequestException("Task already completed today");
        }

        //mark task as completed
        const userTask=new this.userTaskModel({
            userId,
            taskId,
            taskDate:today,
            rewardAmount:task.rewardAmount
        })
        await userTask.save()
    }

    // fetch completed tasks for a user
    async getUserCompletedTasks(userId:string){

         const userTasks=await this.userTaskModel.find({userId})

         const response:UserTaskResponse[]=userTasks.map(userTask=>({
            id:userTask._id.toString(),
            taskId:userTask.taskId,
        }))
        return response
    }
}