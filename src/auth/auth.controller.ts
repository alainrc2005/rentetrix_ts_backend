import { Body, Controller, Param, ParseIntPipe, Post, Get } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @Post('login')
   login(@Body() signInDto: AuthDto) {
      return this.authService.login(signInDto)
   }

   @Get('logout/:id')
   logout(@Param('id', ParseIntPipe) userId: number) {
      return this.authService.logout(userId)
   }
}
