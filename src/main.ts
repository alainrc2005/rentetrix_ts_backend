import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as process from 'node:process'
import * as dotenv from 'dotenv'
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import { rentetrixCreateLogger } from '@/commons/winston.logger'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
   dotenv.config({ path: process.cwd() + '/.env' })
   const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: rentetrixCreateLogger()
   })
   app.enableCors()
   app.setGlobalPrefix('api')
   app.useGlobalPipes(
      new ValidationPipe({
         whitelist: true,
         transform: true
      }),
   )
   const configService: ConfigService = app.get(ConfigService)
   return app.listen(configService.get<number>('app.port')!)
}

bootstrap()
