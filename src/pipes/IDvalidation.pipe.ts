import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";

@Injectable()
export class IdValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const ObjectId = require("mongoose").Types.ObjectId;
    if (/\s/.test(value)) {
      throw new BadRequestException("The input has white space, pls check!");
    }
    if (!value || value === "undefine") {
      throw new BadRequestException(
        "The input is null or undefine, pls check!"
      );
    }

    if (ObjectId.isValid(value)) {
      if (String(new ObjectId(value)) === value) return value;
      throw new BadRequestException(
        "The input is not a valid ID in Mongo, pls check !"
      );
    }
    throw new BadRequestException(
      "The input is not a valid ID in Mongo, pls check !"
    );
  }
}
