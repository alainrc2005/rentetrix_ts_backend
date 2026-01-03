import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from '@/admin/users/users.module'
import { RentetrixTemplateService } from '@/services/template.service'

@Module({
   imports: [JwtModule, UsersModule],
   controllers: [AuthController],
   providers: [AuthService, RentetrixTemplateService]
})
export class AuthModule {
}
