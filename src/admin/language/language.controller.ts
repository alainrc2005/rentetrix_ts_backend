import { Body, Controller, Post } from '@nestjs/common'
import { LanguageService } from './language.service'
import type { IRequestDatatable } from '@/types'

@Controller('language')
export class LanguageController {
   constructor(private readonly languageService: LanguageService){}

   @Post()
   list(@Body() request: IRequestDatatable) {
      return this.languageService.list(request)
   }
}
