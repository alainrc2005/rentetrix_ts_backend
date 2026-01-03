import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import moment from 'moment'

@Injectable()
export class DateTransformInterceptor implements NestInterceptor {
   private readonly fieldNames: string[] = ['startDate', 'endDate', 'start_date', 'end_date']

   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest()
      // Transform dates in request body
      if (request.body) {
         this.transformDatesInObject(request.body)
      }
      // Transform dates in query parameters
      if (request.query) {
         this.transformDatesInObject(request.query)
      }

      return next.handle().pipe(
         map(data => {
            // You can also transform dates in the response here if needed
            return data
         }),
      )
   }

   private transformDatesInObject(obj: any): any {
      for (const key in obj) {
         if (this.fieldNames.includes(key) && obj[key]) {
            obj[key] = moment(obj[key], 'DD/MM/YYYY').format('YYYY-MM-DD')
         } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            obj[key] = this.transformDatesInObject(obj[key])
         }
      }
      return obj
   }
}