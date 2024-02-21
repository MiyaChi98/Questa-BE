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

// Guard check if RT qualify or not
export class RTGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    //Extract Token from the req
    const request = context.switchToHttp().getRequest() as unknown as Request;
    const rtToken = this.extractTokenFromHeader(request);
    if (!rtToken) {
      throw new UnauthorizedException();
    }
    // Verify the RT with the RT_SERCRET
    try {
      const payload = await this.jwtService.verifyAsync(rtToken, {
        secret: Variable.RT_SECRET,
      });
      //Add payload (userID and name) to the req obj
      request["user"] = payload;
      request["user"].rt = rtToken;
    } catch {
      throw new UnauthorizedException("The user by this name just logout");
    }
    return true;
  }
  // Extract Token from Authorization in req
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
