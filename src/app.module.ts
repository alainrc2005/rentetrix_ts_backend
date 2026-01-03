import { Module } from '@nestjs/common'
import { RentetrixOrmModule } from '@/commons/datasource/typeorm.module'
import { RentetrixConfigModule } from '@/commons/config/config.module'
import { ClsModule } from 'nestjs-cls'
import { SystemModule } from '@/admin/system/system.module'

@Module({
   imports: [
      RentetrixOrmModule,
      RentetrixConfigModule,
      ClsModule.forRoot({
         global: true,
         middleware: {
            mount: true
         },
         interceptor: { mount: true },
         guard: {
            generateId: true, // Optional: Generate a unique ID for each request
            mount: true, // Mount ClsGuard automatically
         }
      }),
      SystemModule
   ],
})
export class AppModule {
}
