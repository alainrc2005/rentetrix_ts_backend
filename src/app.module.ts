import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { RentetrixOrmModule } from '@/commons/datasource/typeorm.module'
import { RentetrixConfigModule } from '@/commons/config/config.module'
import { ClsModule } from 'nestjs-cls'
import { SystemModule } from '@/admin/system/system.module'
import { RolesModule } from '@/admin/roles/roles.module'
import { CategoriesModule } from '@/admin/categories/categories.module'
import { AuthModule } from '@/auth/auth.module'
import { LanguageModule } from '@/admin/language/language.module'
import { SharedModule } from '@/commons/shared/shared.module'
import { CacheModule } from '@nestjs/cache-manager'
import { LocalCacheModule } from '@/commons/local.cache/local.cache.module'
import { JwtModule } from '@nestjs/jwt'
import { AuthMiddleware } from '@/middlewares/auth.middleware'
import { ActivityLogSubscriber } from '@/subscribers/activity.log.subscriber'

@Module({
   imports: [
      CacheModule.register({ isGlobal: true }),
      AuthModule,
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
      LanguageModule,
      SharedModule,
      LocalCacheModule,
      JwtModule
   ],
   controllers: [],
   providers: [ActivityLogSubscriber]
})
export class AppModule {
   configure(consumer: MiddlewareConsumer) {
      consumer
         .apply(AuthMiddleware)
         .exclude(
            { path: '/categories', method: RequestMethod.GET },
            { path: '/auth/login', method: RequestMethod.POST },
            { path: '/users/photo/:id', method: RequestMethod.GET }
         )
         .forRoutes('*splat')
   }
}
