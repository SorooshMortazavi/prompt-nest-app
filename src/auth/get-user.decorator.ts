import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ValidUserDto } from './dto/valid-user.dto';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): ValidUserDto => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
