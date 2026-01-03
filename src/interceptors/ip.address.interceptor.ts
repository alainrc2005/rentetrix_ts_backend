import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { ClsService } from 'nestjs-cls'
import { Observable } from 'rxjs'
import * as requestIp from 'request-ip'
import { Request } from 'express'

@Injectable()
export class IpAddressInterceptor implements NestInterceptor {
  constructor(private readonly clsService: ClsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>()

    this.clsService.set('ip', requestIp.getClientIp(request))
    return next.handle()
  }
}
