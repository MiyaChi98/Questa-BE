import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Variable } from '../variable';
  import {Request} from 'express'
  @Injectable()
  export class ATGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
  
    async canActivate(context: ExecutionContext){
      const request = context.switchToHttp().getRequest() as unknown as Request;
      const atToken = this.extractTokenFromHeader(request);
      if (!atToken) {
        throw new UnauthorizedException();
      }
      try {
        const payload = await this.jwtService.verifyAsync(
            atToken,
          {
            secret: Variable.AT_SECRET
          }
        );
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        // request['user'] = payload;
      } catch {
        throw new UnauthorizedException();
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }