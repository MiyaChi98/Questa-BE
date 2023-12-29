import {
  ResponseError,
  ResponseSuccess,
} from '../types/response-data.type';
import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsInt, IsPositive, IsString } from 'class-validator';

export class ResponseSuccessDto<T> implements ResponseSuccess<T> {
  @ApiProperty({ default: 'success' })
  @Equals('success')
  type: 'success';

  @ApiProperty()
  @IsPositive()
  @IsInt()
  statusCode: number;

  @ApiProperty()
  data: T;
}

export class ResponseErrorDto implements ResponseError {
  @ApiProperty({ default: 'error' })
  @Equals('error')
  type: 'error';

  @ApiProperty()
  @IsPositive()
  @IsInt()
  statusCode: number;

  @ApiProperty()
  detail: string | object;

  @ApiProperty()
  @IsString()
  method: string;

  @ApiProperty()
  @IsString()
  path: string;
}
