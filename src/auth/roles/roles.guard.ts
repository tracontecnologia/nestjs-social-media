import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IJWTPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const permissions = this.reflector.get<string[]>('permissions', context.getHandler());

    const isPublic = !roles && !permissions;
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const tokenPayload = this.getTokenPayload(request);

    const matchRole = roles?.length > 0 ? roles.includes(tokenPayload.role) : true;
    const matchPermissions =
      permissions?.length > 0 ? permissions.some((p) => tokenPayload.permissions.includes(p)) : true;

    return matchRole && matchPermissions;
  }

  private getTokenPayload(request): IJWTPayload {
    const token = request.headers.authorization.split(' ').pop();
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload;
  }
}
