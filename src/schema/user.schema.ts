import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Role } from "src/constant/roleEnum";

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  phone: string;
  @Prop()
  school: string;
  @Prop()
  img: string;
  @Prop()
  zone: Role[];
  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
