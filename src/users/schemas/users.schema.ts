import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({timestamps:true})
export class User extends Document{
    @Prop()
    fullName: string;

     @Prop({ unique: true })
    username: string;

     @Prop()
    password: string;

     @Prop()
    refferedBy: string;

     @Prop()
    referralCode: string; 

    @Prop()
    amount: number;
     @Prop()
    totalEarned: number;
     @Prop()
    totalReffered: number;

}

export const userSchema = SchemaFactory.createForClass(User)

//SchemaFactory.createForClass()= turns it into a real 
// Mongoose schema that can talk to the database