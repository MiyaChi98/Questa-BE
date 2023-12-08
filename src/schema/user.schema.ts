import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  userId: number;
  @Prop() 
  name: string;
  @Prop() 
  email: string;
  @Prop() 
  password: string;
  @Prop() 
  phone: string;
  @Prop()
  zone: string
  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);