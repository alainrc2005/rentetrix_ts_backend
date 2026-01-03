/**
 * Función para logger Winston aplicados a los microservicios
 * @author Alain Ramírez Cabrejas <alain.ramirez@wimixsolutions.com>
 */
import 'winston-daily-rotate-file'
import { WinstonModule } from 'nest-winston'
import { transports, format } from 'winston'
import { LoggerService } from '@nestjs/common'

export function rentetrixCreateLogger(): LoggerService {
   return WinstonModule.createLogger({
      transports: [
         new transports.DailyRotateFile({
            level: 'debug',
            filename: `storage/logs/rentetrix-%DATE%.log`,
            format: format.combine(format.timestamp(), format.json()),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            handleRejections: true,
            handleExceptions: true,
         }),
         new transports.Console({
            format: format.combine(
               format.cli(),
               format.splat(),
               format.timestamp(),
               format.printf(
                  ({ level, message, context, timestamp }) => {
                     return `${timestamp} [${context}] ${level}: ${message}`
                  })
            ),
            handleExceptions: true,
            handleRejections: true,
         }),
      ],
      exitOnError: false
   })
}
