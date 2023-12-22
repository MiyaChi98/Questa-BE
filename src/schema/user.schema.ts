import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Role } from "src/constant/roleEnum";

@Schema({ timestamps: true })
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
  zone: Role[];
  @Prop({ select: false })
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
