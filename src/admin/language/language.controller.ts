import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common'
import { LanguageService } from './language.service'
import type { IRequestDatatable } from '@/types'
import { SysLanguageDTO } from '@/admin/language/dto/sys.language.dto'

@Controller('language')
export class LanguageController {
   constructor(private readonly languageService: LanguageService){}

   @Post()
   list(@Body() request: IRequestDatatable) {
      return this.languageService.list(request)
   }

   @Get('fetch/:id')
   fetch(@Param('id', ParseIntPipe) id: number) {
      return this.languageService.fetch(id)
   }

   @Put('update/:id')
   update(@Param('id', ParseIntPipe) id: number, @Body() language: SysLanguageDTO) {
      return this.languageService.update(id, language)
   }
}
