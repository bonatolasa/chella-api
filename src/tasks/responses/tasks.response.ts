export class TaskResponse{
    id:string;
    title?:string;
    rewardAmount?:number;
    taskDate?:Date;
}

export class UserTaskResponse{
    id:string;
    taskId?:string;
    TaskDate?:Date;
    rewardAmount?:number
}