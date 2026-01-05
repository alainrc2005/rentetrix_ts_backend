import { Module } from '@nestjs/common'
import { RentetrixOrmModule } from '@/commons/datasource/typeorm.module'
import { RentetrixConfigModule } from '@/commons/config/config.module'
import { ClsModule } from 'nestjs-cls'
import { SystemModule } from '@/admin/system/system.module'
import { RolesModule } from '@/admin/roles/roles.module'
import { CategoriesModule } from '@/admin/categories/categories.module'
import { AuthModule } from '@/auth/auth.module'
import { LanguageModule } from './admin/language/language.module';
import { SharedModule } from './commons/shared/shared.module'

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
      SystemModule,
      RolesModule,
      CategoriesModule,
      AuthModule,
      LanguageModule,
      SharedModule
   ],
   controllers: [],
})
export class AppModule {
}
