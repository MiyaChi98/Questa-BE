import { PartialType } from "@nestjs/swagger";
import { CreateQuizDto } from "./createQuiz.dto";

export class UpdateQuizDto extends PartialType(CreateQuizDto) {}
