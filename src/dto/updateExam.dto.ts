import { PartialType } from '@nestjs/swagger';
import { CreateExamDTO } from './createExam.dto';

export class UpdateExamDTO extends PartialType(CreateExamDTO) {}
