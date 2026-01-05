import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from '@/admin/users/users.module'
import { TemplateService } from '@/commons/shared/template.service'

@Module({
   imports: [JwtModule, UsersModule],
   controllers: [AuthController],
   providers: [AuthService, TemplateService]
})
export class AuthModule {
}
