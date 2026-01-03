import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   ParseIntPipe,
   Post,
   Put,
   StreamableFile
} from '@nestjs/common'
import { UsersService } from './users.service'
import { UserDto } from './dto'
import type { IRequestDatatable } from '@/types'

@Controller('users')
export class UsersController {
   constructor(private readonly usersService: UsersService) {
   }

   @Post()
   list(@Body() request: IRequestDatatable) {
      return this.usersService.list(request)
   }

   @Get('fetch/:id')
   fetch(@Param('id', ParseIntPipe) id: number) {
      return this.usersService.fetch(id)
   }

   @Post('store')
   store(@Body() user: UserDto) {
      return this.usersService.store(user)
   }

   @Put('update/:id')
   update(@Param('id', ParseIntPipe) id: number, @Body() user: UserDto) {
      return this.usersService.update(id, user)
   }

   @Delete('destroy/:id')
   destroy(@Param('id', ParseIntPipe) id: number) {
      return this.usersService.destroy(id)
   }

   @Get('/photo/:id')
   async getUserPhotoById(@Param('id', ParseIntPipe) id: number): Promise<StreamableFile> {
      return this.usersService.getUserPhotoById(id)
   }
}
