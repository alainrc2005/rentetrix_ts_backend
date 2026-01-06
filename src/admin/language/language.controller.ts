import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common'
import { LanguageService } from './language.service'
import type { IRequestDatatable } from '@/types'
import { SysLanguageDTO } from '@/admin/language/dto/sys.language.dto'

@Controller('language')
export class LanguageController {
   constructor(private readonly service: LanguageService){}

   @Post()
   list(@Body() request: IRequestDatatable) {
      return this.service.list(request)
   }

   @Get('fetch/:id')
   fetch(@Param('id', ParseIntPipe) id: number) {
      return this.service.fetch(id)
   }

   @Put('update/:id')
   update(@Param('id', ParseIntPipe) id: number, @Body() language: SysLanguageDTO) {
      return this.service.update(id, language)
   }
}
