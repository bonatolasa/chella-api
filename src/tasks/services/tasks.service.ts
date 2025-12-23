import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Task, UserTask } from "../schemas/tasks.schema";
import { Cron, CronExpression } from "@nestjs/schedule";
import { TaskResponse } from "../responses/tasks.response";
import { response } from "express";
import { UsersService } from "src/users/services/users.service";

@Injectable()
export class TasksService{
    constructor(
        @InjectModel(Task.name)
        private readonly taskModel:Model<Task>,
        @InjectModel(UserTask.name)
        private readonly userTaskModel:Model<UserTask>,

        private readonly userService:UsersService
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
    async completeTask(currentUser,taskId:string){
        
        //check if task exists
        const task = await this.taskModel.findById(taskId)

        if(!task){
            throw new BadRequestException("Task not found");
        }
        
        //check if user has already completed the task today
        const alreadyCompleatedExists=await this.userTaskModel.exists({
            userId:currentUser.id,
            taskId:taskId,
        })

        if(alreadyCompleatedExists){
            throw new BadRequestException("Task already completed today");
        }
        //creating new userTask instance and saving to db
        const userTask = await this.userTaskModel.create({
           userId:currentUser.id,
           taskId,
           isCompleted:true
         });

         const savedUserTask = await userTask.save()

         //updating user totalEarned amount
         const updatedUser=await this.userService.addTaskRewardToUser(currentUser.id, task.rewardAmount);

         //use intercepter and respond reward(field)
         const response:TaskResponse={
            id:task._id.toString(),
            rewardAmount:task.rewardAmount,
            isCompleted:savedUserTask.isCompleted,
            taskDate:task.taskDate
         }

      return response;
    }

    // service to fetch completed tasks by current user
  async getUserCompletedTasks(currentUser){
    //1. get user completed tasks from userTask collection
    const userTasks = await this.userTaskModel.find({ 
        userId: currentUser.id, 
        isCompleted: true });
    console.log("USER TASKS:", userTasks);

    const taskIds= userTasks.map(userTask => userTask.taskId);
    
    const tasks=await this.taskModel.find({
        _id:{$in:taskIds}
    })

    //3. preparing response
    const response:TaskResponse[]=tasks.map((task)=>({
        id:task._id.toString(),
        title:task.title,
        rewardAmount:task.rewardAmount,
        taskDate:task.taskDate,
        isCompleted:true
    }))
    return response;
  } 
}