import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Configuration } from './configuration'

@Module({
   imports: [
      ConfigModule.forRoot({
         load: [Configuration],
         isGlobal: true
      })
   ]
})
export class RentetrixConfigModule {
}
