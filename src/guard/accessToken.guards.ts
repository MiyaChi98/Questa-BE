import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Variable } from "../variable";
import { Request } from "express";
@Injectable()

// Guard check if AT qualify or not 
export class ATGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    //Extract Token from the req
    const request = context.switchToHttp().getRequest() as unknown as Request;
    const atToken = this.extractTokenFromHeader(request);
    if (!atToken) {
      throw new UnauthorizedException();
    }
    // Verify the AT with the AT_SERCRET
    try {
      const payload = await this.jwtService.verifyAsync(atToken, {
        secret: Variable.AT_SECRET,
      });
      //Add payload (userID and name) to the req obj
      request["user"] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
  // Extract Token from Authorization in req 
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
