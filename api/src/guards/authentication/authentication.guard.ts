import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      //::==>>get header
      const request = context.switchToHttp().getRequest();
      const authorizationHeader = request.headers['authorization'];
      if (!authorizationHeader) return false;
      //::==>>get token
      const token = authorizationHeader.split(' ')[1];
      if (!token) return false;
      //::==>>check toke
      const decode = this.jwtService.decode(token);
      if (!decode) return false;
      const user = await this.prisma.user.findUnique({
        where: { id: decode.id },
      });
      //::==>>check account is valid
      if (user.deletedAt) return false;
      if (!user.active) return false;
      //::==>>remove field password
      delete user.password;
      request.user = user;
      return true;
    } catch (error) {
      return false;
    }
  }
}
